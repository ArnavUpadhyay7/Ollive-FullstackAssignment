import { Button } from '../../../components/ui/Button';
import { Spinner } from '../../../components/ui/Spinner';

function formatDate(dateString) {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
  });
}

export function ConversationSidebar({
  conversations,
  activeId,
  listLoading,
  onSelect,
  onCreate,
  onDelete,
}) {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col bg-zinc-950 border-r border-zinc-800/60">
      {/* Header */}
      <div className="flex h-14 items-center justify-between px-4 border-b border-zinc-800/60">
        <span className="text-sm font-semibold tracking-wide text-zinc-100">Ollive</span>
        <button
          type="button"
          onClick={onCreate}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-zinc-800 hover:text-zinc-100"
          aria-label="New conversation"
          title="New conversation"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
      </div>

      {/* List */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {listLoading && (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        )}

        {!listLoading && conversations.length === 0 && (
          <p className="px-3 py-8 text-center text-xs text-zinc-600">
            No conversations yet.
          </p>
        )}

        <ul className="space-y-0.5">
          {conversations.map((conversation) => {
            const isActive = conversation._id === activeId;
            return (
              <li key={conversation._id}>
                <div
                  className={`group relative flex items-center rounded-lg transition-colors ${
                    isActive ? 'bg-zinc-800' : 'hover:bg-zinc-800/60'
                  }`}
                >
                  <button
                    type="button"
                    className="min-w-0 flex-1 px-3 py-2.5 text-left"
                    onClick={() => onSelect(conversation._id)}
                  >
                    <p className={`truncate text-sm ${isActive ? 'text-zinc-100' : 'text-zinc-400'}`}>
                      {conversation.title || 'New conversation'}
                    </p>
                    <p className="mt-0.5 text-[11px] text-zinc-600">{formatDate(conversation.updatedAt)}</p>
                  </button>
                  <button
                    type="button"
                    aria-label="Delete conversation"
                    onClick={() => onDelete(conversation._id)}
                    className="mr-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-zinc-600 opacity-0 transition hover:bg-zinc-700 hover:text-red-400 group-hover:opacity-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 6L6 18M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}