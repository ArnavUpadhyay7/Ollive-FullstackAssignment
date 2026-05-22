import { useEffect, useRef } from 'react';
import { MessageBubble } from './MessageBubble';
import { EmptyState } from '../../../components/ui/EmptyState';
import { Spinner } from '../../../components/ui/Spinner';

export function MessageList({ messages, loading, onCreateConversation }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!messages.length) {
    return (
      <EmptyState
        title="Start a conversation"
        description="Send a message to begin. Your chat history is saved automatically."
        action={
          <button
            type="button"
            onClick={onCreateConversation}
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm text-white hover:bg-violet-500"
          >
            New conversation
          </button>
        }
      />
    );
  }

  return (
    <div className="flex-1 space-y-4 overflow-y-auto px-4 py-6 md:px-8">
      {messages.map((message) => (
        <MessageBubble key={message._id} message={message} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
