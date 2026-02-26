'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

interface AddCommentFormProps {
  requestId: string;
}

export default function AddCommentForm({ requestId }: AddCommentFormProps) {
  const [body, setBody] = useState('');
  const [isInternal, setIsInternal] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) return;
    setError(null);

    startTransition(async () => {
      const res = await fetch(`/api/requests/${requestId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: body.trim(), is_internal: isInternal }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? 'Error al enviar el comentario');
        return;
      }

      setBody('');
      setIsInternal(false);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      {error && (
        <p className="text-xs text-coral">{error}</p>
      )}
      <textarea
        rows={3}
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="Escribe un comentario..."
        aria-label="Cuerpo del comentario"
        className="w-full px-3 py-2 rounded-lg bg-background border border-white/10 text-text-primary placeholder-text-muted text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors resize-none"
      />
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={isInternal}
            onChange={(e) => setIsInternal(e.target.checked)}
            className="rounded border-white/20 bg-background text-primary focus:ring-primary/30"
          />
          <span className="text-xs text-text-secondary">Nota interna (solo admins)</span>
        </label>
        <button
          type="submit"
          disabled={isPending || !body.trim()}
          className="px-4 py-1.5 rounded-lg bg-primary text-background text-xs font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isPending ? 'Enviando...' : 'Comentar'}
        </button>
      </div>
    </form>
  );
}
