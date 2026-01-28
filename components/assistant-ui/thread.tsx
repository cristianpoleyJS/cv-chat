"use client";

import {
  ComposerAddAttachment,
  ComposerAttachments,
  UserMessageAttachments,
} from "@/components/assistant-ui/attachment";
import { MarkdownText } from "@/components/assistant-ui/markdown-text";
import {
  Reasoning,
  ReasoningGroup,
} from "@/components/assistant-ui/reasoning";
import { ToolFallback } from "@/components/assistant-ui/tool-fallback";
import { TooltipIconButton } from "@/components/assistant-ui/tooltip-icon-button";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLocaleContext } from "@/contexts/locale-context";
import {
  ActionBarMorePrimitive,
  ActionBarPrimitive,
  AssistantIf,
  BranchPickerPrimitive,
  ComposerPrimitive,
  ErrorPrimitive,
  MessagePrimitive,
  ThreadPrimitive,
  useThread,
} from "@assistant-ui/react";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CodeIcon,
  CopyIcon,
  DownloadIcon,
  MoreHorizontalIcon,
  PencilIcon,
  RefreshCwIcon,
  RocketIcon,
  RotateCcwIcon,
  SendIcon,
  SparklesIcon,
  SquareIcon,
  TargetIcon,
  UserIcon,
  UsersIcon,
} from "lucide-react";
import type { FC, ReactNode } from "react";

export const Thread: FC = () => {
  return (
    <ThreadPrimitive.Root
      className="aui-root aui-thread-root @container flex h-full flex-col bg-stone-900"
      style={{
        ["--thread-max-width" as string]: "52rem",
      }}
    >
      <ThreadPrimitive.Viewport
        turnAnchor="top"
        className="aui-thread-viewport relative flex flex-1 flex-col overflow-x-auto overflow-y-scroll scroll-smooth px-2 sm:px-4 pt-4"
      >
        <AssistantIf condition={({ thread }) => thread.isEmpty}>
          <ThreadWelcome />
        </AssistantIf>

        <ThreadPrimitive.Messages
          components={{
            UserMessage,
            EditComposer,
            AssistantMessage,
          }}
        />

        <ThreadPrimitive.ViewportFooter className="aui-thread-viewport-footer sticky bottom-0 mx-auto mt-auto flex w-full max-w-(--thread-max-width) flex-col gap-3 sm:gap-4 overflow-visible rounded-t-3xl bg-transparent pb-3 sm:pb-4 md:pb-6">
          <ThreadScrollToBottom />
          <Composer />
          <ResetButton />
        </ThreadPrimitive.ViewportFooter>
      </ThreadPrimitive.Viewport>
    </ThreadPrimitive.Root>
  );
};

const ThreadScrollToBottom: FC = () => {
  const { t } = useLocaleContext();
  
  return (
    <ThreadPrimitive.ScrollToBottom asChild>
      <TooltipIconButton
        tooltip={t.actions.scrollToBottom}
        variant="outline"
        className="aui-thread-scroll-to-bottom absolute -top-12 z-10 self-center rounded-full p-4 disabled:invisible bg-stone-800 hover:bg-stone-700 border-stone-700 text-stone-300"
      >
        <ArrowDownIcon />
      </TooltipIconButton>
    </ThreadPrimitive.ScrollToBottom>
  );
};

const ResetButton: FC = () => {
  const { t } = useLocaleContext();
  const thread = useThread();
  
  const handleReset = () => {
    window.location.reload();
  };

  const isDisabled = thread.isRunning;

  return (
    <AssistantIf condition={({ thread }) => !thread.isEmpty}>
      <div className="flex justify-center">
        <Button
          onClick={handleReset}
          disabled={isDisabled}
          variant="ghost"
          size="sm"
          className="gap-2 rounded-full border border-stone-700 bg-stone-800/80 px-4 py-2 text-stone-400 hover:bg-stone-700 hover:text-stone-100 hover:border-stone-600 transition-all duration-200 text-xs disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-stone-800/80 disabled:hover:text-stone-400 disabled:hover:border-stone-700"
        >
          <RotateCcwIcon className="size-3.5" />
          {t.actions.reset}
        </Button>
      </div>
    </AssistantIf>
  );
};

