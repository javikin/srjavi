import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin, AuthError } from '@/lib/api-auth';
import { createClient } from '@/lib/supabase/server';

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

    // Get the request
    const { data: req, error: reqError } = await supabase
      .from('requests')
      .select('*, projects(github_repo_owner, github_repo_name)')
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

    // Placeholder: simulate GitHub issue creation
    // In production, this would call the GitHub API
    const mockIssueNumber = Math.floor(Math.random() * 9000) + 1000;
    const repoOwner = req.projects?.github_repo_owner ?? 'placeholder';
    const repoName = req.projects?.github_repo_name ?? 'placeholder';
    const mockIssueUrl = `https://github.com/${repoOwner}/${repoName}/issues/${mockIssueNumber}`;

    // Update request with GitHub issue info
    const { data: updatedRequest, error: updateError } = await supabase
      .from('requests')
      .update({
        github_issue_number: mockIssueNumber,
        github_issue_url: mockIssueUrl,
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
        github_issue_number: mockIssueNumber,
        github_issue_url: mockIssueUrl,
        placeholder: true,
      },
    });

    return NextResponse.json({
      data: {
        request: updatedRequest,
        github_issue: {
          number: mockIssueNumber,
          url: mockIssueUrl,
          placeholder: true,
        },
      },
    }, { status: 201 });
  } catch (error) {
    if (error instanceof AuthError) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}
