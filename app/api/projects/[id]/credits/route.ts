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

    const periodStart = new Date(
      Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1)
    )
      .toISOString()
      .split('T')[0];

    // Get current period allocation
    const { data: allocation, error } = await supabase
      .from('credit_allocations')
      .select('*')
      .eq('project_id', id)
      .eq('period_start', periodStart)
      .single();

    if (error || !allocation) {
      // If no allocation exists for this period, get the project's default quota
      const { data: project } = await supabase
        .from('projects')
        .select('monthly_credit_quota')
        .eq('id', id)
        .single();

      const quota = project?.monthly_credit_quota ?? 10;

      return NextResponse.json({
        data: {
          project_id: id,
          period_start: periodStart,
          quota,
          used: 0,
          remaining: quota,
        },
      });
    }

    return NextResponse.json({
      data: {
        ...allocation,
        remaining: allocation.quota - allocation.used,
      },
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
