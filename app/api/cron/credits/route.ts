import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const supabase = createAdminClient();

  const now = new Date();
  const periodStart = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1))
    .toISOString()
    .split('T')[0];

  // Get all active projects with their monthly quota
  const { data: projects, error: projectsError } = await supabase
    .from('projects')
    .select('id, monthly_credit_quota')
    .eq('status', 'active');

  if (projectsError) {
    console.error('[cron/credits] Error fetching projects:', projectsError);
    return NextResponse.json({ error: 'Error al obtener proyectos' }, { status: 500 });
  }

  if (!projects || projects.length === 0) {
    return NextResponse.json({ message: 'No hay proyectos activos', created: 0 });
  }

  const projectIds = projects.map((p) => p.id);

  // Find projects that already have an allocation for this period
  const { data: existingAllocations, error: allocError } = await supabase
    .from('credit_allocations')
    .select('project_id')
    .eq('period_start', periodStart)
    .in('project_id', projectIds);

  if (allocError) {
    console.error('[cron/credits] Error fetching existing allocations:', allocError);
    return NextResponse.json({ error: 'Error al verificar asignaciones existentes' }, { status: 500 });
  }

  const existingProjectIds = new Set((existingAllocations ?? []).map((a) => a.project_id));

  const allocationsToCreate = projects
    .filter((p) => !existingProjectIds.has(p.id))
    .map((p) => ({
      project_id: p.id,
      period_start: periodStart,
      quota: p.monthly_credit_quota ?? 10,
      used: 0,
    }));

  if (allocationsToCreate.length === 0) {
    return NextResponse.json({ message: 'Todas las asignaciones ya existen', created: 0 });
  }

  const { error: insertError } = await supabase
    .from('credit_allocations')
    .insert(allocationsToCreate);

  if (insertError) {
    console.error('[cron/credits] Error inserting allocations:', insertError);
    return NextResponse.json({ error: 'Error al crear asignaciones' }, { status: 500 });
  }

  console.log(`[cron/credits] Created ${allocationsToCreate.length} allocations for period ${periodStart}`);

  return NextResponse.json({
    message: 'Asignaciones de créditos creadas correctamente',
    period: periodStart,
    created: allocationsToCreate.length,
  });
}
