export function TokenUsageTable({ byProvider = [] }) {
  if (!byProvider.length) {
    return <p className="text-sm text-zinc-500">No token usage recorded.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-zinc-800 text-xs text-zinc-500">
            <th className="py-2 pr-4 font-medium">Provider</th>
            <th className="py-2 pr-4 font-medium">Prompt</th>
            <th className="py-2 pr-4 font-medium">Completion</th>
            <th className="py-2 font-medium">Total</th>
          </tr>
        </thead>
        <tbody>
          {byProvider.map((row) => (
            <tr key={row._id} className="border-b border-zinc-800/50 text-zinc-300">
              <td className="py-2 pr-4 capitalize">{row._id}</td>
              <td className="py-2 pr-4">{row.promptTokens?.toLocaleString()}</td>
              <td className="py-2 pr-4">{row.completionTokens?.toLocaleString()}</td>
              <td className="py-2">{row.totalTokens?.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
