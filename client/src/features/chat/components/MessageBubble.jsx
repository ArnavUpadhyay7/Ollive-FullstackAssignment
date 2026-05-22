export function MessageBubble({ message }) {
  const isUser = message.role === 'user';
  const isAssistant = message.role === 'assistant';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed sm:max-w-[75%] ${
          isUser
            ? 'bg-violet-600 text-white'
            : 'border border-zinc-800 bg-zinc-900 text-zinc-100'
        } ${message.isOptimistic ? 'opacity-80' : ''}`}
      >
        {isAssistant && (
          <p className="mb-1 text-xs font-medium text-violet-400">Assistant</p>
        )}
        {isUser && <p className="mb-1 text-xs font-medium text-violet-200/80">You</p>}
        <p className="whitespace-pre-wrap break-words">
          {message.content || (message.isStreaming ? '' : '…')}
        </p>
        {message.isStreaming && !message.content && (
          <span className="mt-2 inline-flex gap-1">
            <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-500 [animation-delay:-0.2s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-500 [animation-delay:-0.1s]" />
            <span className="h-2 w-2 animate-bounce rounded-full bg-zinc-500" />
          </span>
        )}
      </div>
    </div>
  );
}
