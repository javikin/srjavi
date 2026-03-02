import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { addAttachmentCommentToIssue } from '@/lib/github';

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const adminSupabase = createAdminClient();

    // Get request with project info
    const { data: req, error: reqError } = await adminSupabase
      .from('requests')
      .select('id, github_issue_number, project_id, projects(github_repo_owner, github_repo_name)')
      .eq('id', id)
      .single();

    if (reqError || !req || !req.github_issue_number) {
      return NextResponse.json({ ok: true }); // Nothing to sync
    }

    const rawProject = req.projects as { github_repo_owner: string | null; github_repo_name: string | null } | { github_repo_owner: string | null; github_repo_name: string | null }[] | null;
    const project = Array.isArray(rawProject) ? rawProject[0] : rawProject;

    if (!project?.github_repo_owner || !project?.github_repo_name) {
      return NextResponse.json({ ok: true });
    }

    // Get attachments for this request
    const { data: attachments } = await adminSupabase
      .from('request_attachments')
      .select('file_name, file_url, file_size, mime_type')
      .eq('request_id', id)
      .order('created_at', { ascending: true });

    if (!attachments || attachments.length === 0) {
      return NextResponse.json({ ok: true });
    }

    // Generate long-lived signed URLs (7 days)
    const attachmentsWithUrls = await Promise.all(
      attachments.map(async (att) => {
        const { data } = await adminSupabase.storage
          .from('request-attachments')
          .createSignedUrl(att.file_url, 60 * 60 * 24 * 7); // 7 days
        return {
          file_name: att.file_name,
          mime_type: att.mime_type ?? 'application/octet-stream',
          file_size: att.file_size,
          signedUrl: data?.signedUrl ?? '',
        };
      })
    );

    const validAttachments = attachmentsWithUrls.filter((a) => a.signedUrl !== '');

    if (validAttachments.length > 0) {
      await addAttachmentCommentToIssue(
        project.github_repo_owner,
        project.github_repo_name,
        req.github_issue_number,
        validAttachments,
      );
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('[github] Error syncing attachments to issue:', error);
    // Don't fail the user's request — this is a best-effort sync
    return NextResponse.json({ ok: true });
  }
}
