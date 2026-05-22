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
    <aside className="flex w-full flex-col border-r border-zinc-800 bg-zinc-900/50 md:w-72 lg:w-80">
      <div className="border-b border-zinc-800 p-4">
        <Button className="w-full" onClick={onCreate}>
          + New conversation
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {listLoading && (
          <div className="flex justify-center py-8">
            <Spinner />
          </div>
        )}

        {!listLoading && conversations.length === 0 && (
          <p className="px-3 py-6 text-center text-sm text-zinc-500">
            No conversations yet. Create one to start chatting.
          </p>
        )}

        <ul className="space-y-1">
          {conversations.map((conversation) => {
            const isActive = conversation._id === activeId;
            return (
              <li key={conversation._id}>
                <div
                  className={`group flex items-center gap-2 rounded-lg px-3 py-2 transition ${
                    isActive
                      ? 'bg-violet-600/20 text-violet-100'
                      : 'text-zinc-300 hover:bg-zinc-800'
                  }`}
                >
                  <button
                    type="button"
                    className="min-w-0 flex-1 text-left"
                    onClick={() => onSelect(conversation._id)}
                  >
                    <p className="truncate text-sm font-medium">
                      {conversation.title || 'New conversation'}
                    </p>
                    <p className="text-xs text-zinc-500">{formatDate(conversation.updatedAt)}</p>
                  </button>
                  <button
                    type="button"
                    aria-label="Delete conversation"
                    onClick={() => onDelete(conversation._id)}
                    className="rounded px-1.5 py-0.5 text-xs text-zinc-500 opacity-0 transition hover:bg-zinc-700 hover:text-red-300 group-hover:opacity-100"
                  >
                    ×
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </aside>
  );
}
