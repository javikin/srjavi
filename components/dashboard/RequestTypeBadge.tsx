/**
 * RequestTypeBadge — indicates the type of a request.
 *
 * Usage:
 *   <RequestTypeBadge type="bug" />
 *   <RequestTypeBadge type="feature" />
 *   <RequestTypeBadge type="improvement" />
 */

interface RequestTypeBadgeProps {
  type: 'bug' | 'feature' | 'improvement';
}

const REQUEST_TYPE_CONFIG: Record<
  RequestTypeBadgeProps['type'],
  { label: string; classes: string }
> = {
  bug: {
    label: 'Bug',
    classes: 'bg-coral/10 text-coral border border-coral/20',
  },
  feature: {
    label: 'Feature',
    classes: 'bg-lavender/10 text-lavender border border-lavender/20',
  },
  improvement: {
    label: 'Mejora',
    classes: 'bg-sky/10 text-sky border border-sky/20',
  },
};

export default function RequestTypeBadge({ type }: RequestTypeBadgeProps) {
  const config = REQUEST_TYPE_CONFIG[type];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.classes}`}
    >
      {config.label}
    </span>
  );
}
