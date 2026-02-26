/**
 * CreditBar — token/credit usage progress bar with gradient fill.
 *
 * Bar gradient:
 *   - green (mint → sky)         → < 50% used
 *   - yellow (amber → orange)    → 50–80% used
 *   - red (coral → red-500)      → > 80% used
 *
 * Usage:
 *   <CreditBar used={30} quota={100} showLabel size="md" />
 *   <CreditBar used={75} quota={100} size="sm" />
 */

interface CreditBarProps {
  used: number;
  quota: number;
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE_CLASSES: Record<NonNullable<CreditBarProps['size']>, string> = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
};

// CSS gradient strings (used via inline style so Tailwind purge won't strip dynamic values)
function getBarGradient(pct: number): string {
  if (pct > 80) return 'linear-gradient(90deg, #F39A8E 0%, #ef4444 100%)'; // coral → red
  if (pct > 50) return 'linear-gradient(90deg, #fbbf24 0%, #f97316 100%)'; // amber → orange
  return 'linear-gradient(90deg, #8AD8C0 0%, #85CBDA 100%)';               // mint → sky
}

function getLabelColor(pct: number): string {
  if (pct > 80) return 'text-coral';
  if (pct > 50) return 'text-amber-400';
  return 'text-mint';
}

export default function CreditBar({
  used,
  quota,
  showLabel = true,
  size = 'md',
}: CreditBarProps) {
  const safeQuota = quota === 0 ? 1 : quota;
  const pct = Math.min(100, Math.round((used / safeQuota) * 100));
  const gradient = getBarGradient(pct);
  const labelColor = getLabelColor(pct);

  return (
    <div className="w-full space-y-1.5">
      {showLabel && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-secondary">Uso de créditos</span>
          <span className={`font-medium tabular-nums ${labelColor}`}>
            {used.toLocaleString('es')} / {quota.toLocaleString('es')} créditos
          </span>
        </div>
      )}

      {/* Track */}
      <div
        className={`w-full bg-white/5 rounded-full overflow-hidden ${SIZE_CLASSES[size]}`}
        role="progressbar"
        aria-valuenow={used}
        aria-valuemin={0}
        aria-valuemax={quota}
        aria-label={`${used} de ${quota} créditos usados`}
      >
        {/* Gradient fill */}
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%`, background: gradient }}
        />
      </div>
    </div>
  );
}
