import { NextRequest, NextResponse } from 'next/server';
import { requireProjectAccess, AuthError } from '@/lib/api-auth';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requireProjectAccess(id);
    const supabase = await createClient();

    const { data: allocations, error } = await supabase
      .from('credit_allocations')
      .select('*')
      .eq('project_id', id)
      .order('period_start', { ascending: false });

    if (error) {
      return NextResponse.json({ error: 'Error al obtener historial de creditos' }, { status: 500 });
    }

    const allocationsWithRemaining = (allocations ?? []).map((a) => ({
      ...a,
      remaining: a.quota - a.used,
    }));

    return NextResponse.json({ data: allocationsWithRemaining });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
