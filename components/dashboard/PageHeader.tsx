/**
 * PageHeader — consistent top header for all dashboard pages.
 *
 * Usage:
 *   <PageHeader
 *     title="Mis solicitudes"
 *     description="Gestiona y revisa el estado de tus solicitudes."
 *     action={
 *       <Link href="/requests/new" className="...">
 *         Nueva solicitud
 *       </Link>
 *     }
 *   />
 */

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export default function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-8">
      {/* Title block */}
      <div>
        <h1 className="text-2xl font-semibold text-text-primary leading-tight">
          {title}
        </h1>
        {description && (
          <p className="mt-1 text-sm text-text-secondary">{description}</p>
        )}
      </div>

      {/* Optional action slot */}
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
}
