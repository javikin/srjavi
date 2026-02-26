import { NextResponse } from 'next/server';
import { requireAdmin, AuthError } from '@/lib/api-auth';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    await requireAdmin();
    const supabase = await createClient();

    // Get all requests for aggregation
    const { data: requests, error } = await supabase
      .from('requests')
      .select('type, status');

    if (error) {
      return NextResponse.json({ error: 'Error al obtener estadisticas de solicitudes' }, { status: 500 });
    }

    const allRequests = requests ?? [];

    // Aggregate by type
    const byType: Record<string, number> = {};
    for (const req of allRequests) {
      byType[req.type] = (byType[req.type] ?? 0) + 1;
    }

    // Aggregate by status
    const byStatus: Record<string, number> = {};
    for (const req of allRequests) {
      byStatus[req.status] = (byStatus[req.status] ?? 0) + 1;
    }

    return NextResponse.json({
      data: {
        total: allRequests.length,
        by_type: byType,
        by_status: byStatus,
      },
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
