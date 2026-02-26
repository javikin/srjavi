import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, requireProjectAccess, AuthError } from '@/lib/api-auth';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requireProjectAccess(id);
    const supabase = await createClient();

    const { data: members, error } = await supabase
      .from('project_members')
      .select('id, role, created_at, profile_id, profiles(id, email, full_name, avatar_url, company)')
      .eq('project_id', id)
      .order('created_at', { ascending: true });

    if (error) {
      return NextResponse.json({ error: 'Error al obtener miembros' }, { status: 500 });
    }

    return NextResponse.json({ data: members });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requireAdmin();
    const supabase = await createClient();
    const body = await request.json();

    const { profile_id, role } = body;

    if (!profile_id || !role) {
      return NextResponse.json(
        { error: 'profile_id y role son requeridos' },
        { status: 400 }
      );
    }

    if (!['owner', 'viewer'].includes(role)) {
      return NextResponse.json(
        { error: 'El rol debe ser "owner" o "viewer"' },
        { status: 400 }
      );
    }

    // Verify the project exists
    const { data: project } = await supabase
      .from('projects')
      .select('id')
      .eq('id', id)
      .single();

    if (!project) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
    }

    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', profile_id)
      .single();

    if (!existingProfile) {
      return NextResponse.json(
        { error: 'Perfil no encontrado. Usa /api/auth/invite para invitar nuevos usuarios.' },
        { status: 404 }
      );
    }

    const { data: member, error } = await supabase
      .from('project_members')
      .insert({
        project_id: id,
        profile_id,
        role,
      })
      .select('id, role, created_at, profile_id, profiles(id, email, full_name, avatar_url)')
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Este usuario ya es miembro del proyecto' },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: 'Error al agregar miembro' }, { status: 500 });
    }

    return NextResponse.json({ data: member }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
