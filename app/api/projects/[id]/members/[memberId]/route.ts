import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, AuthError } from '@/lib/api-auth';
import { createClient } from '@/lib/supabase/server';

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string; memberId: string }> }
) {
  try {
    const { id, memberId } = await params;
    await requireAdmin();
    const supabase = await createClient();

    const { error } = await supabase
      .from('project_members')
      .delete()
      .eq('id', memberId)
      .eq('project_id', id);

    if (error) {
      return NextResponse.json({ error: 'Error al eliminar miembro' }, { status: 500 });
    }

    return NextResponse.json({ data: { success: true } });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
