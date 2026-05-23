import { useState } from 'react';

export function ChatInput({ onSend, onCancel, sending, streaming, disabled }) {
  const [input, setInput] = useState('');
  const isGenerating = sending || streaming;

  const handleSubmit = (event) => {
    event?.preventDefault();
    if (!input.trim() || disabled || sending) return;
    onSend(input);
    setInput('');
  };

  return (
    <div className="border-t border-zinc-800/60 bg-zinc-950 px-4 py-4">
      <div className="mx-auto max-w-2xl">
        <div className={`relative flex items-end gap-2 rounded-2xl border bg-zinc-900 px-4 py-3 transition-colors ${
          disabled ? 'border-zinc-800' : 'border-zinc-700 focus-within:border-violet-500/60 focus-within:ring-1 focus-within:ring-violet-500/30'
        }`}>
          <textarea
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
            className="max-h-40 min-h-[24px] flex-1 resize-none bg-transparent text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none disabled:opacity-50"
            style={{ height: 'auto' }}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
          />

          <div className="flex shrink-0 items-center gap-2 pb-0.5">
            {isGenerating ? (
              <>
                <span className="flex items-center gap-1">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400 [animation-delay:150ms]" />
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400 [animation-delay:300ms]" />
                </span>
                <button
                  type="button"
                  onClick={onCancel}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700 text-zinc-400 transition hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400"
                  aria-label="Cancel generation"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor">
                    <rect x="6" y="6" width="12" height="12" rx="1" />
                  </svg>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={disabled || !input.trim()}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-600 text-white transition hover:bg-violet-500 disabled:opacity-30 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 rotate-90" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 19V5M5 12l7-7 7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>

        <p className="mt-2 text-center text-[11px] text-zinc-700">
          Press <kbd className="rounded border border-zinc-800 px-1 py-0.5 font-mono text-[10px] text-zinc-600">Enter</kbd> to send · <kbd className="rounded border border-zinc-800 px-1 py-0.5 font-mono text-[10px] text-zinc-600">Shift+Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
}