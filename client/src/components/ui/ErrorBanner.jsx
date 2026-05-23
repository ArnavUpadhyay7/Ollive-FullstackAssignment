export function ErrorBanner({ message, onDismiss, onRetry }) {
  return (
    <div className="flex w-80 max-w-[calc(100vw-2rem)] items-start gap-3 rounded-xl border border-red-500/20 bg-zinc-900 p-4 shadow-2xl shadow-black/40 ring-1 ring-red-500/10">
      {/* Icon */}
      <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-red-500/15">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 text-red-400" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
        </svg>
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium text-red-400">Something went wrong</p>
        <p className="mt-0.5 truncate text-xs text-zinc-500">{message}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 text-xs font-medium text-violet-400 transition hover:text-violet-300"
          >
            Try again →
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={onDismiss}
        className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-zinc-600 transition hover:bg-zinc-800 hover:text-zinc-400"
        aria-label="Dismiss error"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}