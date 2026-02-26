'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';

type Status = 'pending' | 'approved' | 'in_progress' | 'completed' | 'rejected';

interface RequestActionsProps {
  requestId: string;
  currentStatus: Status;
  projectGithubOwner: string | null;
  projectGithubRepo: string | null;
  requestTitle: string;
  requestBody: string;
}

export default function RequestActions({
  requestId,
  currentStatus,
  projectGithubOwner,
  projectGithubRepo,
  requestTitle,
  requestBody,
}: RequestActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Approve state
  const [showApproveForm, setShowApproveForm] = useState(false);
  const [creditCost, setCreditCost] = useState(1);

  // Reject state
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const hasGithub = !!(projectGithubOwner && projectGithubRepo);

  function clearMessages() {
    setError(null);
    setSuccess(null);
  }

  async function patchRequest(payload: Record<string, unknown>, successMsg: string) {
    clearMessages();
    startTransition(async () => {
      const res = await fetch(`/api/requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? 'Error al actualizar la solicitud');
        return;
      }

      setSuccess(successMsg);
      router.refresh();
    });
  }

  async function handleApprove(e: React.FormEvent) {
    e.preventDefault();
    await patchRequest(
      { status: 'approved', credit_cost: creditCost },
      'Solicitud aprobada correctamente'
    );
    setShowApproveForm(false);
  }

  async function handleReject(e: React.FormEvent) {
    e.preventDefault();
    if (!rejectionReason.trim()) {
      setError('Debes indicar el motivo del rechazo');
      return;
    }
    await patchRequest(
      { status: 'rejected', rejection_reason: rejectionReason.trim() },
      'Solicitud rechazada'
    );
    setShowRejectForm(false);
    setRejectionReason('');
  }

  async function handleMarkInProgress() {
    await patchRequest({ status: 'in_progress' }, 'Estado actualizado a "En progreso"');
  }

  async function handleMarkCompleted() {
    await patchRequest(
      { status: 'completed', completed_at: new Date().toISOString() },
      'Solicitud marcada como completada'
    );
  }

  async function handleCreateGithubIssue() {
    clearMessages();
    startTransition(async () => {
      const res = await fetch('/api/github/create-issue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? 'Error al crear el issue en GitHub');
        return;
      }

      setSuccess('Issue creado en GitHub correctamente');
      router.refresh();
    });
  }

  return (
    <div className="rounded-xl bg-surface border border-white/5 p-6">
      <h2 className="text-base font-semibold text-text-primary mb-4">Acciones</h2>

      {error && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-coral/10 border border-coral/20 text-sm text-coral">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 px-4 py-3 rounded-lg bg-mint/10 border border-mint/20 text-sm text-mint">
          {success}
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {/* Approve */}
        {(currentStatus === 'pending') && (
          <button
            onClick={() => { clearMessages(); setShowApproveForm((v) => !v); setShowRejectForm(false); }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-mint/10 text-mint border border-mint/20 text-sm hover:bg-mint/20 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
            Aprobar
          </button>
        )}

        {/* Reject */}
        {(currentStatus === 'pending' || currentStatus === 'approved') && (
          <button
            onClick={() => { clearMessages(); setShowRejectForm((v) => !v); setShowApproveForm(false); }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-coral/10 text-coral border border-coral/20 text-sm hover:bg-coral/20 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
            Rechazar
          </button>
        )}

        {/* Mark in progress */}
        {(currentStatus === 'approved') && (
          <button
            onClick={handleMarkInProgress}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-lavender/10 text-lavender border border-lavender/20 text-sm hover:bg-lavender/20 disabled:opacity-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            En progreso
          </button>
        )}

        {/* Mark completed */}
        {(currentStatus === 'in_progress' || currentStatus === 'approved') && (
          <button
            onClick={handleMarkCompleted}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky/10 text-sky border border-sky/20 text-sm hover:bg-sky/20 disabled:opacity-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Marcar completado
          </button>
        )}

        {/* Create GitHub issue */}
        {hasGithub && (
          <button
            onClick={handleCreateGithubIssue}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 text-text-secondary border border-white/10 text-sm hover:bg-white/10 disabled:opacity-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
            </svg>
            Crear issue en GitHub
          </button>
        )}
      </div>

      {/* Approve form */}
      {showApproveForm && (
        <form onSubmit={handleApprove} className="mt-4 p-4 rounded-lg bg-white/[0.03] border border-white/5 space-y-3">
          <p className="text-sm font-medium text-text-primary">Aprobar solicitud</p>
          <div className="space-y-1.5">
            <label htmlFor="credit_cost" className="text-xs text-text-secondary">
              Costo en creditos
            </label>
            <input
              id="credit_cost"
              type="number"
              min={0}
              value={creditCost}
              onChange={(e) => setCreditCost(Number(e.target.value))}
              className="w-32 px-3 py-1.5 rounded-lg bg-background border border-white/10 text-text-primary text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-1.5 rounded-lg bg-mint text-background text-xs font-medium hover:bg-mint/90 disabled:opacity-50 transition-colors"
            >
              {isPending ? 'Aprobando...' : 'Confirmar aprobacion'}
            </button>
            <button
              type="button"
              onClick={() => setShowApproveForm(false)}
              className="px-4 py-1.5 rounded-lg border border-white/10 text-text-secondary text-xs hover:bg-white/5 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      {/* Reject form */}
      {showRejectForm && (
        <form onSubmit={handleReject} className="mt-4 p-4 rounded-lg bg-white/[0.03] border border-white/5 space-y-3">
          <p className="text-sm font-medium text-text-primary">Rechazar solicitud</p>
          <div className="space-y-1.5">
            <label htmlFor="rejection_reason" className="text-xs text-text-secondary">
              Motivo del rechazo <span className="text-coral">*</span>
            </label>
            <textarea
              id="rejection_reason"
              rows={3}
              required
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Explica por que se rechaza esta solicitud..."
              className="w-full px-3 py-2 rounded-lg bg-background border border-white/10 text-text-primary placeholder-text-muted text-sm focus:outline-none focus:border-coral/50 focus:ring-1 focus:ring-coral/20 transition-colors resize-none"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-1.5 rounded-lg bg-coral text-background text-xs font-medium hover:bg-coral/90 disabled:opacity-50 transition-colors"
            >
              {isPending ? 'Rechazando...' : 'Confirmar rechazo'}
            </button>
            <button
              type="button"
              onClick={() => setShowRejectForm(false)}
              className="px-4 py-1.5 rounded-lg border border-white/10 text-text-secondary text-xs hover:bg-white/5 transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
