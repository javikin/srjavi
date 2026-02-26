import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import StatsCard from '@/components/dashboard/StatsCard';
import CreditBar from '@/components/dashboard/CreditBar';
import StatusBadge from '@/components/dashboard/StatusBadge';
import RequestTypeBadge from '@/components/dashboard/RequestTypeBadge';
import EmptyState from '@/components/dashboard/EmptyState';

function formatRelativeDate(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Hoy';
  if (diffDays === 1) return 'Ayer';
  if (diffDays < 7) return `Hace ${diffDays} días`;
  if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
  return date.toLocaleDateString('es-MX', { month: 'short', day: 'numeric' });
}

export default async function PortalOverviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  // Resolve project by slug
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single();

  if (projectError || !project) {
    redirect('/');
  }

  // Get current period credit allocation
  const { data: allocation } = await supabase
    .from('credit_allocations')
    .select('quota, used, period_start')
    .eq('project_id', project.id)
    .order('period_start', { ascending: false })
    .limit(1)
    .maybeSingle();

  const creditUsed = allocation?.used ?? 0;
  const creditQuota = allocation?.quota ?? project.monthly_credit_quota;
  const creditAvailable = Math.max(0, creditQuota - creditUsed);

  // Get recent requests (last 5)
  const { data: recentRequests } = await supabase
    .from('requests')
    .select('id, title, type, status, priority_preference, credit_cost, created_at')
    .eq('project_id', project.id)
    .order('created_at', { ascending: false })
    .limit(5);

  // Count open requests (pending + approved + in_progress)
  const { count: openCount } = await supabase
    .from('requests')
    .select('id', { count: 'exact', head: true })
    .eq('project_id', project.id)
    .in('status', ['pending', 'approved', 'in_progress']);

  // Last activity
  const lastRequest = recentRequests?.[0];
  const lastActivity = lastRequest
    ? formatRelativeDate(lastRequest.created_at)
    : 'Sin actividad';

  return (
    <div className="space-y-8">
      {/* Welcome banner */}
      <div className="rounded-xl bg-surface border border-white/5 p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">
            Bienvenido a{' '}
            <span className="text-primary">{project.name}</span>
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Aqui puedes revisar el estado de tus solicitudes y uso de creditos.
          </p>
        </div>
        <Link
          href={`/portal/${slug}/requests/new`}
          className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-background text-sm font-semibold hover:bg-primary/90 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Nueva Solicitud
        </Link>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          label="Solicitudes Abiertas"
          value={openCount ?? 0}
          subtitle="pendientes, aprobadas o en progreso"
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
        <StatsCard
          label="Creditos Disponibles"
          value={creditAvailable}
          subtitle={`de ${creditQuota} este mes`}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
        <StatsCard
          label="Ultima Actividad"
          value={lastActivity}
          subtitle={lastRequest?.title ?? 'Ninguna solicitud aun'}
          icon={
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Credit usage */}
      <div className="rounded-xl bg-surface border border-white/5 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-text-primary">Uso de Creditos — Periodo Actual</h2>
          <Link
            href={`/portal/${slug}/credits`}
            className="text-xs text-primary hover:underline"
          >
            Ver detalle
          </Link>
        </div>
        <CreditBar used={creditUsed} quota={creditQuota} showLabel size="lg" />
        <div className="mt-3 flex items-center gap-6 text-sm">
          <span className="text-text-muted">
            <span className="font-semibold text-text-primary">{creditUsed}</span> usados
          </span>
          <span className="text-text-muted">
            <span className="font-semibold text-text-primary">{creditAvailable}</span> disponibles
          </span>
          <span className="text-text-muted">
            <span className="font-semibold text-text-primary">{creditQuota}</span> cuota mensual
          </span>
        </div>
      </div>

      {/* Recent requests */}
      <div className="rounded-xl bg-surface border border-white/5 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-text-primary">Solicitudes Recientes</h2>
          <Link
            href={`/portal/${slug}/requests`}
            className="text-xs text-primary hover:underline"
          >
            Ver todas
          </Link>
        </div>

        {!recentRequests || recentRequests.length === 0 ? (
          <EmptyState
            title="Sin solicitudes"
            description="Todavia no has creado ninguna solicitud para este proyecto."
            action={{ label: 'Crear primera solicitud', href: `/portal/${slug}/requests/new` }}
          />
        ) : (
          <div className="space-y-3">
            {recentRequests.map((req) => (
              <Link
                key={req.id}
                href={`/portal/${slug}/requests/${req.id}`}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.03] transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate group-hover:text-primary transition-colors">
                    {req.title}
                  </p>
                  <p className="text-xs text-text-muted mt-0.5">
                    {formatRelativeDate(req.created_at)}
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <RequestTypeBadge type={req.type as 'bug' | 'feature' | 'improvement'} />
                  <StatusBadge status={req.status as 'pending' | 'approved' | 'in_progress' | 'completed' | 'rejected'} />
                  {req.credit_cost > 0 && (
                    <span className="text-xs text-text-muted tabular-nums">
                      {req.credit_cost} cr
                    </span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
