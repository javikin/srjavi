// =============================================================================
// Credit Utilities — Server-Side
// All functions require a server Supabase client (session-aware or admin).
// =============================================================================

import { createClient } from '@/lib/supabase/server';
import type { CreditAllocation, CreditSummary, CreditTransaction } from '@/lib/types/database';

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Returns the first day of the current UTC month as a YYYY-MM-DD string. */
function currentPeriodStart(): string {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  return `${year}-${month}-01`;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Ensures a credit_allocations row exists for the current billing period.
 * If it does not exist yet it is created using the project's monthly_credit_quota.
 * Returns the (potentially newly created) allocation.
 */
export async function ensureCurrentAllocation(projectId: string): Promise<CreditAllocation> {
  const supabase = await createClient();
  const period = currentPeriodStart();

  // Try to fetch an existing allocation first.
  const { data: existing, error: fetchError } = await supabase
    .from('credit_allocations')
    .select('*')
    .eq('project_id', projectId)
    .eq('period_start', period)
    .maybeSingle();

  if (fetchError) {
    throw new Error(`Error al obtener la asignación de créditos: ${fetchError.message}`);
  }

  if (existing) {
    return existing as CreditAllocation;
  }

  // No allocation exists yet — look up the project quota and create one.
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('monthly_credit_quota')
    .eq('id', projectId)
    .single();

  if (projectError || !project) {
    throw new Error(`Proyecto no encontrado: ${projectError?.message ?? projectId}`);
  }

  const { data: created, error: insertError } = await supabase
    .from('credit_allocations')
    .insert({
      project_id: projectId,
      period_start: period,
      quota: project.monthly_credit_quota,
      used: 0,
    })
    .select('*')
    .single();

  if (insertError || !created) {
    throw new Error(`Error al crear la asignación de créditos: ${insertError?.message}`);
  }

  return created as CreditAllocation;
}

/**
 * Returns the credit_allocations row for the current billing period.
 * Throws if no allocation exists (call ensureCurrentAllocation first if needed).
 */
export async function getCurrentAllocation(projectId: string): Promise<CreditAllocation> {
  const supabase = await createClient();
  const period = currentPeriodStart();

  const { data, error } = await supabase
    .from('credit_allocations')
    .select('*')
    .eq('project_id', projectId)
    .eq('period_start', period)
    .single();

  if (error || !data) {
    throw new Error(`Asignación de créditos no encontrada para el período actual: ${error?.message ?? projectId}`);
  }

  return data as CreditAllocation;
}

/**
 * Debits credits from the current period allocation when a request is approved.
 * Updates the allocation's `used` counter and appends a credit_transactions row.
 * Returns the new transaction record.
 */
export async function debitCredits(
  projectId: string,
  requestId: string,
  amount: number,
  adminId: string,
): Promise<CreditTransaction> {
  if (amount <= 0) {
    throw new Error('El monto a debitar debe ser mayor a cero.');
  }

  const supabase = await createClient();
  const allocation = await ensureCurrentAllocation(projectId);

  const newUsed = allocation.used + amount;
  const balanceAfter = allocation.quota - newUsed;

  // Update allocation used counter.
  const { error: updateError } = await supabase
    .from('credit_allocations')
    .update({ used: newUsed })
    .eq('id', allocation.id);

  if (updateError) {
    throw new Error(`Error al actualizar créditos usados: ${updateError.message}`);
  }

  // Insert transaction record.
  const { data: transaction, error: txError } = await supabase
    .from('credit_transactions')
    .insert({
      project_id: projectId,
      allocation_id: allocation.id,
      request_id: requestId,
      amount,
      balance_after: balanceAfter,
      description: `Débito por solicitud aprobada`,
      created_by: adminId,
    })
    .select('*')
    .single();

  if (txError || !transaction) {
    throw new Error(`Error al registrar la transacción de créditos: ${txError?.message}`);
  }

  return transaction as CreditTransaction;
}

/**
 * Adds or removes credits from the current period allocation (manual adjustment).
 * Positive amount adds credits (refund); negative removes credits (extra debit).
 * Returns the new transaction record.
 */
export async function adjustCredits(
  projectId: string,
  amount: number,
  description: string,
  adminId: string,
): Promise<CreditTransaction> {
  if (amount === 0) {
    throw new Error('El monto del ajuste no puede ser cero.');
  }

  const supabase = await createClient();
  const allocation = await ensureCurrentAllocation(projectId);

  // For adjustments: positive amount = refund (reduce `used`), negative = extra debit (increase `used`).
  const newUsed = allocation.used - amount;
  const balanceAfter = allocation.quota - newUsed;

  const { error: updateError } = await supabase
    .from('credit_allocations')
    .update({ used: newUsed })
    .eq('id', allocation.id);

  if (updateError) {
    throw new Error(`Error al ajustar créditos: ${updateError.message}`);
  }

  const { data: transaction, error: txError } = await supabase
    .from('credit_transactions')
    .insert({
      project_id: projectId,
      allocation_id: allocation.id,
      request_id: null,
      amount: -amount, // stored as negative to denote credit in the audit log
      balance_after: balanceAfter,
      description,
      created_by: adminId,
    })
    .select('*')
    .single();

  if (txError || !transaction) {
    throw new Error(`Error al registrar el ajuste de créditos: ${txError?.message}`);
  }

  return transaction as CreditTransaction;
}

/**
 * Returns a CreditSummary (quota, used, remaining, percentage) for the
 * current billing period of the given project.
 */
export async function getCreditSummary(projectId: string): Promise<CreditSummary> {
  const allocation = await ensureCurrentAllocation(projectId);

  const remaining = allocation.quota - allocation.used;
  const percentage =
    allocation.quota > 0
      ? Math.min(100, Math.round((allocation.used / allocation.quota) * 100))
      : 0;

  return {
    quota: allocation.quota,
    used: allocation.used,
    remaining,
    percentage,
  };
}

/**
 * Returns credit_allocations rows ordered by period_start descending.
 * Defaults to the last 12 months. Useful for rendering billing history charts.
 */
export async function getCreditHistory(
  projectId: string,
  months: number = 12,
): Promise<CreditAllocation[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('credit_allocations')
    .select('*')
    .eq('project_id', projectId)
    .order('period_start', { ascending: false })
    .limit(months);

  if (error) {
    throw new Error(`Error al obtener el historial de créditos: ${error.message}`);
  }

  return (data ?? []) as CreditAllocation[];
}
