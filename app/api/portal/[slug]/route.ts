import { NextRequest, NextResponse } from 'next/server';
import { requireAuth, AuthError } from '@/lib/api-auth';
import { createClient } from '@/lib/supabase/server';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { user } = await requireAuth();
    const supabase = await createClient();

    const isAdmin = user.app_metadata?.role === 'admin';

    // Resolve slug to project
    const { data: project, error } = await supabase
      .from('projects')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error || !project) {
      return NextResponse.json({ error: 'Proyecto no encontrado' }, { status: 404 });
    }

    // If not admin, verify the user is a member of this project
    if (!isAdmin) {
      const { data: membership } = await supabase
        .from('project_members')
        .select('id, role')
        .eq('project_id', project.id)
        .eq('profile_id', user.id)
        .single();

      if (!membership) {
        return NextResponse.json(
          { error: 'Acceso denegado: no eres miembro de este proyecto' },
          { status: 403 }
        );
      }
    }

    // Get current period credits
    const periodStart = new Date(
      Date.UTC(new Date().getUTCFullYear(), new Date().getUTCMonth(), 1)
    )
      .toISOString()
      .split('T')[0];

    const { data: allocation } = await supabase
      .from('credit_allocations')
      .select('quota, used')
      .eq('project_id', project.id)
      .eq('period_start', periodStart)
      .single();

    const credits = allocation
      ? { quota: allocation.quota, used: allocation.used, remaining: allocation.quota - allocation.used }
      : { quota: project.monthly_credit_quota, used: 0, remaining: project.monthly_credit_quota };

    // Get recent requests summary
    const { count: pendingCount } = await supabase
      .from('requests')
      .select('id', { count: 'exact', head: true })
      .eq('project_id', project.id)
      .eq('status', 'pending');

    const { count: inProgressCount } = await supabase
      .from('requests')
      .select('id', { count: 'exact', head: true })
      .eq('project_id', project.id)
      .eq('status', 'in_progress');

    return NextResponse.json({
      data: {
        project,
        credits,
        request_summary: {
          pending: pendingCount ?? 0,
          in_progress: inProgressCount ?? 0,
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
