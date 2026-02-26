/**
 * PriorityBadge — pill badge for request priority levels.
 *
 * Usage:
 *   <PriorityBadge priority="high" />
 *   <PriorityBadge priority="critical" />
 */

interface PriorityBadgeProps {
  priority: 'low' | 'medium' | 'high' | 'critical';
}

const PRIORITY_CONFIG: Record<
  PriorityBadgeProps['priority'],
  { label: string; classes: string; dotClasses: string }
> = {
  low: {
    label: 'Baja',
    classes:
      'bg-white/5 text-text-secondary border border-white/10',
    dotClasses: 'bg-text-muted',
  },
  medium: {
    label: 'Media',
    classes:
      'bg-sky/10 text-sky border border-sky/20',
    dotClasses: 'bg-sky',
  },
  high: {
    label: 'Alta',
    classes:
      'bg-orange-500/10 text-orange-400 border border-orange-500/20',
    dotClasses: 'bg-orange-400',
  },
  critical: {
    label: 'Crítica',
    classes:
      'bg-coral/10 text-coral border border-coral/20',
    dotClasses: 'bg-coral',
  },
};

export default function PriorityBadge({ priority }: PriorityBadgeProps) {
  const config = PRIORITY_CONFIG[priority];

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
