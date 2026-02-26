/**
 * ActivityItem — single row in an activity/audit feed.
 *
 * Usage:
 *   <ActivityItem
 *     action="created"
 *     entityType="request"
 *     actorName="Javi"
 *     projectName="Mi proyecto"
 *     createdAt="2026-02-25T10:30:00Z"
 *   />
 */

interface ActivityItemProps {
  action: string;
  entityType: string;
  actorName: string;
  projectName?: string;
  createdAt: string;
}

// ─── Relative time helper (Spanish) ───────────────────────────────────────────

function relativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);

  if (diffSeconds < 60) return 'hace un momento';
  if (diffSeconds < 3600) {
    const mins = Math.floor(diffSeconds / 60);
    return `hace ${mins} ${mins === 1 ? 'min' : 'min'}`;
  }
  if (diffSeconds < 86400) {
    const hours = Math.floor(diffSeconds / 3600);
    return `hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  }
  if (diffSeconds < 172800) return 'ayer';
  const days = Math.floor(diffSeconds / 86400);
  if (days < 30) return `hace ${days} días`;
  const months = Math.floor(days / 30);
  if (months < 12) return `hace ${months} ${months === 1 ? 'mes' : 'meses'}`;
  const years = Math.floor(months / 12);
  return `hace ${years} ${years === 1 ? 'año' : 'años'}`;
}

// ─── Action → icon mapping ────────────────────────────────────────────────────

function ActionIcon({ action }: { action: string }) {
  const lower = action.toLowerCase();

  if (lower.includes('creat') || lower.includes('new') || lower.includes('add') || lower.includes('nuev')) {
    // Plus / created
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
      </svg>
    );
  }

  if (lower.includes('updat') || lower.includes('edit') || lower.includes('actua')) {
    // Pencil / updated
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
      </svg>
    );
  }

  if (lower.includes('delet') || lower.includes('remov') || lower.includes('elimin')) {
    // Trash / deleted
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </svg>
    );
  }

  if (lower.includes('approv') || lower.includes('apro')) {
    // Checkmark / approved
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
      </svg>
    );
  }

  if (lower.includes('reject') || lower.includes('rechaz')) {
    // X / rejected
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
      </svg>
    );
  }

  if (lower.includes('comment') || lower.includes('coment')) {
    // Chat bubble / commented
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    );
  }

  // Default: activity dot
  return (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  );
}

// ─── Human-readable action label ─────────────────────────────────────────────

function actionLabel(action: string, entityType: string): string {
  const lower = action.toLowerCase();
  const entity = entityType.toLowerCase();

  if (lower.includes('creat') || lower.includes('add') || lower.includes('nuev')) return `creó ${entity}`;
  if (lower.includes('updat') || lower.includes('edit') || lower.includes('actua')) return `actualizó ${entity}`;
  if (lower.includes('delet') || lower.includes('remov') || lower.includes('elimin')) return `eliminó ${entity}`;
  if (lower.includes('approv') || lower.includes('apro')) return `aprobó ${entity}`;
  if (lower.includes('reject') || lower.includes('rechaz')) return `rechazó ${entity}`;
  if (lower.includes('comment') || lower.includes('coment')) return `comentó en ${entity}`;

  return `${action} ${entity}`;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function ActivityItem({
  action,
  entityType,
  actorName,
  projectName,
  createdAt,
}: ActivityItemProps) {
  return (
    <div className="flex items-start gap-3 py-3">
      {/* Icon bubble */}
      <div
        className="flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-full bg-white/5 text-text-muted mt-0.5"
        aria-hidden="true"
      >
        <ActionIcon action={action} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm text-text-secondary leading-snug">
          <span className="font-medium text-text-primary">{actorName}</span>{' '}
          {actionLabel(action, entityType)}
          {projectName && (
            <>
              {' '}
              en{' '}
              <span className="font-medium text-text-primary">{projectName}</span>
            </>
          )}
        </p>
        <time
          dateTime={createdAt}
          className="text-xs text-text-muted mt-0.5 block"
          suppressHydrationWarning
        >
          {relativeTime(createdAt)}
        </time>
      </div>
    </div>
  );
}
