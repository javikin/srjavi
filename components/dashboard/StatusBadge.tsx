/**
 * StatusBadge — pill badge for request statuses.
 *
 * Usage:
 *   <StatusBadge status="pending" />
 *   <StatusBadge status="completed" />
 */

interface StatusBadgeProps {
  status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'rejected';
}

const STATUS_CONFIG: Record<
  StatusBadgeProps['status'],
  { label: string; classes: string; dotClasses: string }
> = {
  pending: {
    label: 'Pendiente',
    classes: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    dotClasses: 'bg-amber-400',
  },
  approved: {
    label: 'Aprobado',
    classes: 'bg-sky/10 text-sky border border-sky/20',
    dotClasses: 'bg-sky',
  },
  in_progress: {
    label: 'En progreso',
    classes: 'bg-lavender/10 text-lavender border border-lavender/20',
    dotClasses: 'bg-lavender animate-pulse',
  },
  completed: {
    label: 'Completado',
    classes: 'bg-mint/10 text-mint border border-mint/20',
    dotClasses: 'bg-mint',
  },
  rejected: {
    label: 'Rechazado',
    classes: 'bg-coral/10 text-coral border border-coral/20',
    dotClasses: 'bg-coral',
  },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium ${config.classes}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${config.dotClasses}`}
        aria-hidden="true"
      />
      {config.label}
    </span>
  );
}
