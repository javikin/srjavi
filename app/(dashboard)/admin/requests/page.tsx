import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import PageHeader from '@/components/dashboard/PageHeader';
import StatusBadge from '@/components/dashboard/StatusBadge';
import RequestTypeBadge from '@/components/dashboard/RequestTypeBadge';
import PriorityBadge from '@/components/dashboard/PriorityBadge';
import EmptyState from '@/components/dashboard/EmptyState';

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

export default async function AllRequestsPage({
  searchParams,
}: {
  searchParams?: Promise<{ status?: string; type?: string }>;
}) {
  const sp = await searchParams;
  const supabase = await createClient();

  let query = supabase
    .from('requests')
    .select('id, title, type, status, priority_preference, credit_cost, created_at, projects(id, name), profiles!requests_submitted_by_fkey(full_name)')
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
    return `/admin/requests${qs ? `?${qs}` : ''}`;
  }

  return (
    <div>
      <PageHeader
        title="Todas las solicitudes"
        description="Vista global de solicitudes de todos los proyectos."
      />

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-muted">Estado:</span>
          <div className="flex gap-1 flex-wrap">
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

        {(sp?.status || sp?.type) && (
          <Link
            href="/admin/requests"
            className="text-xs text-text-muted hover:text-text-secondary underline transition-colors"
          >
            Limpiar filtros
          </Link>
        )}
      </div>

      {!requests || requests.length === 0 ? (
        <EmptyState
          title="Sin solicitudes"
          description="No hay solicitudes que coincidan con los filtros seleccionados."
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          }
        />
      ) : (
        <div className="rounded-xl border border-white/5 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-surface">
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Titulo</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Proyecto</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Tipo</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Estado</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Prioridad</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Creditos</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {requests.map((req) => {
                type ProjectRow = { id: string; name: string };
                const rawProject = req.projects as ProjectRow | ProjectRow[] | null;
                const project = Array.isArray(rawProject) ? rawProject[0] ?? null : rawProject;
                return (
                  <tr
                    key={req.id}
                    className="bg-background hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="px-4 py-3 max-w-[260px]">
                      <Link
                        href={`/admin/requests/${req.id}`}
                        className="font-medium text-text-primary hover:text-primary transition-colors truncate block"
                      >
                        {req.title}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      {project ? (
                        <Link
                          href={`/admin/projects/${project.id}`}
                          className="text-text-secondary hover:text-primary transition-colors text-xs"
                        >
                          {project.name}
                        </Link>
                      ) : (
                        <span className="text-text-muted">—</span>
                      )}
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
