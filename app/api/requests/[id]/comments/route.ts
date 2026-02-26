import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, AuthError } from '@/lib/api-auth';
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

    // Verify request exists and user has access
    const { data: request } = await supabase
      .from('requests')
      .select('project_id')
      .eq('id', id)
      .single();

    if (!request) {
      return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 });
    }

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

    let query = supabase
      .from('request_comments')
      .select('*, profiles!author_id(id, full_name, email, avatar_url)')
      .eq('request_id', id);

    // Clients only see non-internal comments
    if (!isAdmin) {
      query = query.eq('is_internal', false);
    }

    const { data: comments, error } = await query.order('created_at', { ascending: true });

    if (error) {
      return NextResponse.json({ error: 'Error al obtener comentarios' }, { status: 500 });
    }

    return NextResponse.json({ data: comments });
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
    const { user } = await requireAuth();
    const supabase = await createClient();
    const body = await request.json();

    const isAdmin = user.app_metadata?.role === 'admin';

    const { body: commentBody, is_internal } = body;

    if (!commentBody) {
      return NextResponse.json(
        { error: 'El cuerpo del comentario es requerido' },
        { status: 400 }
      );
    }

    // Only admins can create internal comments
    if (is_internal && !isAdmin) {
      return NextResponse.json(
        { error: 'Solo los administradores pueden crear notas internas' },
        { status: 403 }
      );
    }

    // Verify request exists and user has access
    const { data: req } = await supabase
      .from('requests')
      .select('project_id')
      .eq('id', id)
      .single();

    if (!req) {
      return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 });
    }

    if (!isAdmin) {
      const { data: membership } = await supabase
        .from('project_members')
        .select('id')
        .eq('project_id', req.project_id)
        .eq('profile_id', user.id)
        .single();

      if (!membership) {
        return NextResponse.json(
          { error: 'Acceso denegado: no eres miembro de este proyecto' },
          { status: 403 }
        );
      }
    }

    const { data: comment, error } = await supabase
      .from('request_comments')
      .insert({
        request_id: id,
        author_id: user.id,
        body: commentBody,
        is_internal: is_internal ?? false,
      })
      .select('*, profiles!author_id(id, full_name, email, avatar_url)')
      .single();

    if (error) {
      return NextResponse.json({ error: 'Error al crear comentario' }, { status: 500 });
    }

    return NextResponse.json({ data: comment }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