const ThreadWelcome: FC = () => {
  const { t, config } = useLocaleContext();
  
  return (
    <div className="aui-thread-welcome-root mx-auto my-auto flex w-full max-w-(--thread-max-width) grow flex-col justify-center px-4 sm:px-6">
      <div className="aui-thread-welcome-center flex w-full flex-col items-center justify-center">
        <div className="aui-thread-welcome-message flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-center sm:text-left">
          <div className="fade-in slide-in-from-left-2 animate-in duration-200 shrink-0">
            <div className="relative">
              <img
                src={config.avatarUrl}
                alt={t.welcome.avatarAlt}
                className="size-16 sm:size-30 rounded-full object-cover ring-2 ring-stone-700/50 shadow-xl shadow-stone-950"
              />
              <div className="absolute -bottom-0.5 -right-0.5 size-5 sm:size-6 rounded-full bg-emerald-500 ring-2 ring-stone-900 flex items-center justify-center">
                <SparklesIcon className="size-2.5 sm:size-3 text-white" />
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <h1 className="aui-thread-welcome-message-inner fade-in slide-in-from-bottom-1 animate-in font-bold text-xl sm:text-2xl text-stone-100 duration-200 delay-75">
              {t.welcome.greeting}
            </h1>
            <p className="aui-thread-welcome-message-inner fade-in slide-in-from-bottom-1 animate-in text-stone-400 text-xs sm:text-sm mt-1.5 delay-100 duration-200 max-w-sm leading-relaxed">
              {t.welcome.description}
            </p>
          </div>
        </div>
      </div>
      <ThreadSuggestions />
    </div>
  );
};

const SUGGESTION_ICONS: Record<string, ReactNode> = {
  code: <CodeIcon className="size-5 sm:size-6 text-blue-400" />,
  rocket: <RocketIcon className="size-5 sm:size-6 text-orange-400" />,
  users: <UsersIcon className="size-5 sm:size-6 text-violet-400" />,
  target: <TargetIcon className="size-5 sm:size-6 text-emerald-400" />,
};

const ThreadSuggestions: FC = () => {
  const { t } = useLocaleContext();
  
  return (
    <div className="aui-thread-welcome-suggestions mt-6 sm:mt-8 w-full">
      <div className="flex items-center gap-2 mb-3 sm:mb-4">
        <SparklesIcon className="size-4 text-stone-500" />
        <span className="text-xs sm:text-sm font-medium text-stone-400">{t.suggestions.title}</span>
      </div>
      <div className="grid w-full grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 pb-4">
        {t.suggestions.items.map((suggestion: { icon: string; title: string; label: string; prompt: string }, index: number) => (
          <div
            key={suggestion.prompt}
            className="aui-thread-welcome-suggestion-display fade-in slide-in-from-bottom-2 animate-in fill-mode-both duration-200"
            style={{ animationDelay: `${150 + index * 75}ms` }}
          >
            <ThreadPrimitive.Suggestion prompt={suggestion.prompt} send asChild>
              <Button
                variant="ghost"
                className="aui-thread-welcome-suggestion cursor-pointer group h-full w-full flex-col items-start justify-start gap-2 rounded-2xl border border-stone-700/60 bg-stone-800/50 backdrop-blur-sm px-4 py-4 text-left transition-all duration-300 hover:bg-stone-800 hover:border-stone-600 hover:shadow-lg hover:shadow-stone-900/50 hover:scale-[1.02] active:scale-[0.98]"
                aria-label={suggestion.prompt}
              >
                <div className="mb-1 transition-transform duration-300 group-hover:scale-110">
                  {SUGGESTION_ICONS[suggestion.icon]}
                </div>
                <span className="aui-thread-welcome-suggestion-text-1 font-semibold text-sm text-stone-200 group-hover:text-stone-50 transition-colors">
                  {suggestion.title}
                </span>
                <span className="aui-thread-welcome-suggestion-text-2 text-stone-500 text-xs sm:text-sm font-normal leading-relaxed whitespace-normal wrap-break-word group-hover:text-stone-400 transition-colors">
                  {suggestion.label}
                </span>
              </Button>
            </ThreadPrimitive.Suggestion>
          </div>
        ))}
      </div>
    </div>
  );
};

const Composer: FC = () => {
  const { t } = useLocaleContext();
  
  return (
    <ComposerPrimitive.Root className="aui-composer-root relative flex w-full flex-col px-2 sm:px-0">
      <ComposerPrimitive.AttachmentDropzone className="aui-composer-attachment-dropzone flex w-full flex-col rounded-2xl border border-stone-700/60 bg-stone-800/80 backdrop-blur-sm px-1 pt-2 shadow-lg shadow-stone-950/50 outline-none transition-all duration-300 has-[textarea:focus-visible]:border-stone-600 has-[textarea:focus-visible]:ring-2 has-[textarea:focus-visible]:ring-stone-600/30 has-[textarea:focus-visible]:bg-stone-800 data-[dragging=true]:border-stone-500 data-[dragging=true]:border-dashed data-[dragging=true]:bg-stone-700">
        <ComposerAttachments />
        <ComposerPrimitive.Input
          placeholder={t.composer.placeholder}
          className="aui-composer-input mb-1 max-h-32 min-h-12 sm:min-h-14 w-full resize-none bg-transparent px-3 sm:px-4 pt-2 pb-3 text-sm text-stone-100 outline-none placeholder:text-stone-500 focus-visible:ring-0"
          rows={1}
          autoFocus
          aria-label={t.composer.sendAriaLabel}
        />
        <ComposerAction />
      </ComposerPrimitive.AttachmentDropzone>
    </ComposerPrimitive.Root>
  );
};

