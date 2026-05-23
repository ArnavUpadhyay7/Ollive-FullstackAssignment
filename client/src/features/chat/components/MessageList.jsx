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
        <Spinner className="h-6 w-6 text-zinc-600" />
      </div>
    );
  }

  if (!messages.length) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zinc-900 border border-zinc-800 shadow-lg">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
          </svg>
        </div>
        <div>
          <p className="text-lg font-medium text-zinc-200">How can I help you today?</p>
          <p className="mt-1 text-sm text-zinc-600">Send a message to get started.</p>
        </div>
        <button
          type="button"
          onClick={onCreateConversation}
          className="rounded-lg border border-zinc-800 bg-zinc-900 px-4 py-2 text-sm text-zinc-300 transition hover:bg-zinc-800 hover:text-zinc-100"
        >
          New conversation
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-2xl px-4 py-8 space-y-1">
        {messages.map((message) => (
          <MessageBubble key={message._id} message={message} />
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}