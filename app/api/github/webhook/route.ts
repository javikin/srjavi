import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import crypto from 'crypto';

function verifySignature(payload: string, signature: string | null, secret: string): boolean {
  if (!signature) return false;

  const expected = 'sha256=' + crypto.createHmac('sha256', secret).update(payload).digest('hex');

  try {
    return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const secret = process.env.GITHUB_WEBHOOK_SECRET;
    if (!secret) {
      console.error('GITHUB_WEBHOOK_SECRET no configurado');
      return NextResponse.json({ error: 'Configuracion de webhook invalida' }, { status: 500 });
    }

    const rawBody = await request.text();
    const signature = request.headers.get('x-hub-signature-256');

    if (!verifySignature(rawBody, signature, secret)) {
      return NextResponse.json({ error: 'Firma invalida' }, { status: 401 });
    }

    const payload = JSON.parse(rawBody);
    const eventType = request.headers.get('x-github-event') ?? 'unknown';
    const deliveryId = request.headers.get('x-github-delivery') ?? crypto.randomUUID();
    const action = payload.action ?? '';

    const supabase = createAdminClient();

    // Store raw event for idempotency and debugging
    const { error: insertError } = await supabase.from('webhook_events').insert({
      github_delivery_id: deliveryId,
      event_type: eventType,
      action,
      payload,
    });

    if (insertError) {
      // Duplicate delivery_id means a GitHub retry — return 200 to stop retries
      if (insertError.code === '23505') {
        return NextResponse.json({ message: 'Evento ya procesado' });
      }
      console.error('Error al guardar evento webhook:', insertError);
      return NextResponse.json({ error: 'Error al guardar evento' }, { status: 500 });
    }

    // Extract repo info from payload (present on both issues and issue_comment events)
    const repoOwner: string | undefined = payload.repository?.owner?.login;
    const repoName: string | undefined = payload.repository?.name;

    // Process issue status changes (closed / reopened)
    if (eventType === 'issues' && payload.issue) {
      const issueNumber: number = payload.issue.number;
      await handleIssueStatusChange(supabase, issueNumber, repoOwner, repoName, action, deliveryId);
    }

    // Process new comments posted on GitHub issues
    if (eventType === 'issue_comment' && action === 'created' && payload.issue && payload.comment) {
      const issueNumber: number = payload.issue.number;
      const comment = payload.comment as Record<string, unknown>;
      await handleIssueComment(supabase, issueNumber, repoOwner, repoName, comment, deliveryId);
    }

    return NextResponse.json({ message: 'Evento recibido' });
  } catch (error) {
    console.error('Error procesando webhook:', error);
    return NextResponse.json({ error: 'Error interno del servidor' }, { status: 500 });
  }
}

// ---------------------------------------------------------------------------
// Issue status sync: closed → completed, reopened → in_progress
// ---------------------------------------------------------------------------

async function handleIssueStatusChange(
  supabase: ReturnType<typeof createAdminClient>,
  issueNumber: number,
  repoOwner: string | undefined,
  repoName: string | undefined,
  action: string,
  deliveryId: string,
) {
  // Scope by repo owner + name when available to avoid cross-project collisions
  const { data: matchingRequest } = repoOwner && repoName
    ? await supabase
        .from('requests')
        .select('id, project_id, status, projects!inner(github_repo_owner, github_repo_name)')
        .eq('github_issue_number', issueNumber)
        .eq('projects.github_repo_owner', repoOwner)
        .eq('projects.github_repo_name', repoName)
        .maybeSingle()
    : await supabase
        .from('requests')
        .select('id, project_id, status')
        .eq('github_issue_number', issueNumber)
        .maybeSingle();

  if (!matchingRequest) {
    await markProcessed(supabase, deliveryId);
    return;
  }

  let newStatus: string | null = null;

  if (action === 'closed') {
    newStatus = 'completed';
  } else if (action === 'reopened' && matchingRequest.status === 'completed') {
    newStatus = 'in_progress';
  }

  if (!newStatus) {
    await markProcessed(supabase, deliveryId);
    return;
  }

  const updates: Record<string, unknown> = { status: newStatus };
  if (newStatus === 'completed') {
    updates.completed_at = new Date().toISOString();
  } else {
    // Clear completed_at when reopening
    updates.completed_at = null;
  }

  const { error: updateError } = await supabase
    .from('requests')
    .update(updates)
    .eq('id', matchingRequest.id);

  if (updateError) {
    console.error('Error actualizando estado de solicitud:', updateError);
    await markProcessedWithError(supabase, deliveryId, updateError.message);
    return;
  }

  // Log activity
  await supabase.from('activity_log').insert({
    project_id: matchingRequest.project_id,
    actor_id: matchingRequest.id,
    action: `request_${newStatus}_via_github`,
    entity_type: 'request',
    entity_id: matchingRequest.id,
    metadata: {
      github_issue_number: issueNumber,
      github_action: action,
      github_repo_owner: repoOwner,
      github_repo_name: repoName,
    },
  });

  await markProcessed(supabase, deliveryId);
}

