import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, AuthError } from '@/lib/api-auth';
import { createClient } from '@/lib/supabase/server';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { profile } = await requireAdmin();
    const supabase = await createClient();
    const body = await request.json();

    const { rejection_reason } = body;

    if (!rejection_reason) {
      return NextResponse.json(
        { error: 'La razon de rechazo es requerida' },
        { status: 400 }
      );
    }

    // Get the request to verify it exists and is pending
    const { data: req, error: reqError } = await supabase
      .from('requests')
      .select('*')
      .eq('id', id)
      .single();

    if (reqError || !req) {
      return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 });
    }

    if (req.status !== 'pending') {
      return NextResponse.json(
        { error: 'Solo se pueden rechazar solicitudes con estado "pending"' },
        { status: 400 }
      );
    }

    const { data: updatedRequest, error: updateError } = await supabase
      .from('requests')
      .update({
        status: 'rejected',
        rejection_reason,
      })
      .eq('id', id)
      .select('*, profiles!submitted_by(id, full_name, email)')
      .single();

    if (updateError) {
      return NextResponse.json({ error: 'Error al rechazar solicitud' }, { status: 500 });
    }

    // Log activity
    await supabase.from('activity_log').insert({
      project_id: req.project_id,
      actor_id: profile.id,
      action: 'request_rejected',
      entity_type: 'request',
      entity_id: id,
      metadata: { rejection_reason },
    });

    return NextResponse.json({ data: updatedRequest });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
