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
  const { t } = useLocaleContext();

  return (
    <div className="flex h-dvh w-full flex-col bg-stone-900">
      <header className="border-b border-stone-800/80 bg-stone-950/95 backdrop-blur-sm px-4 sm:px-6 py-3 sm:py-4">
        <h1 className="text-base sm:text-lg font-semibold text-stone-100">{t.header.name}</h1>
        <p className="text-xs sm:text-sm text-stone-400 line-clamp-1">
          {t.header.title}
        </p>
      </header>
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
