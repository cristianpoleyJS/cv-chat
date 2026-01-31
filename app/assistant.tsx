"use client";

import { AssistantRuntimeProvider } from "@assistant-ui/react";
import {
  useChatRuntime,
  AssistantChatTransport,
} from "@assistant-ui/react-ai-sdk";
import { Thread } from "@/components/assistant-ui/thread";
import { LocaleProvider, useLocaleContext } from "@/contexts/locale-context";
import { useMemo } from "react";

const AssistantContent = () => {
  return (
    <div className="flex h-dvh w-full flex-col bg-linear-to-br from-slate-950 via-slate-900 to-slate-900">
      <div className="flex-1 overflow-hidden">
        <Thread />
      </div>
    </div>
  );
};

const AssistantWithRuntime = () => {
  const { locale } = useLocaleContext();

  const runtime = useChatRuntime({
    transport: useMemo(
      () =>
        new AssistantChatTransport({
          api: "/api/chat",
          body: { locale },
        }),
      [locale]
    ),
  });

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <AssistantContent />
    </AssistantRuntimeProvider>
  );
};

export const Assistant = () => {
  return (
    <LocaleProvider>
      <AssistantWithRuntime />
    </LocaleProvider>
  );
};
