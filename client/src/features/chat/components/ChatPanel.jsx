import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import { ErrorBanner } from '../../../components/ui/ErrorBanner';

export function ChatPanel({
  messages,
  loading,
  sending,
  streaming,
  error,
  hasConversation,
  onSend,
  onCancel,
  onCreateConversation,
  onClearError,
  onRetry,
  onMenuOpen,
}) {
  return (
    <section className="relative flex min-w-0 flex-1 flex-col bg-zinc-950">
      {/* Mobile top bar */}
      <div className="flex h-14 shrink-0 items-center border-b border-zinc-800/60 px-4 md:hidden">
        <button
          type="button"
          onClick={onMenuOpen}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-100"
          aria-label="Open sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <span className="ml-3 text-sm font-semibold text-zinc-100">Ollive</span>
      </div>

      {/* Error toast — top right, non-blocking */}
      {error && (
        <div className="absolute right-4 top-4 z-40 md:right-6 md:top-6">
          <ErrorBanner message={error} onDismiss={onClearError} onRetry={onRetry} />
        </div>
      )}

      <MessageList
        messages={messages}
        loading={loading}
        onCreateConversation={onCreateConversation}
      />

      <ChatInput
        onSend={onSend}
        onCancel={onCancel}
        sending={sending}
        streaming={streaming}
        disabled={!hasConversation}
      />
    </section>
  );
}