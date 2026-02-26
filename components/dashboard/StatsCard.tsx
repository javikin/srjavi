/**
 * StatsCard — metric card for dashboard overview grids.
 *
 * Usage:
 *   <StatsCard
 *     label="Solicitudes activas"
 *     value={12}
 *     subtitle="Este mes"
 *     trend={{ value: 8, isPositive: true }}
 *     icon={<InboxIcon />}
 *   />
 */

interface StatsCardProps {
  label: string;
  value: string | number;
  subtitle?: string;
  trend?: { value: number; isPositive: boolean };
  icon?: React.ReactNode;
}

export default function StatsCard({
  label,
  value,
  subtitle,
  trend,
  icon,
}: StatsCardProps) {
  return (
    <div className="bg-surface border border-white/5 rounded-xl p-5 flex flex-col gap-3">
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-text-secondary">{label}</p>
        {icon && (
          <span className="text-text-muted shrink-0" aria-hidden="true">
            {icon}
          </span>
        )}
      </div>

      {/* Value */}
      <p className="text-3xl font-semibold text-text-primary leading-none">
        {value}
      </p>

      {/* Footer row */}
      {(subtitle || trend) && (
        <div className="flex items-center gap-2 mt-auto">
          {trend && (
            <span
              className={`inline-flex items-center gap-0.5 text-xs font-medium ${
                trend.isPositive ? 'text-mint' : 'text-coral'
              }`}
            >
              {trend.isPositive ? (
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 15l7-7 7 7"
                  />
                </svg>
              ) : (
                <svg
                  className="w-3 h-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              )}
              {trend.value}%
            </span>
          )}
          {subtitle && (
            <span className="text-xs text-text-muted">{subtitle}</span>
          )}
        </div>
      )}
    </div>
  );
}
