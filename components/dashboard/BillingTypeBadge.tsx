/**
 * BillingTypeBadge — indicates whether a project/request is paid or pro-bono.
 *
 * Usage:
 *   <BillingTypeBadge type="paid" />
 *   <BillingTypeBadge type="pro_bono" />
 */

interface BillingTypeBadgeProps {
  type: 'paid' | 'pro_bono';
}

const BILLING_CONFIG: Record<
  BillingTypeBadgeProps['type'],
  { label: string; classes: string }
> = {
  paid: {
    label: 'De paga',
    classes: 'bg-mint/10 text-mint border border-mint/20',
  },
  pro_bono: {
    label: 'Pro Bono',
    classes: 'bg-sky/10 text-sky border border-sky/20',
  },
};

export default function BillingTypeBadge({ type }: BillingTypeBadgeProps) {
  const config = BILLING_CONFIG[type];

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.classes}`}
    >
      {config.label}
    </span>
  );
}
