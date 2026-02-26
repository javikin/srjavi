interface ProjectStatusBadgeProps {
  status: 'active' | 'paused' | 'completed' | 'archived';
}

const STATUS_CONFIG: Record<
  ProjectStatusBadgeProps['status'],
  { label: string; classes: string; dotClasses: string }
> = {
  active: {
    label: 'Activo',
    classes: 'bg-mint/10 text-mint border border-mint/20',
    dotClasses: 'bg-mint',
  },
  paused: {
    label: 'Pausado',
    classes: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    dotClasses: 'bg-amber-400',
  },
  completed: {
    label: 'Completado',
    classes: 'bg-sky/10 text-sky border border-sky/20',
    dotClasses: 'bg-sky',
  },
  archived: {
    label: 'Archivado',
    classes: 'bg-white/5 text-text-muted border border-white/10',
    dotClasses: 'bg-text-muted',
  },
};

export default function ProjectStatusBadge({ status }: ProjectStatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.active;

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
