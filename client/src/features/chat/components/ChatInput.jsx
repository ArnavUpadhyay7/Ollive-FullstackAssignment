import { useState } from 'react';
import { Button } from '../../../components/ui/Button';

export function ChatInput({ onSend, onCancel, sending, streaming, disabled }) {
  const [input, setInput] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!input.trim() || disabled || sending) return;
    onSend(input);
    setInput('');
  };

  const isGenerating = sending || streaming;

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-zinc-800 bg-zinc-900/80 p-4 backdrop-blur"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-3">
        {isGenerating && (
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <span className="inline-flex gap-1">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400 [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-violet-400 [animation-delay:300ms]" />
            </span>
            {sending ? 'Generating response…' : 'Streaming response…'}
          </div>
        )}

        <div className="flex gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            rows={2}
            placeholder={disabled ? 'Select or create a conversation…' : 'Message Ollive…'}
            disabled={disabled || sending}
            className="min-h-[52px] flex-1 resize-none rounded-xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-500 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500 disabled:opacity-60"
          />
          <div className="flex flex-col gap-2">
            <Button type="submit" disabled={disabled || sending || !input.trim()}>
              Send
            </Button>
            {isGenerating && (
              <Button type="button" variant="danger" size="sm" onClick={onCancel}>
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
}
