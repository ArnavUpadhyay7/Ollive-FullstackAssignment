function formatHour(hour) {
  if (!hour) return '';
  const date = new Date(hour);
  return date.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' });
}

export function RequestsChart({ data = [] }) {
  if (!data.length) {
    return (
      <div className="flex h-48 items-center justify-center text-sm text-zinc-500">
        No request data for this period.
      </div>
    );
  }

  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="space-y-3">
      <div className="flex h-48 items-end gap-2 border-b border-zinc-800 pb-2">
        {data.map((bucket) => {
          const height = `${(bucket.count / maxCount) * 100}%`;
          return (
            <div
              key={bucket.hour}
              className="group flex min-w-0 flex-1 flex-col items-center justify-end gap-1"
              title={`${bucket.count} requests, ${bucket.errors} errors`}
            >
              <div
                className="w-full rounded-t bg-violet-600/80 transition group-hover:bg-violet-500"
                style={{ height: height === '0%' ? '4px' : height, minHeight: '4px' }}
              />
            </div>
          );
        })}
      </div>
      <div className="flex justify-between gap-2 overflow-x-auto text-[10px] text-zinc-500">
        {data.map((bucket) => (
          <span key={bucket.hour} className="shrink-0">
            {formatHour(bucket.hour)}
          </span>
        ))}
      </div>
    </div>
  );
}