// ---------------------------------------------------------------------------
// Issue comment sync: GitHub comment → request_comments row
// ---------------------------------------------------------------------------

async function handleIssueComment(
  supabase: ReturnType<typeof createAdminClient>,
  issueNumber: number,
  repoOwner: string | undefined,
  repoName: string | undefined,
  comment: Record<string, unknown>,
  deliveryId: string,
) {
  const githubCommentId = comment.id as number;

  // Deduplicate: skip if we already stored this GitHub comment
  const { data: existing } = await supabase
    .from('request_comments')
    .select('id')
    .eq('github_comment_id', githubCommentId)
    .maybeSingle();

  if (existing) {
    await markProcessed(supabase, deliveryId);
    return;
  }

  // Find the matching request, scoping by repo when available
  const { data: matchingRequest } = repoOwner && repoName
    ? await supabase
        .from('requests')
        .select('id, project_id, projects!inner(github_repo_owner, github_repo_name)')
        .eq('github_issue_number', issueNumber)
        .eq('projects.github_repo_owner', repoOwner)
        .eq('projects.github_repo_name', repoName)
        .maybeSingle()
    : await supabase
        .from('requests')
        .select('id, project_id')
        .eq('github_issue_number', issueNumber)
        .maybeSingle();

  if (!matchingRequest) {
    await markProcessed(supabase, deliveryId);
    return;
  }

  const authorLogin = (comment.user as Record<string, unknown>)?.login as string ?? 'github-bot';
  const authorUrl = (comment.user as Record<string, unknown>)?.html_url as string ?? '';
  const commentUrl = comment.html_url as string ?? '';
  const commentBody = comment.body as string ?? '';

  const { error: commentError } = await supabase.from('request_comments').insert({
    request_id: matchingRequest.id,
    author_id: null,
    body: commentBody,
    is_internal: false,
    source: 'github',
    github_comment_id: githubCommentId,
    metadata: {
      github_author: authorLogin,
      github_author_url: authorUrl,
      github_comment_url: commentUrl,
    },
  });

  if (commentError) {
    // Unique constraint violation means duplicate delivery; treat as already processed
    if (commentError.code === '23505') {
      await markProcessed(supabase, deliveryId);
      return;
    }
    console.error('Error al guardar comentario de GitHub:', commentError);
    await markProcessedWithError(supabase, deliveryId, commentError.message);
    return;
  }

  await markProcessed(supabase, deliveryId);
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function markProcessed(
  supabase: ReturnType<typeof createAdminClient>,
  deliveryId: string,
) {
  await supabase
    .from('webhook_events')
    .update({ processed: true, processed_at: new Date().toISOString() })
    .eq('github_delivery_id', deliveryId);
}

async function markProcessedWithError(
  supabase: ReturnType<typeof createAdminClient>,
  deliveryId: string,
  errorMessage: string,
) {
  await supabase
    .from('webhook_events')
    .update({
      processed: true,
      processed_at: new Date().toISOString(),
      error: errorMessage,
    })
    .eq('github_delivery_id', deliveryId);
}