const ComposerAction: FC = () => {
  const { t } = useLocaleContext();
  
  return (
    <div className="aui-composer-action-wrapper relative mx-2 mb-2 flex items-center justify-end">
      <AssistantIf condition={({ thread }) => !thread.isRunning}>
        <ComposerPrimitive.Send asChild>
          <TooltipIconButton
            tooltip={t.composer.sendTooltip}
            side="bottom"
            type="submit"
            variant="ghost"
            size="icon"
            className="aui-composer-send size-9 rounded-full text-stone-500 hover:text-stone-300 hover:bg-stone-700"
            aria-label={t.composer.sendAriaLabel}
          >
            <SendIcon className="aui-composer-send-icon size-5" />
          </TooltipIconButton>
        </ComposerPrimitive.Send>
      </AssistantIf>

      <AssistantIf condition={({ thread }) => thread.isRunning}>
        <ComposerPrimitive.Cancel asChild>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="aui-composer-cancel size-9 rounded-full text-stone-500 hover:text-stone-300 hover:bg-stone-700"
            aria-label={t.composer.stopAriaLabel}
          >
            <SquareIcon className="aui-composer-cancel-icon size-3 fill-current" />
          </Button>
        </ComposerPrimitive.Cancel>
      </AssistantIf>
    </div>
  );
};

const MessageError: FC = () => {
  return (
    <MessagePrimitive.Error>
      <ErrorPrimitive.Root className="aui-message-error-root mt-2 rounded-md border border-destructive bg-destructive/10 p-3 text-destructive text-sm dark:bg-destructive/5 dark:text-red-200">
        <ErrorPrimitive.Message className="aui-message-error-message line-clamp-2" />
      </ErrorPrimitive.Root>
    </MessagePrimitive.Error>
  );
};

const AssistantMessage: FC = () => {
  const { t, config } = useLocaleContext();
  
  return (
    <MessagePrimitive.Root
      className="aui-assistant-message-root fade-in slide-in-from-bottom-1 relative mx-auto w-full max-w-(--thread-max-width) animate-in py-3 duration-150"
      data-role="assistant"
    >
      <div className="flex gap-3 px-2">
        <div className="shrink-0 mt-1">
          <div className="relative">
            <img
              src={config.avatarUrl}
              alt={t.messages.assistantAlt}
              className="size-8 rounded-full object-cover ring-2 ring-stone-700/50"
            />
            <div className="absolute -bottom-0.5 -right-0.5 size-3.5 rounded-full bg-emerald-500 ring-2 ring-stone-900 flex items-center justify-center">
              <SparklesIcon className="size-2 text-white" />
            </div>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="aui-assistant-message-content wrap-break-word text-stone-100 leading-relaxed">
            <MessagePrimitive.Parts
              components={{
                Text: MarkdownText,
                Reasoning,
                ReasoningGroup,
                tools: { Fallback: ToolFallback },
              }}
            />
            <MessageError />
          </div>
          <div className="aui-assistant-message-footer mt-1 flex">
            <BranchPicker />
            <AssistantActionBar />
          </div>
        </div>
      </div>
    </MessagePrimitive.Root>
  );
};

const AssistantActionBar: FC = () => {
  const { t } = useLocaleContext();
  
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      autohideFloat="single-branch"
      className="aui-assistant-action-bar-root col-start-3 row-start-2 -ml-1 flex gap-1 text-stone-400 data-floating:absolute data-floating:rounded-md data-floating:border data-floating:border-stone-700 data-floating:bg-stone-800 data-floating:p-1 data-floating:shadow-sm"
    >
      <ActionBarPrimitive.Copy asChild>
        <TooltipIconButton tooltip={t.actions.copy}>
          <AssistantIf condition={({ message }) => message.isCopied}>
            <CheckIcon />
          </AssistantIf>
          <AssistantIf condition={({ message }) => !message.isCopied}>
            <CopyIcon />
          </AssistantIf>
        </TooltipIconButton>
      </ActionBarPrimitive.Copy>
      <ActionBarPrimitive.Reload asChild>
        <TooltipIconButton tooltip={t.actions.refresh}>
          <RefreshCwIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Reload>
      <ActionBarMorePrimitive.Root>
        <ActionBarMorePrimitive.Trigger asChild>
          <TooltipIconButton
            tooltip={t.actions.more}
            className="data-[state=open]:bg-accent"
          >
            <MoreHorizontalIcon />
          </TooltipIconButton>
        </ActionBarMorePrimitive.Trigger>
        <ActionBarMorePrimitive.Content
          side="bottom"
          align="start"
          className="aui-action-bar-more-content z-50 min-w-32 overflow-hidden rounded-md border border-stone-700 bg-stone-800 p-1 text-stone-200 shadow-md"
        >
          <ActionBarPrimitive.ExportMarkdown asChild>
            <ActionBarMorePrimitive.Item className="aui-action-bar-more-item flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-stone-700 hover:text-stone-100 focus:bg-stone-700 focus:text-stone-100">
              <DownloadIcon className="size-4" />
              {t.actions.exportMarkdown}
            </ActionBarMorePrimitive.Item>
          </ActionBarPrimitive.ExportMarkdown>
        </ActionBarMorePrimitive.Content>
      </ActionBarMorePrimitive.Root>
    </ActionBarPrimitive.Root>
  );
};

