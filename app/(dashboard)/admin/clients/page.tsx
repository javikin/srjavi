import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/server';
import PageHeader from '@/components/dashboard/PageHeader';
import EmptyState from '@/components/dashboard/EmptyState';

export default async function ClientsPage() {
  const supabase = await createClient();
  const adminSupabase = createAdminClient();

  // Fetch client profiles
  const { data: clients } = await supabase
    .from('profiles')
    .select(`
      id,
      full_name,
      email,
      company,
      created_at,
      project_members(count)
    `)
    .eq('role', 'client')
    .order('created_at', { ascending: false });

  // Fetch auth users to get invite/confirmation status
  const { data: authData } = await adminSupabase.auth.admin.listUsers({ perPage: 100 });
  const authUsers = authData?.users ?? [];

  // Build a map of email → status
  const statusMap = new Map<string, 'active' | 'pending'>();
  for (const u of authUsers) {
    if (!u.email) continue;
    const hasSignedIn = !!u.last_sign_in_at;
    const isConfirmed = !!u.email_confirmed_at;
    statusMap.set(u.email, hasSignedIn || isConfirmed ? 'active' : 'pending');
  }

  return (
    <div>
      <PageHeader
        title="Clientes"
        description="Gestion de clientes y sus proyectos asociados."
        action={
          <Link
            href="/admin/clients/invite"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-background text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Invitar cliente
          </Link>
        }
      />

      {!clients || clients.length === 0 ? (
        <EmptyState
          title="Sin clientes"
          description="Invita a tu primer cliente para darle acceso al portal."
          icon={
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
          action={{ label: 'Invitar cliente', href: '/admin/clients/invite' }}
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
                  Email
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Estado
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Proyectos
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-text-muted uppercase tracking-wider">
                  Registro
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {clients.map((client) => {
                const memberCount =
                  Array.isArray(client.project_members) && client.project_members.length > 0
                    ? (client.project_members[0] as { count: number }).count
                    : 0;

                const status = statusMap.get(client.email) ?? 'pending';

                return (
                  <tr
                    key={client.id}
                    className="bg-background hover:bg-white/[0.03] transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-medium flex-shrink-0">
                          {client.full_name?.[0]?.toUpperCase() ?? '?'}
                        </div>
                        <span className="font-medium text-text-primary">
                          {client.full_name || 'Sin nombre'}
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{client.email}</td>
                    <td className="px-4 py-3">
                      {status === 'active' ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-mint/10 text-mint border border-mint/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-mint" />
                          Activo
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                          Pendiente
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{memberCount}</td>
                    <td className="px-4 py-3 text-text-muted">
                      {new Date(client.created_at).toLocaleDateString('es-MX', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
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
