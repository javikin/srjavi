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

    const { amount, description } = body;

    if (amount === undefined || amount === null || !description) {
      return NextResponse.json(
        { error: 'Cantidad y descripcion son requeridos' },
        { status: 400 }
      );
    }

    if (typeof amount !== 'number' || amount === 0) {
      return NextResponse.json(
        { error: 'La cantidad debe ser un numero distinto de cero' },
        { status: 400 }
      );
    }

    const periodStart = new Date(
      Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1)
    )
      .toISOString()
      .split('T')[0];

    // Get or create current period allocation
    let { data: allocation } = await supabase
      .from('credit_allocations')
      .select('*')
      .eq('project_id', id)
      .eq('period_start', periodStart)
      .single();

    if (!allocation) {
      const { data: project } = await supabase
        .from('projects')
        .select('monthly_credit_quota')
        .eq('id', id)
        .single();

      if (!project) {
        return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
      }

      const { data: newAllocation, error: createError } = await supabase
        .from('credit_allocations')
        .insert({
          project_id: id,
          period_start: periodStart,
          quota: project.monthly_credit_quota,
        })
        .select()
        .single();

      if (createError) {
        return NextResponse.json({ error: 'Error al crear asignacion de creditos' }, { status: 500 });
      }

      allocation = newAllocation;
    }

    // Update used credits
    const newUsed = allocation.used + amount;

    const { error: updateError } = await supabase
      .from('credit_allocations')
      .update({ used: newUsed })
      .eq('id', allocation.id);

    if (updateError) {
      return NextResponse.json({ error: 'Error al actualizar creditos' }, { status: 500 });
    }

    // Create credit transaction
    const { data: transaction, error: txError } = await supabase
      .from('credit_transactions')
      .insert({
        project_id: id,
        allocation_id: allocation.id,
        amount,
        balance_after: newUsed,
        description,
        created_by: profile.id,
      })
      .select()
      .single();

    if (txError) {
      return NextResponse.json({ error: 'Error al registrar transaccion' }, { status: 500 });
    }

    return NextResponse.json({
      data: {
        transaction,
        allocation: {
          ...allocation,
          used: newUsed,
          remaining: allocation.quota - newUsed,
        },
      },
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
