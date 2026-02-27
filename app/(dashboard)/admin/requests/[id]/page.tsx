import { notFound } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import StatusBadge from '@/components/dashboard/StatusBadge';
import RequestTypeBadge from '@/components/dashboard/RequestTypeBadge';
import PriorityBadge from '@/components/dashboard/PriorityBadge';
import RequestActions from './RequestActions';
import AddCommentForm from './AddCommentForm';

type ReqType = 'bug' | 'feature' | 'improvement';
type Priority = 'low' | 'medium' | 'high' | 'critical';

type ProjectRow = {
  id: string;
  name: string;
  slug: string;
  github_repo_owner: string | null;
  github_repo_name: string | null;
};

type ProfileRow = {
  id: string;
  full_name: string;
  email: string;
  company: string | null;
};

type CommentProfileRow = {
  full_name: string;
};

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: request } = await supabase
    .from('requests')
    .select(`
      *,
      projects(id, name, slug, github_repo_owner, github_repo_name),
      profiles!requests_submitted_by_fkey(id, full_name, email, company)
    `)
    .eq('id', id)
    .single();

  if (!request) notFound();

  // Fetch credit allocation for the project
  const projectId = request.project_id;
  const { data: creditAlloc } = await supabase
    .from('credit_allocations')
    .select('quota, used, period_start')
    .eq('project_id', projectId)
    .order('period_start', { ascending: false })
    .limit(1)
    .single();

  const [{ data: comments }, { data: attachments }] = await Promise.all([
    supabase
      .from('request_comments')
      .select('id, body, is_internal, created_at, source, metadata, profiles!request_comments_author_id_fkey(full_name)')
      .eq('request_id', id)
      .order('created_at', { ascending: true }),
    supabase
      .from('request_attachments')
      .select('id, file_name, file_url, file_size, mime_type, created_at')
      .eq('request_id', id)
      .order('created_at', { ascending: true }),
  ]);

  const rawProject = request.projects as ProjectRow | ProjectRow[] | null;
  const project = Array.isArray(rawProject) ? (rawProject[0] ?? null) : rawProject;

  const rawSubmitter = request.profiles as ProfileRow | ProfileRow[] | null;
  const submitter = Array.isArray(rawSubmitter) ? (rawSubmitter[0] ?? null) : rawSubmitter;

  function formatFileSize(bytes: number) {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  }

  return (
    <div>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-text-muted mb-6">
        <Link href="/admin/requests" className="hover:text-text-secondary transition-colors">
          Solicitudes
        </Link>
        <span>/</span>
        <span className="text-text-primary truncate max-w-xs">{request.title}</span>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="xl:col-span-2 space-y-6">
          {/* Request info */}
          <div className="rounded-xl bg-surface border border-white/5 p-6">
            <h1 className="text-xl font-semibold text-text-primary leading-tight mb-3">
              {request.title}
            </h1>
            <div className="flex items-center gap-2 mb-4 flex-wrap">
              <RequestTypeBadge type={request.type as ReqType} />
              <StatusBadge status={request.status as 'pending' | 'approved' | 'in_progress' | 'completed' | 'rejected'} />
              <PriorityBadge
                priority={((request.admin_priority ?? request.priority_preference) as Priority)}
              />
              {request.credit_cost > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                  {request.credit_cost} creditos
                </span>
              )}
            </div>

            <p className="text-text-secondary text-sm whitespace-pre-wrap leading-relaxed">
              {request.description}
            </p>

            {request.rejection_reason && (
              <div className="mt-4 p-3 rounded-lg bg-coral/10 border border-coral/20">
                <p className="text-xs font-semibold text-coral uppercase tracking-wider mb-1">
                  Motivo de rechazo
                </p>
                <p className="text-sm text-text-secondary">{request.rejection_reason}</p>
              </div>
            )}

            {request.github_issue_url && (
              <div className="mt-4 pt-4 border-t border-white/5">
                <a
                  href={request.github_issue_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                  Ver issue #{request.github_issue_number} en GitHub
                </a>
              </div>
            )}
          </div>

          {/* Admin actions (only shows if issue wasn't auto-created) */}
          <RequestActions
            requestId={request.id}
            hasGithubIssue={!!request.github_issue_number}
            hasGithubRepo={!!(project?.github_repo_owner && project?.github_repo_name)}
          />

          {/* Comments */}
          <div className="rounded-xl bg-surface border border-white/5 p-6">
            <h2 className="text-base font-semibold text-text-primary mb-4">
              Comentarios ({comments?.length ?? 0})
            </h2>

            {comments && comments.length > 0 ? (
              <ul className="space-y-4 mb-6">
                {comments.map((comment) => {
                  const rawAuthor = comment.profiles as CommentProfileRow | CommentProfileRow[] | null;
                  const author = Array.isArray(rawAuthor) ? (rawAuthor[0] ?? null) : rawAuthor;
                  const isGithub = comment.source === 'github';
                  const meta = (comment.metadata ?? {}) as Record<string, unknown>;
                  const authorName = isGithub
                    ? (meta.author_login as string) ?? 'GitHub'
                    : author?.full_name ?? 'Usuario';
                  return (
                    <li
                      key={comment.id}
                      className={`rounded-lg p-4 ${
                        comment.is_internal
                          ? 'bg-amber-500/5 border border-amber-500/20'
                          : isGithub
                          ? 'bg-white/[0.02] border border-white/5'
                          : 'bg-white/[0.03] border border-white/5'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          {isGithub && (
                            <svg className="w-3.5 h-3.5 text-text-muted flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                            </svg>
                          )}
                          <span className="text-sm font-medium text-text-primary">
                            {authorName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          {comment.is_internal && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                              Nota interna
                            </span>
                          )}
                          {isGithub && (
                            <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-text-muted border border-white/10">
                              GitHub
                            </span>
                          )}
                          <time className="text-xs text-text-muted">
                            {new Date(comment.created_at).toLocaleDateString('es-MX', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </time>
                        </div>
                      </div>
                      <p className="text-sm text-text-secondary whitespace-pre-wrap leading-relaxed">
                        {comment.body}
                      </p>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-text-muted mb-4">Sin comentarios todavia.</p>
            )}

            <AddCommentForm requestId={request.id} />
          </div>

          {/* Attachments */}
          {attachments && attachments.length > 0 && (
            <div className="rounded-xl bg-surface border border-white/5 p-6">
              <h2 className="text-base font-semibold text-text-primary mb-4">
                Archivos adjuntos ({attachments.length})
              </h2>
              <ul className="space-y-2">
                {attachments.map((att) => (
                  <li key={att.id}>
                    <a
                      href={att.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/5 hover:border-primary/20 transition-colors group"
                    >
                      <svg
                        className="w-5 h-5 text-text-muted group-hover:text-primary transition-colors flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text-primary truncate">
                          {att.file_name}
                        </p>
                        <p className="text-xs text-text-muted">
                          {formatFileSize(att.file_size)} &middot; {att.mime_type}
                        </p>
                      </div>
                      <svg
                        className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Submitter info */}
          <div className="rounded-xl bg-surface border border-white/5 p-5">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-4">
              Enviado por
            </h3>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-semibold flex-shrink-0">
                {submitter?.full_name?.[0]?.toUpperCase() ?? '?'}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-text-primary truncate">
                  {submitter?.full_name ?? 'Sin nombre'}
                </p>
                <p className="text-xs text-text-muted truncate">{submitter?.email ?? '—'}</p>
              </div>
            </div>
            {submitter?.company && (
              <p className="text-xs text-text-secondary">
                <span className="text-text-muted">Empresa: </span>
                {submitter.company}
              </p>
            )}
          </div>

          {/* Project info */}
          <div className="rounded-xl bg-surface border border-white/5 p-5">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
              Proyecto
            </h3>
            {project ? (
              <Link
                href={`/admin/projects/${project.id}`}
                className="text-sm font-medium text-primary hover:underline"
              >
                {project.name}
              </Link>
            ) : (
              <p className="text-sm text-text-muted">Sin proyecto</p>
            )}
          </div>

          {/* Credits remaining */}
          <div className="rounded-xl bg-surface border border-white/5 p-5">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
              Creditos del proyecto
            </h3>
            {creditAlloc ? (
              <div>
                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-2xl font-bold text-text-primary">
                    {creditAlloc.quota - creditAlloc.used}
                  </span>
                  <span className="text-sm text-text-muted">
                    / {creditAlloc.quota} disponibles
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      ((creditAlloc.used / creditAlloc.quota) * 100) > 80
                        ? 'bg-coral'
                        : ((creditAlloc.used / creditAlloc.quota) * 100) > 50
                        ? 'bg-amber-400'
                        : 'bg-mint'
                    }`}
                    style={{ width: `${Math.min((creditAlloc.used / creditAlloc.quota) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-text-muted mt-1.5">
                  {creditAlloc.used} usados este periodo
                </p>
              </div>
            ) : (
              <p className="text-sm text-text-muted">Sin periodo activo</p>
            )}
          </div>

          {/* GitHub integration */}
          <div className="rounded-xl bg-surface border border-white/5 p-5">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">
              GitHub
            </h3>
            {project?.github_repo_owner && project?.github_repo_name ? (
              <div className="space-y-2">
                <a
                  href={`https://github.com/${project.github_repo_owner}/${project.github_repo_name}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors"
                >
                  <svg className="w-4 h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                  </svg>
                  <span className="truncate">
                    {project.github_repo_owner}/{project.github_repo_name}
                  </span>
                  <svg className="w-3 h-3 flex-shrink-0 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-mint" />
                  <span className="text-xs text-mint">Vinculado</span>
                </div>
                {request.github_issue_url && (
                  <a
                    href={request.github_issue_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 mt-1 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/5 text-sm text-text-secondary hover:border-primary/20 hover:text-primary transition-colors"
                  >
                    <span>Issue #{request.github_issue_number}</span>
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-text-muted" />
                  <span className="text-xs text-text-muted">No vinculado</span>
                </div>
                <p className="text-xs text-text-muted">
                  Configura el repo en{' '}
                  {project ? (
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="text-primary hover:underline"
                    >
                      ajustes del proyecto
                    </Link>
                  ) : (
                    'ajustes del proyecto'
                  )}
                </p>
              </div>
            )}
          </div>

          {/* Dates */}
          <div className="rounded-xl bg-surface border border-white/5 p-5 space-y-3">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Fechas
            </h3>
            <div>
              <p className="text-xs text-text-muted">Creacion</p>
              <p className="text-sm text-text-secondary mt-0.5">
                {new Date(request.created_at).toLocaleDateString('es-MX', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div>
              <p className="text-xs text-text-muted">Ultima actualizacion</p>
              <p className="text-sm text-text-secondary mt-0.5">
                {new Date(request.updated_at).toLocaleDateString('es-MX', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            {request.completed_at && (
              <div>
                <p className="text-xs text-text-muted">Completada</p>
                <p className="text-sm text-mint mt-0.5">
                  {new Date(request.completed_at).toLocaleDateString('es-MX', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            )}
          </div>

          {/* Priority detail */}
          <div className="rounded-xl bg-surface border border-white/5 p-5 space-y-3">
            <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider">
              Prioridad
            </h3>
            <div>
              <p className="text-xs text-text-muted mb-1.5">Preferencia del cliente</p>
              <PriorityBadge priority={request.priority_preference as Priority} />
            </div>
            {request.admin_priority && (
              <div>
                <p className="text-xs text-text-muted mb-1.5">Prioridad del admin</p>
                <PriorityBadge priority={request.admin_priority as Priority} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
