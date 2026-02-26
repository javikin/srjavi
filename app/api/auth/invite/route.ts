import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, AuthError } from '@/lib/api-auth';
import { createAdminClient, createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const { profile: adminProfile } = await requireAdmin();
    const supabase = await createClient();
    const adminSupabase = createAdminClient();
    const body = await request.json();

    const { email, full_name, project_id, role } = body;

    if (!email || !full_name || !project_id || !role) {
      return NextResponse.json(
        { error: 'email, full_name, project_id y role son requeridos' },
        { status: 400 }
      );
    }

    if (!['owner', 'viewer'].includes(role)) {
      return NextResponse.json(
        { error: 'El rol debe ser "owner" o "viewer"' },
        { status: 400 }
      );
    }

    // Verify project exists
    const { data: project } = await supabase
      .from('projects')
      .select('id, name')
      .eq('id', project_id)
      .single();

    if (!project) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
    }

    // Check if user already exists by email
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    let userId: string;

    if (existingProfile) {
      userId = existingProfile.id;
    } else {
      // Create user via Supabase Auth admin API
      const { data: authData, error: authError } = await adminSupabase.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { full_name },
        app_metadata: { role: 'client' },
      });

      if (authError) {
        if (authError.message?.includes('already been registered')) {
          return NextResponse.json(
            { error: 'Este email ya esta registrado' },
            { status: 409 }
          );
        }
        console.error('Error creando usuario:', authError);
        return NextResponse.json({ error: 'Error al crear usuario' }, { status: 500 });
      }

      userId = authData.user.id;
    }

    // Add user to project
    const { data: member, error: memberError } = await supabase
      .from('project_members')
      .insert({
        project_id,
        profile_id: userId,
        role,
      })
      .select('id, role, created_at, profile_id, profiles(id, email, full_name)')
      .single();

    if (memberError) {
      if (memberError.code === '23505') {
        return NextResponse.json(
          { error: 'Este usuario ya es miembro del proyecto' },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: 'Error al agregar miembro al proyecto' }, { status: 500 });
    }

    // Log activity
    await supabase.from('activity_log').insert({
      project_id,
      actor_id: adminProfile.id,
      action: 'user_invited',
      entity_type: 'project_member',
      entity_id: member.id,
      metadata: { email, full_name, role, project_name: project.name },
    });

    return NextResponse.json({ data: member }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