const UserMessage: FC = () => {
  return (
    <MessagePrimitive.Root
      className="aui-user-message-root fade-in slide-in-from-bottom-1 mx-auto w-full max-w-(--thread-max-width) animate-in py-3 duration-150"
      data-role="user"
    >
      <div className="flex gap-3 px-2 justify-end">
        <div className="flex-1 min-w-0 flex flex-col items-end">
          <UserMessageAttachments />
          <div className="aui-user-message-content-wrapper relative max-w-[85%]">
            <div className="aui-user-message-content wrap-break-word rounded-2xl bg-stone-700 px-4 py-2.5 text-stone-100">
              <MessagePrimitive.Parts />
            </div>
            <div className="aui-user-action-bar-wrapper absolute top-1/2 left-0 -translate-x-full -translate-y-1/2 pr-2">
              <UserActionBar />
            </div>
          </div>
          <BranchPicker className="aui-user-branch-picker mt-1 -mr-1 justify-end" />
        </div>
        <div className="shrink-0 mt-1">
          <div className="size-8 rounded-full bg-stone-600 ring-2 ring-stone-700/50 flex items-center justify-center">
            <UserIcon className="size-4 text-stone-300" />
          </div>
        </div>
      </div>
    </MessagePrimitive.Root>
  );
};

const UserActionBar: FC = () => {
  const { t } = useLocaleContext();
  
  return (
    <ActionBarPrimitive.Root
      hideWhenRunning
      autohide="not-last"
      className="aui-user-action-bar-root flex flex-col items-end"
    >
      <ActionBarPrimitive.Edit asChild>
        <TooltipIconButton tooltip={t.actions.edit} className="aui-user-action-edit p-4">
          <PencilIcon />
        </TooltipIconButton>
      </ActionBarPrimitive.Edit>
    </ActionBarPrimitive.Root>
  );
};

const EditComposer: FC = () => {
  const { t } = useLocaleContext();
  
  return (
    <MessagePrimitive.Root className="aui-edit-composer-wrapper mx-auto flex w-full max-w-(--thread-max-width) flex-col px-2 py-3">
      <ComposerPrimitive.Root className="aui-edit-composer-root ml-auto flex w-full max-w-[85%] flex-col rounded-2xl bg-muted">
        <ComposerPrimitive.Input
          className="aui-edit-composer-input min-h-14 w-full resize-none bg-transparent p-4 text-foreground text-sm outline-none"
          autoFocus
        />
        <div className="aui-edit-composer-footer mx-3 mb-3 flex items-center gap-2 self-end">
          <ComposerPrimitive.Cancel asChild>
            <Button variant="ghost" size="sm">
              {t.actions.cancel}
            </Button>
          </ComposerPrimitive.Cancel>
          <ComposerPrimitive.Send asChild>
            <Button size="sm">{t.actions.update}</Button>
          </ComposerPrimitive.Send>
        </div>
      </ComposerPrimitive.Root>
    </MessagePrimitive.Root>
  );
};

const BranchPicker: FC<BranchPickerPrimitive.Root.Props> = ({
  className,
  ...rest
}) => {
  const { t } = useLocaleContext();
  
  return (
    <BranchPickerPrimitive.Root
      hideWhenSingleBranch
      className={cn(
        "aui-branch-picker-root mr-2 -ml-2 inline-flex items-center text-muted-foreground text-xs",
        className,
      )}
      {...rest}
    >
      <BranchPickerPrimitive.Previous asChild>
        <TooltipIconButton tooltip={t.actions.previous}>
          <ChevronLeftIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Previous>
      <span className="aui-branch-picker-state font-medium">
        <BranchPickerPrimitive.Number /> / <BranchPickerPrimitive.Count />
      </span>
      <BranchPickerPrimitive.Next asChild>
        <TooltipIconButton tooltip={t.actions.next}>
          <ChevronRightIcon />
        </TooltipIconButton>
      </BranchPickerPrimitive.Next>
    </BranchPickerPrimitive.Root>
  );
};
