import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, AuthError } from '@/lib/api-auth';
import { createClient } from '@/lib/supabase/server';
import { createGitHubIssue } from '@/lib/github';
import type { Project, Request } from '@/lib/types/database';

export async function POST(request: NextRequest) {
  try {
    const { profile } = await requireAdmin();
    const supabase = await createClient();
    const body = await request.json();

    const { requestId } = body;

    if (!requestId) {
      return NextResponse.json(
        { error: 'requestId es requerido' },
        { status: 400 }
      );
    }

    // Get the request with project info
    const { data: req, error: reqError } = await supabase
      .from('requests')
      .select('*, projects(*)')
      .eq('id', requestId)
      .single();

    if (reqError || !req) {
      return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 });
    }

    if (req.github_issue_number) {
      return NextResponse.json(
        { error: 'Esta solicitud ya tiene un issue de GitHub vinculado' },
        { status: 400 }
      );
    }

    const project = (Array.isArray(req.projects) ? req.projects[0] : req.projects) as Project | null;

    if (!project?.github_repo_owner || !project?.github_repo_name) {
      return NextResponse.json(
        { error: 'El proyecto no tiene un repositorio de GitHub configurado' },
        { status: 400 }
      );
    }

    // Create real GitHub issue
    const { number: issueNumber, url: issueUrl } = await createGitHubIssue(
      req as unknown as Request,
      project,
    );

    // Update request with GitHub issue info
    const { data: updatedRequest, error: updateError } = await supabase
      .from('requests')
      .update({
        github_issue_number: issueNumber,
        github_issue_url: issueUrl,
      })
      .eq('id', requestId)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: 'Error al vincular issue de GitHub' }, { status: 500 });
    }

    // Log activity
    await supabase.from('activity_log').insert({
      project_id: req.project_id,
      actor_id: profile.id,
      action: 'github_issue_created',
      entity_type: 'request',
      entity_id: requestId,
      metadata: {
        github_issue_number: issueNumber,
        github_issue_url: issueUrl,
      },
    });

    return NextResponse.json({
      data: {
        request: updatedRequest,
        github_issue: {
          number: issueNumber,
          url: issueUrl,
        },
      },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    const message = error instanceof Error ? error.message : 'Error interno del servidor';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
