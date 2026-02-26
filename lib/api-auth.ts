import { createClient } from '@/lib/supabase/server';

export class AuthError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
  }
}

/**
 * Validates the current session and returns the user profile.
 * Throws AuthError(401) if not authenticated.
 */
export async function requireAuth() {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new AuthError('No autenticado', 401);
  }

  // Fetch profile from profiles table
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profileError || !profile) {
    throw new AuthError('Perfil no encontrado', 401);
  }

  return { user, profile };
}

/**
 * Validates the current session and checks that the user is an admin.
 * Throws AuthError(401) if not authenticated, AuthError(403) if not admin.
 */
export async function requireAdmin() {
  const { user, profile } = await requireAuth();

  const role = user.app_metadata?.role;

  if (role !== 'admin') {
    throw new AuthError('Acceso denegado: se requiere rol de administrador', 403);
  }

  return { user, profile };
}

/**
 * Validates the current session and checks that the user has access to the given project.
 * Admins have access to all projects.
 * Clients must be members of the project.
 * Throws AuthError(401) if not authenticated, AuthError(403) if no access.
 */
export async function requireProjectAccess(projectId: string) {
  const supabase = await createClient();
  const { user, profile } = await requireAuth();

  const role = user.app_metadata?.role;

  // Admins have access to all projects
  if (role === 'admin') {
    return { user, profile };
  }

  // Check project membership for non-admin users
  const { data: membership, error: memberError } = await supabase
    .from('project_members')
    .select('id, role')
    .eq('project_id', projectId)
    .eq('profile_id', user.id)
    .single();

  if (memberError || !membership) {
    throw new AuthError('Acceso denegado: no eres miembro de este proyecto', 403);
  }

  return { user, profile, membership };
}
