import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export default async function PortalIndexPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Fetch all projects this user belongs to
  const { data: memberships } = await supabase
    .from('project_members')
    .select('role, projects(slug, name, description, status)')
    .eq('profile_id', user.id);

  const projects = (memberships ?? [])
    .map((m) => {
      const p = Array.isArray(m.projects) ? m.projects[0] : m.projects;
      return p ? { ...p, role: m.role } : null;
    })
    .filter(Boolean) as { slug: string; name: string; description: string | null; status: string; role: string }[];

  // If only one project, redirect directly
  if (projects.length === 1) {
    redirect(`/portal/${projects[0].slug}`);
  }

  // If no projects, show message
  if (projects.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="text-center max-w-md space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-surface border border-white/5 flex items-center justify-center mx-auto">
            <svg className="w-7 h-7 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold text-text-primary">Sin proyectos asignados</h1>
          <p className="text-sm text-text-secondary">
            Aun no tienes proyectos asociados a tu cuenta. Contacta al administrador para que te asigne a un proyecto.
          </p>
        </div>
      </div>
    );
  }

  // Multiple projects: show selector
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-semibold text-text-primary">Mis proyectos</h1>
          <p className="text-sm text-text-secondary">
            Selecciona un proyecto para acceder al portal
          </p>
        </div>

        <div className="space-y-3">
          {projects.map((project) => (
            <Link
              key={project.slug}
              href={`/portal/${project.slug}`}
              className="block rounded-xl bg-surface border border-white/5 p-5 hover:border-primary/30 hover:bg-white/[0.02] transition-all group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                  <span className="text-primary font-semibold text-sm">
                    {project.name[0].toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <h2 className="text-base font-medium text-text-primary group-hover:text-primary transition-colors">
                    {project.name}
                  </h2>
                  {project.description && (
                    <p className="text-xs text-text-muted truncate mt-0.5">{project.description}</p>
                  )}
                </div>
                <svg className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
