export function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={`group flex gap-3 px-2 py-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
          isUser
            ? 'bg-violet-600 text-white'
            : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
        }`}
      >
        {isUser ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a5 5 0 015 5c0 2-1.5 4-3.5 4.5L15 21H9l1.5-9.5C8.5 11 7 9 7 7a5 5 0 015-5z" />
          </svg>
        )}
      </div>

      {/* Bubble */}
      <div className={`flex max-w-[78%] flex-col gap-1 ${isUser ? 'items-end' : 'items-start'}`}>
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
            isUser
              ? 'bg-violet-600 text-white rounded-tr-sm'
              : 'bg-zinc-900 text-zinc-100 border border-zinc-800 rounded-tl-sm'
          } ${message.isOptimistic ? 'opacity-70' : ''}`}
        >
          <p className="whitespace-pre-wrap break-words">
            {message.content || (message.isStreaming ? '\u00A0' : '…')}
          </p>
          {message.isStreaming && !message.content && (
            <span className="inline-flex items-center gap-1 py-0.5">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500 [animation-delay:-0.2s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500 [animation-delay:-0.1s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500" />
            </span>
          )}
        </div>
      </div>
    </div>
  );
}