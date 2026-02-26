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

    const [projectsResult, activeProjectsResult, requestsResult, pendingResult, creditsResult] =
      await Promise.all([
        // Total projects (non-archived)
        supabase
          .from('projects')
          .select('id', { count: 'exact', head: true })
          .neq('status', 'archived'),

        // Active projects
        supabase
          .from('projects')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'active'),

        // Total requests
        supabase
          .from('requests')
          .select('id', { count: 'exact', head: true }),

        // Pending requests
        supabase
          .from('requests')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'pending'),

        // Total credits used this period
        supabase
          .from('credit_allocations')
          .select('used')
          .eq('period_start', periodStart),
      ]);

    const totalCreditsUsed = (creditsResult.data ?? []).reduce(
      (sum, a) => sum + (a.used ?? 0),
      0
    );

    return NextResponse.json({
      data: {
        total_projects: projectsResult.count ?? 0,
        active_projects: activeProjectsResult.count ?? 0,
        total_requests: requestsResult.count ?? 0,
        pending_requests: pendingResult.count ?? 0,
        total_credits_used: totalCreditsUsed,
      },
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
