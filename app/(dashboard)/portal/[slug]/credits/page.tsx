import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import PageHeader from '@/components/dashboard/PageHeader';
import CreditBar from '@/components/dashboard/CreditBar';
import StatsCard from '@/components/dashboard/StatsCard';

const CREDIT_COST_REFERENCE = [
  { label: 'Bug simple', description: 'Error de pantalla, typo, ajuste visual', cost: 2 },
  { label: 'Bug complejo', description: 'Error de logica, fallo de datos', cost: 4 },
  { label: 'Feature pequena', description: 'Campo nuevo, ajuste de flujo', cost: 6 },
  { label: 'Feature mediana', description: 'Nueva pantalla o modulo', cost: 12 },
  { label: 'Feature grande', description: 'Integracion, sistema complejo', cost: 25 },
];

function formatMonth(dateStr: string): string {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('es-MX', {
    month: 'long',
    year: 'numeric',
  });
}

export default async function CreditsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  // Resolve project
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('id, name, monthly_credit_quota')
    .eq('slug', slug)
    .single();

  if (projectError || !project) {
    redirect('/');
  }

  // Get last 6 monthly allocations
  const { data: allocations } = await supabase
    .from('credit_allocations')
    .select('id, period_start, quota, used')
    .eq('project_id', project.id)
    .order('period_start', { ascending: false })
    .limit(6);

  const currentAllocation = allocations?.[0] ?? null;
  const currentUsed = currentAllocation?.used ?? 0;
  const currentQuota = currentAllocation?.quota ?? project.monthly_credit_quota;
  const currentAvailable = Math.max(0, currentQuota - currentUsed);

  // Get recent 20 credit transactions
  const { data: transactions } = await supabase
    .from('credit_transactions')
    .select('id, amount, balance_after, description, created_at, request_id')
    .eq('project_id', project.id)
    .order('created_at', { ascending: false })
    .limit(20);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Creditos"
        description="Revisa el uso de creditos de tu proyecto por periodo mensual."
      />

      {/* Current period bar */}
      <div className="rounded-xl bg-surface border border-white/5 p-6">
        <h2 className="text-sm font-semibold text-text-secondary mb-1">Periodo actual</h2>
        {currentAllocation && (
          <p className="text-xs text-text-muted mb-5 capitalize">
            {formatMonth(currentAllocation.period_start)}
          </p>
        )}
        <CreditBar used={currentUsed} quota={currentQuota} showLabel size="lg" />
        <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t border-white/5">
          <div>
            <p className="text-xs text-text-muted">Usados</p>
            <p className="text-xl font-semibold text-text-primary tabular-nums mt-0.5">
              {currentUsed}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-muted">Disponibles</p>
            <p className="text-xl font-semibold text-primary tabular-nums mt-0.5">
              {currentAvailable}
            </p>
          </div>
          <div>
            <p className="text-xs text-text-muted">Cuota mensual</p>
            <p className="text-xl font-semibold text-text-primary tabular-nums mt-0.5">
              {currentQuota}
            </p>
          </div>
        </div>
      </div>

      {/* Credit cost reference */}
      <div className="rounded-xl bg-surface border border-white/5 p-6">
        <h2 className="text-sm font-semibold text-text-secondary mb-4">
          Referencia de costos
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5">
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider pb-3 pr-4">
                  Tipo
                </th>
                <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider pb-3 pr-4">
                  Descripcion
                </th>
                <th className="text-right text-xs font-medium text-text-muted uppercase tracking-wider pb-3">
                  Creditos
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {CREDIT_COST_REFERENCE.map((item) => (
                <tr key={item.label}>
                  <td className="py-3 pr-4 font-medium text-text-primary">{item.label}</td>
                  <td className="py-3 pr-4 text-text-muted text-xs">{item.description}</td>
                  <td className="py-3 text-right">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20 tabular-nums">
                      {item.cost} cr
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Monthly history */}
      {allocations && allocations.length > 0 && (
        <div className="rounded-xl bg-surface border border-white/5 p-6">
          <h2 className="text-sm font-semibold text-text-secondary mb-4">
            Historial mensual
          </h2>
          <div className="space-y-4">
            {allocations.map((alloc, idx) => {
              const remaining = Math.max(0, alloc.quota - alloc.used);
              const pct = alloc.quota === 0 ? 0 : Math.min(100, Math.round((alloc.used / alloc.quota) * 100));
              const isCurrent = idx === 0;
              return (
                <div key={alloc.id} className={`space-y-2 ${idx > 0 ? 'pt-4 border-t border-white/5' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-text-primary capitalize">
                        {formatMonth(alloc.period_start)}
                      </span>
                      {isCurrent && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                          Actual
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-text-muted tabular-nums">
                      <span>Cuota: <span className="text-text-secondary font-medium">{alloc.quota}</span></span>
                      <span>Usados: <span className="text-text-secondary font-medium">{alloc.used}</span></span>
                      <span>Restantes: <span className="text-primary font-medium">{remaining}</span></span>
                    </div>
                  </div>
                  <CreditBar used={alloc.used} quota={alloc.quota} showLabel={false} size="sm" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent transactions */}
      {transactions && transactions.length > 0 && (
        <div className="rounded-xl bg-surface border border-white/5 p-6">
          <h2 className="text-sm font-semibold text-text-secondary mb-4">
            Transacciones recientes
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="text-left text-xs font-medium text-text-muted uppercase tracking-wider pb-3 pr-4">
                    Descripcion
                  </th>
                  <th className="text-right text-xs font-medium text-text-muted uppercase tracking-wider pb-3 pr-4">
                    Creditos
                  </th>
                  <th className="text-right text-xs font-medium text-text-muted uppercase tracking-wider pb-3 pr-4">
                    Balance
                  </th>
                  <th className="text-right text-xs font-medium text-text-muted uppercase tracking-wider pb-3">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 pr-4 text-text-secondary">{tx.description}</td>
                    <td className="py-3 pr-4 text-right tabular-nums">
                      <span className={tx.amount > 0 ? 'text-coral' : 'text-mint'}>
                        {tx.amount > 0 ? `−${tx.amount}` : `+${Math.abs(tx.amount)}`}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-right text-text-muted tabular-nums">
                      {tx.balance_after}
                    </td>
                    <td className="py-3 text-right text-text-muted text-xs tabular-nums">
                      {new Date(tx.created_at).toLocaleDateString('es-MX', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
