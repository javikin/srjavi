import { createClient } from '@/lib/supabase/server';

type ReqType = 'bug' | 'feature' | 'improvement';
const TYPE_LABEL: Record<ReqType, string> = {
  bug: 'Bugs',
  feature: 'Features',
  improvement: 'Mejoras',
};

const TYPE_COLOR: Record<ReqType, string> = {
  bug: 'bg-coral',
  feature: 'bg-lavender',
  improvement: 'bg-sky',
};

export default async function AnalyticsPage() {
  const supabase = await createClient();

  const [
    { data: allRequests },
    { data: creditsByProject },
    { data: projects },
  ] = await Promise.all([
    supabase
      .from('requests')
      .select('type, status, created_at'),
    supabase
      .from('credit_allocations')
      .select('project_id, used, quota, period_start, projects(name)')
      .order('period_start', { ascending: false }),
    supabase
      .from('projects')
      .select('id, name, monthly_credit_quota'),
  ]);

  // ── Requests by type ───────────────────────────────────────────────────────
  const totalRequests = allRequests?.length ?? 0;
  const typeCount: Record<string, number> = {};
  allRequests?.forEach((r) => {
    typeCount[r.type] = (typeCount[r.type] ?? 0) + 1;
  });

  // ── Requests by status ─────────────────────────────────────────────────────
  const statusCount: Record<string, number> = {};
  allRequests?.forEach((r) => {
    statusCount[r.status] = (statusCount[r.status] ?? 0) + 1;
  });

  // ── Credits per project (latest allocation per project) ───────────────────
  const latestByProject: Record<string, { name: string; used: number; quota: number }> = {};
  creditsByProject?.forEach((alloc) => {
    if (!latestByProject[alloc.project_id]) {
      type ProjectRow = { name: string };
      const rawProject = alloc.projects as ProjectRow | ProjectRow[] | null;
      const proj = Array.isArray(rawProject) ? (rawProject[0] ?? null) : rawProject;
      latestByProject[alloc.project_id] = {
        name: proj?.name ?? 'Sin nombre',
        used: alloc.used,
        quota: alloc.quota,
      };
    }
  });
  const creditEntries = Object.values(latestByProject).sort((a, b) => b.used - a.used);
  const maxCredits = Math.max(...creditEntries.map((e) => e.quota), 1);

  // ── Summary stats ──────────────────────────────────────────────────────────
  const completedCount = statusCount['completed'] ?? 0;
  const pendingCount = statusCount['pending'] ?? 0;
  const totalCreditsUsed = creditEntries.reduce((s, e) => s + e.used, 0);
  const totalCreditsQuota = creditEntries.reduce((s, e) => s + e.quota, 0);

  const STATUS_DISPLAY: Record<string, { label: string; color: string }> = {
    pending: { label: 'Pendiente', color: 'bg-amber-400' },
    approved: { label: 'Aprobado', color: 'bg-sky' },
    in_progress: { label: 'En progreso', color: 'bg-lavender' },
    completed: { label: 'Completado', color: 'bg-mint' },
    rejected: { label: 'Rechazado', color: 'bg-coral' },
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Analiticas</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Resumen de solicitudes, creditos y actividad general.
        </p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="rounded-xl bg-surface border border-white/5 p-5">
          <p className="text-xs text-text-muted uppercase tracking-wider">Total solicitudes</p>
          <p className="text-3xl font-semibold text-text-primary mt-2">{totalRequests}</p>
        </div>
        <div className="rounded-xl bg-surface border border-white/5 p-5">
          <p className="text-xs text-text-muted uppercase tracking-wider">Completadas</p>
          <p className="text-3xl font-semibold text-mint mt-2">{completedCount}</p>
          <p className="text-xs text-text-muted mt-1">
            {totalRequests > 0 ? Math.round((completedCount / totalRequests) * 100) : 0}% del total
          </p>
        </div>
        <div className="rounded-xl bg-surface border border-white/5 p-5">
          <p className="text-xs text-text-muted uppercase tracking-wider">Pendientes</p>
          <p className="text-3xl font-semibold text-amber-400 mt-2">{pendingCount}</p>
        </div>
        <div className="rounded-xl bg-surface border border-white/5 p-5">
          <p className="text-xs text-text-muted uppercase tracking-wider">Creditos usados</p>
          <p className="text-3xl font-semibold text-text-primary mt-2">{totalCreditsUsed}</p>
          <p className="text-xs text-text-muted mt-1">de {totalCreditsQuota} totales</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Requests by type */}
        <div className="rounded-xl bg-surface border border-white/5 p-6">
          <h2 className="text-base font-semibold text-text-primary mb-5">
            Solicitudes por tipo
          </h2>
          {totalRequests === 0 ? (
            <p className="text-sm text-text-muted">Sin datos todavia.</p>
          ) : (
            <div className="space-y-4">
              {(['bug', 'feature', 'improvement'] as ReqType[]).map((type) => {
                const count = typeCount[type] ?? 0;
                const pct = totalRequests > 0 ? Math.round((count / totalRequests) * 100) : 0;
                return (
                  <div key={type}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm text-text-secondary">{TYPE_LABEL[type]}</span>
                      <span className="text-sm font-medium text-text-primary">
                        {count} <span className="text-text-muted font-normal">({pct}%)</span>
                      </span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${TYPE_COLOR[type]}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Requests by status */}
        <div className="rounded-xl bg-surface border border-white/5 p-6">
          <h2 className="text-base font-semibold text-text-primary mb-5">
            Solicitudes por estado
          </h2>
          {totalRequests === 0 ? (
            <p className="text-sm text-text-muted">Sin datos todavia.</p>
          ) : (
            <div className="space-y-4">
              {Object.entries(statusCount)
                .sort(([, a], [, b]) => b - a)
                .map(([status, count]) => {
                  const pct = Math.round((count / totalRequests) * 100);
                  const display = STATUS_DISPLAY[status] ?? { label: status, color: 'bg-white/20' };
                  return (
                    <div key={status}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm text-text-secondary">{display.label}</span>
                        <span className="text-sm font-medium text-text-primary">
                          {count} <span className="text-text-muted font-normal">({pct}%)</span>
                        </span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${display.color}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      </div>

      {/* Credits per project */}
      <div className="rounded-xl bg-surface border border-white/5 p-6">
        <h2 className="text-base font-semibold text-text-primary mb-5">
          Creditos usados por proyecto (periodo actual)
        </h2>
        {creditEntries.length === 0 ? (
          <p className="text-sm text-text-muted">Sin datos de creditos todavia.</p>
        ) : (
          <div className="space-y-4">
            {creditEntries.map((entry, idx) => {
              const usedPct = entry.quota > 0 ? Math.min(100, Math.round((entry.used / entry.quota) * 100)) : 0;
              const barColor =
                usedPct > 80 ? 'bg-coral' : usedPct > 50 ? 'bg-amber-400' : 'bg-mint';
              return (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-text-secondary truncate max-w-[200px]">
                      {entry.name}
                    </span>
                    <span className="text-xs text-text-muted ml-2 flex-shrink-0">
                      {entry.used} / {entry.quota} cr.
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-white/5 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${barColor}`}
                      style={{
                        width: `${entry.quota > 0 ? Math.round((entry.used / maxCredits) * 100) : 0}%`,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
