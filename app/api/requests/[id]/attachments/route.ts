import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, AuthError } from '@/lib/api-auth';
import { createClient } from '@/lib/supabase/server';

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

    const { file_name, file_url, file_size, mime_type } = body;

    if (!file_name || !file_url || !file_size || !mime_type) {
      return NextResponse.json(
        { error: 'file_name, file_url, file_size y mime_type son requeridos' },
        { status: 400 }
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

    const { data: attachment, error } = await supabase
      .from('request_attachments')
      .insert({
        request_id: id,
        file_name,
        file_url,
        file_size,
        mime_type,
        uploaded_by: user.id,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: 'Error al crear adjunto' }, { status: 500 });
    }

    return NextResponse.json({ data: attachment }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
