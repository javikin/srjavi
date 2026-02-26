import { NextResponse } from 'next/server';
import { requireAdmin, AuthError } from '@/lib/api-auth';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    await requireAdmin();
    const supabase = await createClient();

    const periodStart = new Date(
      Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1)
    )
      .toISOString()
      .split('T')[0];

    // Get current period allocations with project info
    const { data: allocations, error } = await supabase
      .from('credit_allocations')
      .select('project_id, quota, used, projects(id, name, slug)')
      .eq('period_start', periodStart);

    if (error) {
      return NextResponse.json({ error: 'Error al obtener uso de creditos' }, { status: 500 });
    }

    type ProjectRow = { id: string; name: string; slug: string };

    const creditsByProject = (allocations ?? []).map((a) => {
      const rawProject = a.projects as unknown as ProjectRow | null;
      return {
        project_id: a.project_id,
        project_name: rawProject?.name ?? 'Desconocido',
        project_slug: rawProject?.slug ?? '',
        quota: a.quota,
        used: a.used,
        remaining: a.quota - a.used,
        usage_percentage: a.quota > 0 ? Math.round((a.used / a.quota) * 100) : 0,
      };
    });

    const totals = creditsByProject.reduce(
      (acc, p) => ({
        total_quota: acc.total_quota + p.quota,
        total_used: acc.total_used + p.used,
      }),
      { total_quota: 0, total_used: 0 }
    );

    return NextResponse.json({
      data: {
        period_start: periodStart,
        projects: creditsByProject,
        totals: {
          ...totals,
          total_remaining: totals.total_quota - totals.total_used,
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
