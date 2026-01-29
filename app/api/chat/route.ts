import { openai } from "@ai-sdk/openai";
import { streamText, convertToModelMessages, type UIMessage } from "ai";
import { systemPrompt } from "./system_prompt";
import { checkRateLimit } from "@/lib/rate-limit";
import { headers } from "next/headers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getClientIP(headersList: Headers): string {
  const forwardedFor = headersList.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }
  
  const realIP = headersList.get("x-real-ip");
  if (realIP) {
    return realIP;
  }
  
  return "anonymous";
}

async function fetchContextMarkdown(locale: string): Promise<string> {
  const url = locale === "es" ? process.env.CONTEXT_URL_ES : process.env.CONTEXT_URL_EN;
  if (!url) {
    throw new Error(`Missing CONTEXT_URL_${locale.toUpperCase()} env var.`);
  }

  const res = await fetch(url, {
    headers: {
      ...(process.env.CONTEXT_AUTH_BEARER
        ? { Authorization: `Bearer ${process.env.CONTEXT_AUTH_BEARER}` }
        : {}),
      Accept: "text/markdown, text/plain;q=0.9, */*;q=0.8",
    },
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch CONTEXT_URL (${res.status} ${res.statusText})`);
  }

  const text = await res.text();

  const MAX_CHARS = 35_000;
  return text.length > MAX_CHARS ? text.slice(0, MAX_CHARS) : text;
}

export async function POST(req: Request) {
  // Rate limiting
  const headersList = await headers();
  const ip = getClientIP(headersList);
  
  const rateLimitResult = await checkRateLimit(ip);
  
  if (!rateLimitResult.success) {
    return new Response(
      JSON.stringify({ 
        error: "Too many requests. Please try again later.",
        retryAfter: Math.ceil((rateLimitResult.reset - Date.now()) / 1000)
      }),
      { 
        status: 429,
        headers: {
          "Content-Type": "application/json",
          ...rateLimitResult.headers,
          "Retry-After": Math.ceil((rateLimitResult.reset - Date.now()) / 1000).toString(),
        }
      }
    );
  }

  const { messages, locale = "en" }: { messages: UIMessage[]; locale?: string } = await req.json();

  let context = "";
  try {
    context = await fetchContextMarkdown(locale);
  } catch (e) {
    context =
      "Context is currently unavailable. You must respond: \"I don't have that information.\"";
    console.error(e);
  }

  const modelMessages = convertToModelMessages(messages);

  const guardedMessages = [
    { role: "system" as const, content: systemPrompt(context) },
    ...modelMessages,
  ];

  const result = streamText({
    model: openai.responses("gpt-5-nano"),
    messages: guardedMessages,
    providerOptions: {
      openai: {
        reasoningEffort: "low",
        reasoningSummary: "auto",
      },
    },
  });

  return result.toUIMessageStreamResponse({
    sendReasoning: true,
  });
}