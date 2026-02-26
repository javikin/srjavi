/**
 * EmptyState — centered placeholder for empty lists or sections.
 *
 * Usage:
 *   <EmptyState
 *     title="Sin solicitudes"
 *     description="Todavía no has creado ninguna solicitud."
 *     icon={<InboxIcon className="w-8 h-8" />}
 *     action={{ label: 'Nueva solicitud', href: '/requests/new' }}
 *   />
 */

import Link from 'next/link';

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  action?: { label: string; href: string };
}

export default function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon && (
        <div
          className="mb-4 flex items-center justify-center w-14 h-14 rounded-full bg-white/5 text-text-muted"
          aria-hidden="true"
        >
          {icon}
        </div>
      )}

      <h3 className="text-base font-semibold text-text-primary mb-1">
        {title}
      </h3>

      {description && (
        <p className="text-sm text-text-muted max-w-xs">{description}</p>
      )}

      {action && (
        <Link
          href={action.href}
          className="mt-6 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 text-primary border border-primary/20 text-sm font-medium hover:bg-primary/20 transition-colors"
        >
          {action.label}
        </Link>
      )}
    </div>
  );
}
