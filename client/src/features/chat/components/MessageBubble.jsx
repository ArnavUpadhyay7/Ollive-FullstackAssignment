export function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  if (isUser) {
    return (
      <div className="flex justify-end py-1">
        <div
          className={`max-w-[70%] rounded-3xl bg-zinc-700 px-5 py-3 text-sm leading-relaxed text-zinc-100 sm:max-w-[60%] ${
            message.isOptimistic ? 'opacity-70' : ''
          }`}
        >
          <p className="whitespace-pre-wrap break-words">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-4 py-2">
      {/* Assistant avatar */}
      <div className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-zinc-700/60 bg-zinc-800">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 text-violet-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2a5 5 0 015 5c0 2-1.5 4-3.5 4.5L15 21H9l1.5-9.5C8.5 11 7 9 7 7a5 5 0 015-5z" />
        </svg>
      </div>

      <div className={`min-w-0 flex-1 text-sm leading-relaxed text-zinc-100 ${message.isOptimistic ? 'opacity-70' : ''}`}>
        <p className="whitespace-pre-wrap break-words">
          {message.content || (message.isStreaming ? '' : '…')}
        </p>
        {message.isStreaming && !message.content && (
          <span className="mt-2 inline-flex items-center gap-1">
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500 [animation-delay:-0.2s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500 [animation-delay:-0.1s]" />
            <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-zinc-500" />
          </span>
        )}
      </div>
    </div>
  );
}