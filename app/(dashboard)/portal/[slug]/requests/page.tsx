import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import PageHeader from '@/components/dashboard/PageHeader';
import StatusBadge from '@/components/dashboard/StatusBadge';
import RequestTypeBadge from '@/components/dashboard/RequestTypeBadge';
import PriorityBadge from '@/components/dashboard/PriorityBadge';
import EmptyState from '@/components/dashboard/EmptyState';
import RequestsTable from './RequestsTable';

export default async function PortalRequestsPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ status?: string }>;
}) {
  const { slug } = await params;
  const { status: statusFilter } = await searchParams;
  const supabase = await createClient();

  // Resolve project
  const { data: project, error } = await supabase
    .from('projects')
    .select('id, name')
    .eq('slug', slug)
    .single();

  if (error || !project) {
    redirect('/');
  }

  // Fetch requests with optional status filter
  let query = supabase
    .from('requests')
    .select('id, title, type, status, priority_preference, admin_priority, credit_cost, created_at, updated_at')
    .eq('project_id', project.id)
    .order('created_at', { ascending: false });

  if (statusFilter && statusFilter !== 'all') {
    query = query.eq('status', statusFilter);
  }

  const { data: requests } = await query;

  const statuses = [
    { value: 'all', label: 'Todas' },
    { value: 'pending', label: 'Pendiente' },
    { value: 'approved', label: 'Aprobado' },
    { value: 'in_progress', label: 'En progreso' },
    { value: 'completed', label: 'Completado' },
    { value: 'rejected', label: 'Rechazado' },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Mis Solicitudes"
        description="Gestiona y revisa el estado de todas tus solicitudes."
        action={
          <Link
            href={`/portal/${slug}/requests/new`}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-background text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Nueva Solicitud
          </Link>
        }
      />

      {/* Status filter tabs */}
      <div className="flex flex-wrap gap-2">
        {statuses.map((s) => {
          const isActive = (statusFilter ?? 'all') === s.value;
          return (
            <Link
              key={s.value}
              href={s.value === 'all' ? `/portal/${slug}/requests` : `/portal/${slug}/requests?status=${s.value}`}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary/10 text-primary border border-primary/20'
                  : 'text-text-muted hover:text-text-secondary hover:bg-white/5 border border-transparent'
              }`}
            >
              {s.label}
            </Link>
          );
        })}
      </div>

      {/* Table */}
      {!requests || requests.length === 0 ? (
        <EmptyState
          title="Sin solicitudes"
          description={
            statusFilter && statusFilter !== 'all'
              ? 'No hay solicitudes con este estado.'
              : 'Todavia no has creado ninguna solicitud.'
          }
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          }
          action={{ label: 'Nueva Solicitud', href: `/portal/${slug}/requests/new` }}
        />
      ) : (
        <RequestsTable requests={requests} slug={slug} />
      )}
    </div>
  );
}
