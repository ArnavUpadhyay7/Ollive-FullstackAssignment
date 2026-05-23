import { useState, useRef, useEffect } from 'react';

export function ChatInput({ onSend, onCancel, sending, streaming, disabled }) {
  const [input, setInput] = useState('');
  const textareaRef = useRef(null);
  const isGenerating = sending || streaming;

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [input]);

  const handleSubmit = () => {
    if (!input.trim() || disabled || sending) return;
    onSend(input);
    setInput('');
    if (textareaRef.current) textareaRef.current.style.height = 'auto';
  };

  return (
    <div className="shrink-0 border-t border-zinc-800/60 bg-zinc-950 px-4 pb-6 pt-4 sm:px-6">
      <div className="mx-auto max-w-2xl">
        {/* Input box */}
        <div
          className={`flex items-end rounded-2xl border bg-zinc-900 transition-colors ${
            disabled
              ? 'border-zinc-800'
              : 'border-zinc-700/80 focus-within:border-violet-500/50 focus-within:ring-1 focus-within:ring-violet-500/20'
          }`}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            rows={1}
            placeholder={disabled ? 'Select or create a conversation…' : 'Message Ollive…'}
            disabled={disabled || sending}
            className="flex-1 resize-none bg-transparent py-3.5 pl-4 pr-2 text-sm leading-6 text-zinc-100 placeholder:text-zinc-600 focus:outline-none disabled:opacity-40"
          />

          {/* Actions */}
          <div className="flex items-center gap-1.5 px-3 py-3">
            {isGenerating ? (
              <>
                <span className="mr-1 flex items-center gap-0.5">
                  <span className="h-1 w-1 animate-pulse rounded-full bg-violet-400" />
                  <span className="h-1 w-1 animate-pulse rounded-full bg-violet-400 [animation-delay:150ms]" />
                  <span className="h-1 w-1 animate-pulse rounded-full bg-violet-400 [animation-delay:300ms]" />
                </span>
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700 text-zinc-400 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
                  aria-label="Stop generating"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="6" width="12" height="12" rx="1.5" />
                  </svg>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={disabled || !input.trim()}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-30"
                aria-label="Send message"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Hint */}
        <p className="mt-2 text-center text-[11px] text-zinc-700">
          <kbd className="rounded border border-zinc-800/80 px-1 py-0.5 font-mono text-[10px] text-zinc-600">Enter</kbd>
          {' '}to send &nbsp;·&nbsp;{' '}
          <kbd className="rounded border border-zinc-800/80 px-1 py-0.5 font-mono text-[10px] text-zinc-600">Shift+Enter</kbd>
          {' '}for new line
        </p>
      </div>
    </div>
  );
}