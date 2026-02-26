// =============================================================================
// Activity Logging — Server-Side Helper
// Writes to public.activity_log for admin dashboard analytics and audit trails.
// =============================================================================

import { createClient } from '@/lib/supabase/server';

interface LogActivityParams {
  projectId?: string;
  actorId: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
}

/**
 * Appends a row to the activity_log table.
 * Failures are intentionally swallowed so that a logging error never breaks
 * the primary request flow. A console warning is emitted instead.
 */
export async function logActivity(params: LogActivityParams): Promise<void> {
  const { projectId, actorId, action, entityType, entityId, metadata } = params;

  try {
    const supabase = await createClient();

    const { error } = await supabase.from('activity_log').insert({
      project_id: projectId ?? null,
      actor_id: actorId,
      action,
      entity_type: entityType,
      entity_id: entityId ?? null,
      metadata: metadata ?? {},
    });

    if (error) {
      console.warn('[activity] Error al registrar actividad:', error.message, { action, entityType, entityId });
    }
  } catch (err) {
    console.warn('[activity] Excepción al registrar actividad:', err);
  }
}
