import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import StatusBadge from '@/components/dashboard/StatusBadge';
import BillingTypeBadge from '@/components/dashboard/BillingTypeBadge';
import CreditBar from '@/components/dashboard/CreditBar';
import RequestTypeBadge from '@/components/dashboard/RequestTypeBadge';
import PriorityBadge from '@/components/dashboard/PriorityBadge';

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: project } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .single();

  if (!project) notFound();

  const [{ data: members }, { data: requests }, { data: allocations }] = await Promise.all([
    supabase
      .from('project_members')
      .select('id, role, created_at, profiles(id, full_name, email, avatar_url)')
      .eq('project_id', id)
      .order('created_at', { ascending: true }),
    supabase
      .from('requests')
      .select('id, title, type, status, priority_preference, credit_cost, created_at')
      .eq('project_id', id)
      .order('created_at', { ascending: false })
      .limit(10),
    supabase
      .from('credit_allocations')
      .select('used, quota, period_start')
      .eq('project_id', id)
      .order('period_start', { ascending: false })
      .limit(1),
  ]);

  const currentAlloc = allocations?.[0] ?? { used: 0, quota: project.monthly_credit_quota };

  const statusLabels: Record<string, string> = {
    active: 'Activo',
    paused: 'Pausado',
    completed: 'Completado',
    archived: 'Archivado',
  };

  return (
    <div className="space-y-8">
      {/* Breadcrumb + actions */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-text-muted">
          <Link href="/admin/projects" className="hover:text-text-secondary transition-colors">
            Proyectos
          </Link>
          <span>/</span>
          <span className="text-text-primary font-medium">{project.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href={`/admin/projects/${id}/requests`}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-white/10 text-text-secondary text-sm hover:bg-white/5 transition-colors"
          >
            Ver solicitudes
          </Link>
          <Link
            href={`/admin/projects/${id}/settings`}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary border border-primary/20 text-sm hover:bg-primary/20 transition-colors"
          >
            Editar
          </Link>
        </div>
      </div>

      {/* Project info card */}
      <div className="rounded-xl bg-surface border border-white/5 p-6">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <h1 className="text-2xl font-semibold text-text-primary">{project.name}</h1>
            <p className="text-sm text-text-muted font-mono mt-0.5">{project.slug}</p>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <BillingTypeBadge type={project.billing_type as 'paid' | 'pro_bono'} />
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              project.status === 'active'
                ? 'bg-mint/10 text-mint border border-mint/20'
                : project.status === 'paused'
                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                : 'bg-white/5 text-text-secondary border border-white/10'
            }`}>
              {statusLabels[project.status] ?? project.status}
            </span>
          </div>
        </div>

        {project.description && (
          <p className="text-sm text-text-secondary mb-4">{project.description}</p>
        )}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-white/5">
          {/* Tech stack */}
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wider mb-1.5">Stack</p>
            {project.tech_stack && project.tech_stack.length > 0 ? (
              <div className="flex flex-wrap gap-1">
                {(project.tech_stack as string[]).map((t: string) => (
                  <span
                    key={t}
                    className="inline-block px-2 py-0.5 rounded bg-white/5 text-text-secondary text-xs"
                  >
                    {t}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-sm text-text-muted">—</span>
            )}
          </div>

          {/* GitHub */}
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wider mb-1.5">GitHub</p>
            {project.github_repo_owner && project.github_repo_name ? (
              <a
                href={`https://github.com/${project.github_repo_owner}/${project.github_repo_name}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline truncate block"
              >
                {project.github_repo_owner}/{project.github_repo_name}
              </a>
            ) : (
              <span className="text-sm text-text-muted">—</span>
            )}
          </div>

          {/* Website */}
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wider mb-1.5">Sitio web</p>
            {project.website_url ? (
              <a
                href={project.website_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-primary hover:underline truncate block"
              >
                {project.website_url.replace(/^https?:\/\//, '')}
              </a>
            ) : (
              <span className="text-sm text-text-muted">—</span>
            )}
          </div>

          {/* Period start */}
          <div>
            <p className="text-xs text-text-muted uppercase tracking-wider mb-1.5">Creacion</p>
            <p className="text-sm text-text-secondary">
              {new Date(project.created_at).toLocaleDateString('es-MX', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </div>

      {/* Credits section */}
      <div className="rounded-xl bg-surface border border-white/5 p-6">
        <h2 className="text-base font-semibold text-text-primary mb-4">
          Creditos del periodo actual
        </h2>
        <CreditBar used={currentAlloc.used} quota={currentAlloc.quota} size="lg" />
        <div className="mt-3 grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
          <div>
            <p className="text-xs text-text-muted">Cuota mensual</p>
            <p className="text-lg font-semibold text-text-primary mt-0.5">
              {project.monthly_credit_quota}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-muted">Usados</p>
            <p className="text-lg font-semibold text-coral mt-0.5">{currentAlloc.used}</p>
          </div>
          <div>
            <p className="text-xs text-text-muted">Disponibles</p>
            <p className="text-lg font-semibold text-mint mt-0.5">
              {Math.max(0, currentAlloc.quota - currentAlloc.used)}
            </p>
          </div>
        </div>
      </div>

      {/* Members */}
      <div className="rounded-xl bg-surface border border-white/5 p-6">
        <h2 className="text-base font-semibold text-text-primary mb-4">
          Miembros ({members?.length ?? 0})
        </h2>
        {!members || members.length === 0 ? (
          <p className="text-sm text-text-muted">Sin miembros asignados.</p>
        ) : (
          <ul className="space-y-3">
            {members.map((member) => {
              type ProfileRow = { full_name: string; email: string };
              const rawProfile = member.profiles as ProfileRow | ProfileRow[] | null;
              const profile = Array.isArray(rawProfile) ? rawProfile[0] ?? null : rawProfile;
              return (
                <li key={member.id} className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-medium">
                      {profile?.full_name?.[0]?.toUpperCase() ?? '?'}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-text-primary">
                        {profile?.full_name ?? 'Sin nombre'}
                      </p>
                      <p className="text-xs text-text-muted">{profile?.email ?? '—'}</p>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    member.role === 'owner'
                      ? 'bg-primary/10 text-primary border border-primary/20'
                      : 'bg-white/5 text-text-secondary border border-white/10'
                  }`}>
                    {member.role === 'owner' ? 'Propietario' : 'Lector'}
                  </span>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Recent requests */}
      <div className="rounded-xl bg-surface border border-white/5 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-semibold text-text-primary">
            Solicitudes recientes
          </h2>
          <Link
            href={`/admin/projects/${id}/requests`}
            className="text-xs text-primary hover:underline"
          >
            Ver todas
          </Link>
        </div>

        {!requests || requests.length === 0 ? (
          <p className="text-sm text-text-muted">Sin solicitudes registradas.</p>
        ) : (
          <ul className="divide-y divide-white/5">
            {requests.map((req) => (
              <li key={req.id}>
                <Link
                  href={`/admin/requests/${req.id}`}
                  className="flex items-center gap-3 py-3 hover:bg-white/[0.03] -mx-2 px-2 rounded-lg transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text-primary truncate">{req.title}</p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {new Date(req.created_at).toLocaleDateString('es-MX')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <RequestTypeBadge type={req.type as 'bug' | 'feature' | 'improvement'} />
                    <StatusBadge status={req.status as 'pending' | 'approved' | 'in_progress' | 'completed' | 'rejected'} />
                    <PriorityBadge priority={req.priority_preference as 'low' | 'medium' | 'high' | 'critical'} />
                    {req.credit_cost > 0 && (
                      <span className="text-xs text-text-muted">
                        {req.credit_cost} cr.
                      </span>
                    )}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
