export function EmptyState({ title, description, action }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
      <h3 className="text-lg font-medium text-zinc-200">{title}</h3>
      {description && <p className="max-w-md text-sm text-zinc-500">{description}</p>}
      {action}
    </div>
  );
}
