import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, requireProjectAccess, AuthError } from '@/lib/api-auth';
import { createClient } from '@/lib/supabase/server';
import { createGitHubIssue } from '@/lib/github';
import type { Project, Request as RequestType } from '@/lib/types/database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requireProjectAccess(id);
    const supabase = await createClient();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const type = searchParams.get('type');
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '50', 10), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0', 10);

    let query = supabase
      .from('requests')
      .select('*, profiles!submitted_by(id, full_name, email, avatar_url)', { count: 'exact' })
      .eq('project_id', id);

    if (status) {
      query = query.eq('status', status);
    }
    if (type) {
      query = query.eq('type', type);
    }

    const { data: requests, error, count } = await query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      return NextResponse.json({ error: 'Error al obtener solicitudes' }, { status: 500 });
    }

    return NextResponse.json({
      data: requests,
      pagination: { limit, offset, total: count ?? 0 },
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { user, profile, membership } = await requireProjectAccess(id);
    const supabase = await createClient();

    const isAdmin = user.app_metadata?.role === 'admin';

    // Non-admin users must be project owners to create requests
    if (!isAdmin && (!membership || membership.role !== 'owner')) {
      return NextResponse.json(
        { error: 'Solo los propietarios del proyecto pueden crear solicitudes' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { type, title, description, priority_preference } = body;

    if (!type || !title || !description) {
      return NextResponse.json(
        { error: 'Tipo, titulo y descripcion son requeridos' },
        { status: 400 }
      );
    }

    const validTypes = ['bug', 'feature', 'improvement'];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: 'Tipo debe ser: bug, feature o improvement' },
        { status: 400 }
      );
    }

    const { data: req, error } = await supabase
      .from('requests')
      .insert({
        project_id: id,
        submitted_by: user.id,
        type,
        title,
        description,
        priority_preference: priority_preference ?? 'medium',
      })
      .select('*, profiles!submitted_by(id, full_name, email)')
      .single();

    if (error) {
      return NextResponse.json({ error: 'Error al crear solicitud' }, { status: 500 });
    }

    // Log activity
    await supabase.from('activity_log').insert({
      project_id: id,
      actor_id: profile.id,
      action: 'request_created',
      entity_type: 'request',
      entity_id: req.id,
      metadata: { title, type },
    });

    // Auto-create GitHub issue if project has a linked repo
    const { data: project } = await supabase
      .from('projects')
      .select('*')
      .eq('id', id)
      .single();

    if (project?.github_repo_owner && project?.github_repo_name) {
      try {
        const { number: issueNumber, url: issueUrl } = await createGitHubIssue(
          req as unknown as RequestType,
          project as Project,
        );

        await supabase
          .from('requests')
          .update({
            github_issue_number: issueNumber,
            github_issue_url: issueUrl,
          })
          .eq('id', req.id);

        await supabase.from('activity_log').insert({
          project_id: id,
          actor_id: profile.id,
          action: 'github_issue_created',
          entity_type: 'request',
          entity_id: req.id,
          metadata: { github_issue_number: issueNumber, github_issue_url: issueUrl },
        });

        req.github_issue_number = issueNumber;
        req.github_issue_url = issueUrl;
      } catch (ghError) {
        console.error('[github] Error al crear issue automáticamente:', ghError);
        // No falla la solicitud, solo no se crea el issue
      }
    }

    return NextResponse.json({ data: req }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
