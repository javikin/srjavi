import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import PageHeader from '@/components/dashboard/PageHeader';
import ProjectStatusBadge from '@/components/dashboard/ProjectStatusBadge';
import BillingTypeBadge from '@/components/dashboard/BillingTypeBadge';
import CreditBar from '@/components/dashboard/CreditBar';
import EmptyState from '@/components/dashboard/EmptyState';

export default async function ProjectsPage() {
  const supabase = await createClient();

  const { data: projects } = await supabase
    .from('projects')
    .select(`
      id,
      name,
      slug,
      status,
      billing_type,
      monthly_credit_quota,
      project_members(count),
      credit_allocations(used, quota, period_start)
    `)
    .order('created_at', { ascending: false });

  function getCurrentAllocation(
    allocations: Array<{ used: number; quota: number; period_start: string }> | null
  ) {
    if (!allocations || allocations.length === 0) return { used: 0, quota: 0 };
    const sorted = [...allocations].sort(
      (a, b) => new Date(b.period_start).getTime() - new Date(a.period_start).getTime()
    );
    return sorted[0];
  }

  return (
    <div>
      <PageHeader
        title="Proyectos"
        description="Lista de todos los proyectos activos y archivados."
        action={
          <Link
            href="/admin/projects/new"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-background text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nuevo proyecto
          </Link>
        }
      />

      {!projects || projects.length === 0 ? (
        <EmptyState
          title="Sin proyectos"
          description="Crea tu primer proyecto para empezar a gestionar solicitudes."
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
          }
          action={{ label: 'Nuevo proyecto', href: '/admin/projects/new' }}
        />
      ) : (
        <div className="rounded-xl border border-white/5 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 bg-surface">
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Nombre
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Tipo
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Clientes
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider min-w-[160px]">
                  Creditos (periodo actual)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {projects.map((project) => {
                const alloc = getCurrentAllocation(
                  project.credit_allocations as Array<{ used: number; quota: number; period_start: string }> | null
                );
                const memberCount =
                  Array.isArray(project.project_members) && project.project_members.length > 0
                    ? (project.project_members[0] as { count: number }).count
                    : 0;

                return (
                  <tr
                    key={project.id}
                    className="bg-background hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="font-medium text-text-primary hover:text-primary transition-colors"
                      >
                        {project.name}
                      </Link>
                      <p className="text-xs text-text-muted mt-0.5">{project.slug}</p>
                    </td>
                    <td className="px-4 py-3">
                      <ProjectStatusBadge
                        status={project.status as 'active' | 'paused' | 'completed' | 'archived'}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <BillingTypeBadge type={project.billing_type as 'paid' | 'pro_bono'} />
                    </td>
                    <td className="px-4 py-3 text-text-secondary">
                      {memberCount}
                    </td>
                    <td className="px-4 py-3 w-48">
                      {alloc.quota > 0 ? (
                        <CreditBar
                          used={alloc.used}
                          quota={alloc.quota}
                          showLabel={false}
                          size="sm"
                        />
                      ) : (
                        <span className="text-xs text-text-muted">Sin periodo activo</span>
                      )}
                      {alloc.quota > 0 && (
                        <p className="text-xs text-text-muted mt-1">
                          {alloc.used} / {alloc.quota} creditos
                        </p>
                      )}
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
