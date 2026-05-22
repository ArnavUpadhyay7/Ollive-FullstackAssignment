import { useEffect } from 'react';
import { useDashboardStore } from '../store/dashboardStore';
import { MetricCard } from '../features/dashboard/components/MetricCard';
import { RequestsChart } from '../features/dashboard/components/RequestsChart';
import { TokenUsageTable } from '../features/dashboard/components/TokenUsageTable';
import { Spinner } from '../components/ui/Spinner';
import { ErrorBanner } from '../components/ui/ErrorBanner';
import { Button } from '../components/ui/Button';

const RANGE_OPTIONS = [
  { value: '24h', label: '24 hours' },
  { value: '7d', label: '7 days' },
];

export function DashboardPage() {
  const { metrics, loading, error, range, fetchMetrics, clearError } = useDashboardStore();

  useEffect(() => {
    fetchMetrics(range);
  }, [fetchMetrics, range]);

  return (
    <div className="h-full overflow-y-auto p-4 md:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-white">Inference Dashboard</h1>
            <p className="text-sm text-zinc-500">Metrics from backend inference logs</p>
          </div>
          <div className="flex items-center gap-2">
            {RANGE_OPTIONS.map((option) => (
              <Button
                key={option.value}
                variant={range === option.value ? 'primary' : 'secondary'}
                size="sm"
                onClick={() => fetchMetrics(option.value)}
              >
                {option.label}
              </Button>
            ))}
            <Button variant="ghost" size="sm" onClick={() => fetchMetrics(range)}>
              Refresh
            </Button>
          </div>
        </div>

        {error && (
          <ErrorBanner
            message={error}
            onDismiss={clearError}
            onRetry={() => fetchMetrics(range)}
          />
        )}

        {loading && (
          <div className="flex justify-center py-20">
            <Spinner className="h-8 w-8" />
          </div>
        )}

        {!loading && metrics && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                label="Avg latency"
                value={`${metrics.avgLatencyMs} ms`}
                subtext="Mean inference latency"
              />
              <MetricCard
                label="Throughput"
                value={`${metrics.throughputPerMinute}/min`}
                subtext={`Over ${metrics.range}`}
                accent="emerald"
              />
              <MetricCard
                label="Total requests"
                value={metrics.totalRequests.toLocaleString()}
                accent="amber"
              />
              <MetricCard
                label="Error rate"
                value={`${metrics.errorRatePercent}%`}
                subtext="Errors + cancelled"
                accent="rose"
              />
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5 lg:col-span-2">
                <h2 className="mb-4 text-sm font-medium text-zinc-300">Requests over time</h2>
                <RequestsChart data={metrics.requestsOverTime} />
              </div>

              <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-5">
                <h2 className="mb-2 text-sm font-medium text-zinc-300">Token usage</h2>
                <p className="mb-4 text-2xl font-semibold text-violet-300">
                  {metrics.tokenUsage?.total?.toLocaleString() ?? 0}
                </p>
                <p className="mb-4 text-xs text-zinc-500">Total tokens (all providers)</p>
                <TokenUsageTable byProvider={metrics.tokenUsage?.byProvider} />
              </div>
            </div>
          </>
        )}

        {!loading && !metrics && !error && (
          <p className="py-12 text-center text-sm text-zinc-500">
            No metrics available. Send chat messages to generate inference logs.
          </p>
        )}
      </div>
    </div>
  );
}
