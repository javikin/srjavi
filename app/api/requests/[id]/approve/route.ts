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

    const { credit_cost, admin_priority, create_github_issue } = body;

    if (credit_cost === undefined || credit_cost === null) {
      return NextResponse.json(
        { error: 'credit_cost es requerido' },
        { status: 400 }
      );
    }

    if (typeof credit_cost !== 'number' || credit_cost < 0) {
      return NextResponse.json(
        { error: 'credit_cost debe ser un numero positivo' },
        { status: 400 }
      );
    }

    // Get the request
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
        { error: 'Solo se pueden aprobar solicitudes con estado "pending"' },
        { status: 400 }
      );
    }

    // Get or create current period allocation
    const periodStart = new Date(
      Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1)
    )
      .toISOString()
      .split('T')[0];

    let { data: allocation } = await supabase
      .from('credit_allocations')
      .select('*')
      .eq('project_id', req.project_id)
      .eq('period_start', periodStart)
      .single();

    if (!allocation) {
      const { data: project } = await supabase
        .from('projects')
        .select('monthly_credit_quota')
        .eq('id', req.project_id)
        .single();

      const { data: newAllocation, error: createError } = await supabase
        .from('credit_allocations')
        .insert({
          project_id: req.project_id,
          period_start: periodStart,
          quota: project?.monthly_credit_quota ?? 10,
        })
        .select()
        .single();

      if (createError) {
        return NextResponse.json({ error: 'Error al crear asignacion de creditos' }, { status: 500 });
      }

      allocation = newAllocation;
    }

    // Deduct credits if cost > 0
    if (credit_cost > 0) {
      const newUsed = allocation.used + credit_cost;

      const { error: updateError } = await supabase
        .from('credit_allocations')
        .update({ used: newUsed })
        .eq('id', allocation.id);

      if (updateError) {
        return NextResponse.json({ error: 'Error al deducir creditos' }, { status: 500 });
      }

      // Create credit transaction
      await supabase.from('credit_transactions').insert({
        project_id: req.project_id,
        allocation_id: allocation.id,
        request_id: id,
        amount: credit_cost,
        balance_after: newUsed,
        description: `Aprobacion de solicitud: ${req.title}`,
        created_by: profile.id,
      });
    }

    // Update request status
    const updateFields: Record<string, unknown> = {
      status: 'approved',
      credit_cost,
    };

    if (admin_priority) {
      updateFields.admin_priority = admin_priority;
    }

    const { data: updatedRequest, error: updateReqError } = await supabase
      .from('requests')
      .update(updateFields)
      .eq('id', id)
      .select('*, profiles!submitted_by(id, full_name, email)')
      .single();

    if (updateReqError) {
      return NextResponse.json({ error: 'Error al aprobar solicitud' }, { status: 500 });
    }

    // Log activity
    await supabase.from('activity_log').insert({
      project_id: req.project_id,
      actor_id: profile.id,
      action: 'request_approved',
      entity_type: 'request',
      entity_id: id,
      metadata: { credit_cost, admin_priority: admin_priority ?? null, create_github_issue: create_github_issue ?? false },
    });

    return NextResponse.json({ data: updatedRequest });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
