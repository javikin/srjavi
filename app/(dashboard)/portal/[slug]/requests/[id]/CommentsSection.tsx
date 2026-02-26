'use client';

import { useState } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';

interface Comment {
  id: string;
  body: string;
  created_at: string;
  author_id: string;
  profiles: { full_name: string; avatar_url?: string | null } | null;
}

interface CommentsSectionProps {
  requestId: string;
  initialComments: Comment[];
}

function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('es-MX', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function AvatarFallback({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();

  return (
    <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/20 flex items-center justify-center text-xs font-semibold text-primary shrink-0">
      {initials || '?'}
    </div>
  );
}

export default function CommentsSection({
  requestId,
  initialComments,
}: CommentsSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const body = newComment.trim();
    if (!body) return;

    setSubmitting(true);
    setError(null);

    const supabase = createBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      setError('Tu sesion expiro. Por favor inicia sesion nuevamente.');
      setSubmitting(false);
      return;
    }

    const { data, error: insertError } = await supabase
      .from('request_comments')
      .insert({
        request_id: requestId,
        author_id: user.id,
        body,
        is_internal: false,
      })
      .select('id, body, created_at, author_id, profiles(full_name, avatar_url)')
      .single();

    if (insertError || !data) {
      setError('No se pudo enviar el comentario. Intenta de nuevo.');
      setSubmitting(false);
      return;
    }

    const rawProfiles = data.profiles;
    const profileObj = Array.isArray(rawProfiles)
      ? (rawProfiles[0] as { full_name: string; avatar_url?: string | null } | undefined) ?? null
      : (rawProfiles as { full_name: string; avatar_url?: string | null } | null);

    setComments((prev) => [
      ...prev,
      {
        id: data.id,
        body: data.body,
        created_at: data.created_at,
        author_id: data.author_id,
        profiles: profileObj,
      },
    ]);
    setNewComment('');
    setSubmitting(false);
  }

  return (
    <div className="rounded-xl bg-surface border border-white/5 p-6">
      <h2 className="text-sm font-semibold text-text-secondary mb-5">
        Comentarios {comments.length > 0 && `(${comments.length})`}
      </h2>

      {/* Thread */}
      {comments.length === 0 ? (
        <p className="text-sm text-text-muted text-center py-6">
          Sin comentarios aun. Se el primero en comentar.
        </p>
      ) : (
        <div className="space-y-4 mb-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <AvatarFallback name={comment.profiles?.full_name ?? 'U'} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-text-primary">
                    {comment.profiles?.full_name ?? 'Usuario'}
                  </span>
                  <span className="text-xs text-text-muted">
                    {formatDateTime(comment.created_at)}
                  </span>
                </div>
                <p className="text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                  {comment.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add comment form */}
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label htmlFor="comment" className="sr-only">
            Agregar comentario
          </label>
          <textarea
            id="comment"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            rows={3}
            placeholder="Agrega un comentario o pregunta..."
            disabled={submitting}
            className="w-full px-3 py-2.5 rounded-lg bg-background border border-white/10 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors resize-none disabled:opacity-60"
          />
        </div>

        {error && (
          <p className="text-xs text-coral">{error}</p>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={submitting || !newComment.trim()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary border border-primary/20 text-sm font-medium hover:bg-primary/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                Enviando...
              </>
            ) : (
              'Comentar'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
