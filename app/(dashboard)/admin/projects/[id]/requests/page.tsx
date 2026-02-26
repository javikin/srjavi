import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import StatusBadge from '@/components/dashboard/StatusBadge';
import RequestTypeBadge from '@/components/dashboard/RequestTypeBadge';
import PriorityBadge from '@/components/dashboard/PriorityBadge';
import EmptyState from '@/components/dashboard/EmptyState';
import PageHeader from '@/components/dashboard/PageHeader';

type Status = 'pending' | 'approved' | 'in_progress' | 'completed' | 'rejected';
type ReqType = 'bug' | 'feature' | 'improvement';

const STATUS_LABELS: Record<Status, string> = {
  pending: 'Pendiente',
  approved: 'Aprobado',
  in_progress: 'En progreso',
  completed: 'Completado',
  rejected: 'Rechazado',
};

const TYPE_LABELS: Record<ReqType, string> = {
  bug: 'Bug',
  feature: 'Feature',
  improvement: 'Mejora',
};

export default async function ProjectRequestsPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ status?: string; type?: string }>;
}) {
  const { id } = await params;
  const sp = await searchParams;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from('projects')
    .select('id, name')
    .eq('id', id)
    .single();

  if (!project) notFound();

  let query = supabase
    .from('requests')
    .select('id, title, type, status, priority_preference, credit_cost, created_at, profiles!requests_submitted_by_fkey(full_name)')
    .eq('project_id', id)
    .order('created_at', { ascending: false });

  if (sp?.status) query = query.eq('status', sp.status);
  if (sp?.type) query = query.eq('type', sp.type);

  const { data: requests } = await query;

  const ALL_STATUSES: Status[] = ['pending', 'approved', 'in_progress', 'completed', 'rejected'];
  const ALL_TYPES: ReqType[] = ['bug', 'feature', 'improvement'];

  function filterHref(key: 'status' | 'type', value: string) {
    const current = key === 'status' ? sp?.status : sp?.type;
    const other = key === 'status' ? sp?.type : sp?.status;
    const newVal = current === value ? undefined : value;
    const params = new URLSearchParams();
    if (key === 'status' && newVal) params.set('status', newVal);
    if (key === 'type' && newVal) params.set('type', newVal);
    if (key !== 'status' && other) params.set('status', other);
    if (key !== 'type' && other) params.set('type', other);
    const qs = params.toString();
    return `/admin/projects/${id}/requests${qs ? `?${qs}` : ''}`;
  }

  return (
    <div>
      <div className="flex items-center gap-2 text-sm text-text-muted mb-2">
        <Link href="/admin/projects" className="hover:text-text-secondary transition-colors">
          Proyectos
        </Link>
        <span>/</span>
        <Link href={`/admin/projects/${id}`} className="hover:text-text-secondary transition-colors">
          {project.name}
        </Link>
        <span>/</span>
        <span className="text-text-primary">Solicitudes</span>
      </div>

      <PageHeader
        title={`Solicitudes — ${project.name}`}
        description="Todas las solicitudes asociadas a este proyecto."
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted">Estado:</span>
          <div className="flex gap-1">
            {ALL_STATUSES.map((s) => (
              <Link
                key={s}
                href={filterHref('status', s)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  sp?.status === s
                    ? 'bg-primary/20 text-primary border-primary/30'
                    : 'border-white/10 text-text-muted hover:text-text-secondary hover:border-white/20'
                }`}
              >
                {STATUS_LABELS[s]}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted">Tipo:</span>
          <div className="flex gap-1">
            {ALL_TYPES.map((t) => (
              <Link
                key={t}
                href={filterHref('type', t)}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  sp?.type === t
                    ? 'bg-primary/20 text-primary border-primary/30'
                    : 'border-white/10 text-text-muted hover:text-text-secondary hover:border-white/20'
                }`}
              >
                {TYPE_LABELS[t]}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      {!requests || requests.length === 0 ? (
        <EmptyState
          title="Sin solicitudes"
          description="No hay solicitudes que coincidan con los filtros aplicados."
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
        />
      ) : (
        <div className="rounded-xl border border-white/5 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-surface">
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Titulo</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Tipo</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Estado</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Prioridad</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Creditos</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Enviado por</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {requests.map((req) => {
                type ProfileRow = { full_name: string };
                const rawSubmitter = req.profiles as ProfileRow | ProfileRow[] | null;
                const submitter = Array.isArray(rawSubmitter) ? rawSubmitter[0] ?? null : rawSubmitter;
                return (
                  <tr
                    key={req.id}
                    className="bg-background hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/requests/${req.id}`}
                        className="font-medium text-text-primary hover:text-primary transition-colors"
                      >
                        {req.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <RequestTypeBadge type={req.type as ReqType} />
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={req.status as Status} />
                    </td>
                    <td className="px-4 py-3">
                      <PriorityBadge priority={req.priority_preference as 'low' | 'medium' | 'high' | 'critical'} />
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{req.credit_cost}</td>
                    <td className="px-4 py-3 text-text-secondary">
                      {submitter?.full_name ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-text-muted">
                      {new Date(req.created_at).toLocaleDateString('es-MX')}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
