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

    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !project) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ data: project });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requireAdmin();
    const supabase = await createClient();
    const body = await request.json();

    const allowedFields = [
      'name',
      'slug',
      'description',
      'status',
      'billing_type',
      'tech_stack',
      'github_repo_owner',
      'github_repo_name',
      'github_default_branch',
      'website_url',
      'monthly_credit_quota',
    ];

    const updates: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (field in body) {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No se proporcionaron campos para actualizar' },
        { status: 400 }
      );
    }

    const { data: project, error } = await supabase
      .from('projects')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Ya existe un proyecto con ese slug' },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: 'Error al actualizar proyecto' }, { status: 500 });
    }

    if (!project) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
    }

    return NextResponse.json({ data: project });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { profile } = await requireAdmin();
    const supabase = await createClient();

    const { data: project, error } = await supabase
      .from('projects')
      .update({ status: 'archived' })
      .eq('id', id)
      .select()
      .single();

    if (error || !project) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
    }

    await supabase.from('activity_log').insert({
      project_id: id,
      actor_id: profile.id,
      action: 'project_archived',
      entity_type: 'project',
      entity_id: id,
    });

    return NextResponse.json({ data: project });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
