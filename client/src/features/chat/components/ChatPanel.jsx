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
}) {
  return (
    <section className="flex min-w-0 flex-1 flex-col">
      {error && (
        <div className="px-4 pt-4">
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
