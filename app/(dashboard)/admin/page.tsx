import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import StatsCard from '@/components/dashboard/StatsCard';
import StatusBadge from '@/components/dashboard/StatusBadge';
import RequestTypeBadge from '@/components/dashboard/RequestTypeBadge';
import ActivityItem from '@/components/dashboard/ActivityItem';

export default async function AdminDashboardPage() {
  const supabase = await createClient();

  // Fetch aggregate stats in parallel
  const [
    { count: totalProjects },
    { count: pendingRequests },
    { data: creditData },
    { count: activeClients },
    { data: recentRequests },
    { data: recentActivity },
  ] = await Promise.all([
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase
      .from('requests')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'pending'),
    supabase
      .from('credit_allocations')
      .select('used, quota'),
    supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('role', 'client'),
    supabase
      .from('requests')
      .select('id, title, type, status, priority_preference, created_at, projects(name), profiles!requests_submitted_by_fkey(full_name)')
      .eq('status', 'pending')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase
      .from('activity_log')
      .select('id, action, entity_type, created_at, profiles!activity_log_actor_id_fkey(full_name), projects(name)')
      .order('created_at', { ascending: false })
      .limit(10),
  ]);

  const totalCreditsUsed = creditData?.reduce((sum, row) => sum + (row.used ?? 0), 0) ?? 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Panel de control</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Vista general de proyectos, solicitudes y uso de creditos.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatsCard
          label="Total proyectos"
          value={totalProjects ?? 0}
          subtitle="Todos los estados"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          }
        />
        <StatsCard
          label="Solicitudes pendientes"
          value={pendingRequests ?? 0}
          subtitle="Requieren atencion"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          }
        />
        <StatsCard
          label="Creditos usados"
          value={totalCreditsUsed.toLocaleString('es')}
          subtitle="Suma todos los periodos"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          }
        />
        <StatsCard
          label="Clientes activos"
          value={activeClients ?? 0}
          subtitle="Con acceso al portal"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
      </div>

      {/* Two-column layout: recent requests + activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent pending requests */}
        <div className="rounded-xl bg-surface border border-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-text-primary">Solicitudes pendientes</h2>
            <Link
              href="/admin/requests"
              className="text-xs text-primary hover:underline"
            >
              Ver todas
            </Link>
          </div>

          {!recentRequests || recentRequests.length === 0 ? (
            <p className="text-sm text-text-muted py-8 text-center">
              No hay solicitudes pendientes
            </p>
          ) : (
            <ul className="divide-y divide-white/5">
              {recentRequests.map((req) => {
                const rawProject = req.projects as { name: string } | { name: string }[] | null;
                const project = Array.isArray(rawProject) ? rawProject[0] ?? null : rawProject;
                const rawSubmitter = req.profiles as { full_name: string } | { full_name: string }[] | null;
                const submitter = Array.isArray(rawSubmitter) ? rawSubmitter[0] ?? null : rawSubmitter;
                return (
                  <li key={req.id}>
                    <Link
                      href={`/admin/requests/${req.id}`}
                      className="flex items-start gap-3 py-3 hover:bg-white/[0.03] -mx-2 px-2 rounded-lg transition-colors"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {req.title}
                        </p>
                        <p className="text-xs text-text-muted mt-0.5">
                          {submitter?.full_name ?? '—'} &middot; {project?.name ?? '—'}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <RequestTypeBadge type={req.type as 'bug' | 'feature' | 'improvement'} />
                        <StatusBadge status={req.status as 'pending'} />
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Recent activity */}
        <div className="rounded-xl bg-surface border border-white/5 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-text-primary">Actividad reciente</h2>
          </div>

          {!recentActivity || recentActivity.length === 0 ? (
            <p className="text-sm text-text-muted py-8 text-center">
              Sin actividad reciente
            </p>
          ) : (
            <ul className="divide-y divide-white/5">
              {recentActivity.map((item) => {
                const rawActor = item.profiles as { full_name: string } | { full_name: string }[] | null;
                const actor = Array.isArray(rawActor) ? rawActor[0] ?? null : rawActor;
                const rawProject = item.projects as { name: string } | { name: string }[] | null;
                const project = Array.isArray(rawProject) ? rawProject[0] ?? null : rawProject;
                return (
                  <li key={item.id}>
                    <ActivityItem
                      action={item.action}
                      entityType={item.entity_type}
                      actorName={actor?.full_name ?? 'Sistema'}
                      projectName={project?.name ?? undefined}
                      createdAt={item.created_at}
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
