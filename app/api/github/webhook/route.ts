import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import crypto from 'crypto';

function verifySignature(payload: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;

  const expected = 'sha256=' + crypto.createHmac('sha256', secret).update(payload).digest('hex');

  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.GITHUB_WEBHOOK_SECRET;
    if (!secret) {
      console.error('GITHUB_WEBHOOK_SECRET no configurado');
      return NextResponse.json({ error: 'Configuracion de webhook invalida' }, { status: 500 });
    }

    const rawBody = await request.text();
    const signature = request.headers.get('x-hub-signature-256');

    if (!verifySignature(rawBody, signature, secret)) {
      return NextResponse.json({ error: 'Firma invalida' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventType = request.headers.get('x-github-event') ?? 'unknown';
    const deliveryId = request.headers.get('x-github-delivery') ?? crypto.randomUUID();
    const action = payload.action ?? '';

    const supabase = createAdminClient();

    // Store raw event for idempotency and debugging
    const { error: insertError } = await supabase.from('webhook_events').insert({
      github_delivery_id: deliveryId,
      event_type: eventType,
      action,
      payload,
    });

    if (insertError) {
      // If duplicate delivery_id, it's a retry -- return 200 to stop retries
      if (insertError.code === '23505') {
        return NextResponse.json({ message: 'Evento ya procesado' });
      }
      console.error('Error al guardar evento webhook:', insertError);
      return NextResponse.json({ error: 'Error al guardar evento' }, { status: 500 });
    }

    // Process issue events
    if (eventType === 'issues' && payload.issue) {
      const issueNumber = payload.issue.number;

      // Find matching request by github_issue_number
      const { data: matchingRequest } = await supabase
        .from('requests')
        .select('id, project_id, status')
        .eq('github_issue_number', issueNumber)
        .single();

      if (matchingRequest) {
        let newStatus: string | null = null;

        if (action === 'closed') {
          newStatus = 'completed';
        } else if (action === 'reopened' && matchingRequest.status === 'completed') {
          newStatus = 'in_progress';
        }

        if (newStatus) {
          const updates: Record<string, unknown> = { status: newStatus };
          if (newStatus === 'completed') {
            updates.completed_at = new Date().toISOString();
          }

          await supabase
            .from('requests')
            .update(updates)
            .eq('id', matchingRequest.id);

          // Log activity
          await supabase.from('activity_log').insert({
            project_id: matchingRequest.project_id,
            actor_id: matchingRequest.id, // Use request id as actor since this is automated
            action: `request_${newStatus}_via_github`,
            entity_type: 'request',
            entity_id: matchingRequest.id,
            metadata: { github_issue_number: issueNumber, github_action: action },
          });
        }
      }

      // Mark event as processed
      await supabase
        .from('webhook_events')
        .update({ processed: true, processed_at: new Date().toISOString() })
        .eq('github_delivery_id', deliveryId);
    }

    return NextResponse.json({ message: 'Evento recibido' });
  } catch (error) {
    console.error('Error procesando webhook:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
