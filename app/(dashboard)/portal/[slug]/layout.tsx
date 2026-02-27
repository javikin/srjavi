import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import SignOutButton from './SignOutButton';

const getNavItems = (slug: string) => [
  { href: `/portal/${slug}`, label: 'Resumen', icon: 'home' },
  { href: `/portal/${slug}/requests`, label: 'Solicitudes', icon: 'inbox' },
  { href: `/portal/${slug}/credits`, label: 'Créditos', icon: 'coins' },
  { href: `/portal/${slug}/settings`, label: 'Mi perfil', icon: 'user' },
];

function NavIcon({ icon }: { icon: string }) {
  const icons: Record<string, React.ReactNode> = {
    home: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    inbox: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
    ),
    coins: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    user: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  };

  return <>{icons[icon] || null}</>;
}

export default async function PortalLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const navItems = getNavItems(slug);

  const supabase = await createClient();

  // Fetch current project
  const { data: project } = await supabase
    .from('projects')
    .select('id, name, status')
    .eq('slug', slug)
    .single();

  if (!project) {
    redirect('/');
  }

  // Check if user has multiple projects (for switcher)
  const { data: { user } } = await supabase.auth.getUser();
  let otherProjects: { slug: string; name: string }[] = [];
  if (user) {
    const { data: memberships } = await supabase
      .from('project_members')
      .select('projects(slug, name)')
      .eq('profile_id', user.id);

    otherProjects = (memberships ?? [])
      .map((m) => {
        const p = Array.isArray(m.projects) ? m.projects[0] : m.projects;
        return p as { slug: string; name: string } | null;
      })
      .filter((p): p is { slug: string; name: string } => p !== null && p.slug !== slug);
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-surface border-r border-white/5 flex flex-col">
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-primary shrink-0" />
            <h2 className="text-sm font-semibold text-text-primary truncate">
              {project.name}
            </h2>
          </div>
          {otherProjects.length > 0 ? (
            <Link
              href="/portal"
              className="text-xs text-primary/70 hover:text-primary pl-4 transition-colors"
            >
              Cambiar proyecto
            </Link>
          ) : (
            <p className="text-xs text-text-muted pl-4">Portal del cliente</p>
          )}
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors"
            >
              <NavIcon icon={item.icon} />
              <span className="text-sm">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-2 px-3 py-2 text-sm text-text-muted hover:text-text-secondary transition-colors rounded-lg hover:bg-white/5"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Volver al sitio
          </Link>
          <SignOutButton />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  );
}
