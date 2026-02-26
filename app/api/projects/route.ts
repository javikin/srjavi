import { NextRequest, NextResponse } from 'next/server';
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

    // Get all non-archived projects
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .neq('status', 'archived')
      .order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error: 'Error al obtener proyectos' }, { status: 500 });
    }

    // Gather stats for each project in parallel
    const projectIds = projects.map((p) => p.id);

    const [membersResult, requestsResult, allocationsResult] = await Promise.all([
      supabase
        .from('project_members')
        .select('project_id')
        .in('project_id', projectIds),
      supabase
        .from('requests')
        .select('project_id, status')
        .in('project_id', projectIds)
        .in('status', ['pending', 'approved', 'in_progress']),
      supabase
        .from('credit_allocations')
        .select('project_id, quota, used')
        .in('project_id', projectIds)
        .eq('period_start', periodStart),
    ]);

    // Build lookup maps
    const memberCounts: Record<string, number> = {};
    (membersResult.data ?? []).forEach((m) => {
      memberCounts[m.project_id] = (memberCounts[m.project_id] ?? 0) + 1;
    });

    const openRequestCounts: Record<string, number> = {};
    (requestsResult.data ?? []).forEach((r) => {
      openRequestCounts[r.project_id] = (openRequestCounts[r.project_id] ?? 0) + 1;
    });

    const allocations: Record<string, { quota: number; used: number }> = {};
    (allocationsResult.data ?? []).forEach((a) => {
      allocations[a.project_id] = { quota: a.quota, used: a.used };
    });

    const projectsWithStats = projects.map((p) => ({
      ...p,
      member_count: memberCounts[p.id] ?? 0,
      open_request_count: openRequestCounts[p.id] ?? 0,
      credits: allocations[p.id] ?? { quota: p.monthly_credit_quota, used: 0 },
    }));

    return NextResponse.json({ data: projectsWithStats });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { profile } = await requireAdmin();
    const supabase = await createClient();
    const body = await request.json();

    const { name, slug, description, billing_type, tech_stack, monthly_credit_quota, github_repo_owner, github_repo_name, website_url } = body;

    if (!name || !slug) {
      return NextResponse.json(
        { error: 'Nombre y slug son requeridos' },
        { status: 400 }
      );
    }

    // Create project
    const { data: project, error } = await supabase
      .from('projects')
      .insert({
        name,
        slug,
        description: description ?? null,
        billing_type: billing_type ?? 'paid',
        tech_stack: tech_stack ?? [],
        monthly_credit_quota: monthly_credit_quota ?? 10,
        github_repo_owner: github_repo_owner ?? null,
        github_repo_name: github_repo_name ?? null,
        website_url: website_url ?? null,
      })
      .select()
      .single();

    if (error) {
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'Ya existe un proyecto con ese slug' },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: 'Error al crear proyecto' }, { status: 500 });
    }

    // Create initial credit allocation for the current month
    const periodStart = new Date(
      Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1)
    )
      .toISOString()
      .split('T')[0];

    await supabase.from('credit_allocations').insert({
      project_id: project.id,
      period_start: periodStart,
      quota: project.monthly_credit_quota,
    });

    // Log activity
    await supabase.from('activity_log').insert({
      project_id: project.id,
      actor_id: profile.id,
      action: 'project_created',
      entity_type: 'project',
      entity_id: project.id,
      metadata: { name: project.name },
    });

    return NextResponse.json({ data: project }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
