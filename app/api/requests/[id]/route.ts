import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, requireAdmin, AuthError } from '@/lib/api-auth';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { user } = await requireAuth();
    const supabase = await createClient();

    const isAdmin = user.app_metadata?.role === 'admin';

    // Fetch request with submitter info
    const { data: request, error } = await supabase
      .from('requests')
      .select('*, profiles!submitted_by(id, full_name, email, avatar_url)')
      .eq('id', id)
      .single();

    if (error || !request) {
      return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 });
    }

    // If not admin, verify the user is a member of the request's project
    if (!isAdmin) {
      const { data: membership } = await supabase
        .from('project_members')
        .select('id')
        .eq('project_id', request.project_id)
        .eq('profile_id', user.id)
        .single();

      if (!membership) {
        return NextResponse.json(
          { error: 'Acceso denegado: no eres miembro de este proyecto' },
          { status: 403 }
        );
      }
    }

    // Get comments count
    let commentsQuery = supabase
      .from('request_comments')
      .select('id', { count: 'exact', head: true })
      .eq('request_id', id);

    if (!isAdmin) {
      commentsQuery = commentsQuery.eq('is_internal', false);
    }

    const { count: commentsCount } = await commentsQuery;

    // Get attachments count
    const { count: attachmentsCount } = await supabase
      .from('request_attachments')
      .select('id', { count: 'exact', head: true })
      .eq('request_id', id);

    return NextResponse.json({
      data: {
        ...request,
        comments_count: commentsCount ?? 0,
        attachments_count: attachmentsCount ?? 0,
      },
    });
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
      'status',
      'admin_priority',
      'credit_cost',
      'title',
      'description',
      'type',
      'priority_preference',
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

    // If status is being set to completed, add completed_at
    if (updates.status === 'completed') {
      updates.completed_at = new Date().toISOString();
    }

    const { data: updated, error } = await supabase
      .from('requests')
      .update(updates)
      .eq('id', id)
      .select('*, profiles!submitted_by(id, full_name, email)')
      .single();

    if (error || !updated) {
      return NextResponse.json({ error: 'Solicitud no encontrada o error al actualizar' }, { status: 404 });
    }

    return NextResponse.json({ data: updated });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
