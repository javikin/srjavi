import { redirect, notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import StatusBadge from '@/components/dashboard/StatusBadge';
import RequestTypeBadge from '@/components/dashboard/RequestTypeBadge';
import PriorityBadge from '@/components/dashboard/PriorityBadge';
import CommentsSection from './CommentsSection';

const STATUS_STEPS = [
  { key: 'pending', label: 'Enviada' },
  { key: 'in_progress', label: 'En progreso' },
  { key: 'completed', label: 'Completado' },
] as const;

function StatusTimeline({ status: rawStatus }: { status: string }) {
  // Map legacy statuses to GitHub-first flow
  const status = rawStatus === 'approved' ? 'in_progress' : rawStatus;

  if (status === 'rejected') {
    return (
      <div className="flex items-center gap-2 py-4">
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-coral/10 border border-coral/20">
          <svg className="w-4 h-4 text-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <span className="text-sm font-medium text-coral">Solicitud rechazada</span>
      </div>
    );
  }

  const currentIndex = STATUS_STEPS.findIndex((s) => s.key === status);

  return (
    <div className="flex items-center gap-0">
      {STATUS_STEPS.map((step, idx) => {
        const isDone = idx < currentIndex;
        const isActive = idx === currentIndex;
        const isUpcoming = idx > currentIndex;

        return (
          <div key={step.key} className="flex items-center">
            {/* Step node */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                  isDone
                    ? 'bg-primary border-primary'
                    : isActive
                    ? 'bg-primary/10 border-primary'
                    : 'bg-white/5 border-white/10'
                }`}
              >
                {isDone ? (
                  <svg className="w-4 h-4 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <div
                    className={`w-2 h-2 rounded-full ${
                      isActive ? 'bg-primary' : 'bg-white/20'
                    }`}
                  />
                )}
              </div>
              <span
                className={`text-xs font-medium whitespace-nowrap ${
                  isDone || isActive ? 'text-text-primary' : 'text-text-muted'
                }`}
              >
                {step.label}
              </span>
            </div>

            {/* Connector line */}
            {idx < STATUS_STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mx-2 mb-5 min-w-[32px] ${
                  idx < currentIndex ? 'bg-primary' : 'bg-white/10'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default async function RequestDetailPage({
  params,
}: {
  params: Promise<{ slug: string; id: string }>;
}) {
  const { slug, id } = await params;
  const supabase = await createClient();

  // Fetch request with project info
  const { data: request, error } = await supabase
    .from('requests')
    .select(`
      id,
      title,
      type,
      status,
      priority_preference,
      admin_priority,
      description,
      credit_cost,
      rejection_reason,
      github_issue_number,
      github_issue_url,
      created_at,
      updated_at,
      completed_at,
      project_id,
      projects (id, slug, name, github_repo_owner, github_repo_name)
    `)
    .eq('id', id)
    .single();

  if (error || !request) {
    notFound();
  }

  // Verify the project slug matches
  const project = Array.isArray(request.projects)
    ? (request.projects[0] as { id: string; slug: string; name: string; github_repo_owner?: string | null; github_repo_name?: string | null } | undefined) ?? null
    : (request.projects as { id: string; slug: string; name: string; github_repo_owner?: string | null; github_repo_name?: string | null } | null);
  if (!project || project.slug !== slug) {
    notFound();
  }

  // Fetch non-internal comments (RLS handles this automatically)
  const { data: comments } = await supabase
    .from('request_comments')
    .select('id, body, created_at, author_id, profiles(full_name, avatar_url)')
    .eq('request_id', id)
    .order('created_at', { ascending: true });

  // Fetch attachments
  const { data: attachments } = await supabase
    .from('request_attachments')
    .select('id, file_name, file_url, file_size, mime_type, created_at')
    .eq('request_id', id)
    .order('created_at', { ascending: true });

  const priority = (request.admin_priority ?? request.priority_preference) as 'low' | 'medium' | 'high' | 'critical';

  function formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }

  return (
    <div className="max-w-3xl space-y-6">
      {/* Back link */}
      <a
        href={`/portal/${slug}/requests`}
        className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-text-secondary transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Volver a solicitudes
      </a>

      {/* Header */}
      <div className="rounded-xl bg-surface border border-white/5 p-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <RequestTypeBadge type={request.type as 'bug' | 'feature' | 'improvement'} />
          <StatusBadge status={request.status as 'pending' | 'approved' | 'in_progress' | 'completed' | 'rejected'} />
          <PriorityBadge priority={priority} />
        </div>
        <h1 className="text-xl font-semibold text-text-primary">{request.title}</h1>
        <p className="mt-1 text-xs text-text-muted">
          Enviada el{' '}
          {new Date(request.created_at).toLocaleDateString('es-MX', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
          })}
        </p>
      </div>

      {/* Status timeline */}
      <div className="rounded-xl bg-surface border border-white/5 p-6">
        <h2 className="text-sm font-semibold text-text-secondary mb-5">Progreso</h2>
        <StatusTimeline status={request.status} />
        {request.rejection_reason && (
          <div className="mt-4 p-3 rounded-lg bg-coral/5 border border-coral/20">
            <p className="text-xs font-medium text-coral mb-1">Motivo de rechazo</p>
            <p className="text-sm text-text-secondary">{request.rejection_reason}</p>
          </div>
        )}
      </div>

      {/* Description */}
      <div className="rounded-xl bg-surface border border-white/5 p-6">
        <h2 className="text-sm font-semibold text-text-secondary mb-3">Descripcion</h2>
        <p className="text-sm text-text-primary leading-relaxed whitespace-pre-wrap">
          {request.description}
        </p>
      </div>

      {/* Details: credit cost + GitHub */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Credit cost */}
        <div className="rounded-xl bg-surface border border-white/5 p-5">
          <p className="text-xs text-text-muted mb-1">Costo en creditos</p>
          {['approved', 'in_progress', 'completed'].includes(request.status) ? (
            <p className="text-2xl font-semibold text-primary tabular-nums">
              {request.credit_cost}{' '}
              <span className="text-sm font-normal text-text-muted">creditos</span>
            </p>
          ) : (
            <p className="text-sm text-text-secondary">Pendiente de revision</p>
          )}
        </div>

        {/* GitHub link */}
        <div className="rounded-xl bg-surface border border-white/5 p-5">
          <p className="text-xs text-text-muted mb-1">Issue en GitHub</p>
          {request.github_issue_url ? (
            <a
              href={request.github_issue_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-primary hover:underline"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
              </svg>
              #{request.github_issue_number} ver en GitHub
            </a>
          ) : (
            <p className="text-sm text-text-secondary">No vinculado aun</p>
          )}
        </div>
      </div>

      {/* Attachments */}
      {attachments && attachments.length > 0 && (
        <div className="rounded-xl bg-surface border border-white/5 p-6">
          <h2 className="text-sm font-semibold text-text-secondary mb-4">
            Archivos adjuntos ({attachments.length})
          </h2>
          <div className="space-y-2">
            {attachments.map((att) => (
              <a
                key={att.id}
                href={att.file_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.03] border border-white/5 transition-colors group"
              >
                <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                  <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text-primary truncate group-hover:text-primary transition-colors">
                    {att.file_name}
                  </p>
                  <p className="text-xs text-text-muted">{formatFileSize(att.file_size)}</p>
                </div>
                <svg className="w-4 h-4 text-text-muted shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Comments */}
      <CommentsSection
        requestId={id}
        initialComments={(comments ?? []).map((c) => {
          const rawProfiles = c.profiles;
          const profileObj = Array.isArray(rawProfiles)
            ? (rawProfiles[0] as { full_name: string; avatar_url?: string | null } | undefined) ?? null
            : (rawProfiles as { full_name: string; avatar_url?: string | null } | null);
          return {
            id: c.id,
            body: c.body,
            created_at: c.created_at,
            author_id: c.author_id,
            profiles: profileObj,
          };
        })}
      />
    </div>
  );
}
