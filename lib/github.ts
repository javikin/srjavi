// =============================================================================
// GitHub Integration Utilities
// Uses a Personal Access Token (GITHUB_TOKEN env var) via @octokit/rest.
// Can be upgraded to a GitHub App in the future.
// =============================================================================

import { createHmac, timingSafeEqual } from 'crypto';
import { Octokit } from '@octokit/rest';
import type { Project, Request, RequestType } from '@/lib/types/database';

// ---------------------------------------------------------------------------
// Octokit instance
// ---------------------------------------------------------------------------

/**
 * Returns a configured Octokit instance authenticated with the GITHUB_TOKEN
 * Personal Access Token. Throws if the env var is not set.
 */
export function getOctokit(): Octokit {
  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    throw new Error('GITHUB_TOKEN no está configurado en las variables de entorno.');
  }

  return new Octokit({ auth: token });
}

// ---------------------------------------------------------------------------
// Label mapping
// ---------------------------------------------------------------------------

/** Maps RequestType values to GitHub label names and colors. */
export const LABEL_MAP: Record<RequestType, { name: string; color: string }> = {
  bug: { name: 'bug', color: 'd73a4a' },
  feature: { name: 'feature', color: '0075ca' },
  improvement: { name: 'improvement', color: 'e4e669' },
};

// ---------------------------------------------------------------------------
// Issue creation
// ---------------------------------------------------------------------------

/**
 * Creates a GitHub issue in the repository linked to the project.
 * Returns the issue number and HTML URL.
 * Throws if the project has no linked GitHub repository.
 */
export async function createGitHubIssue(
  request: Request,
  project: Project,
): Promise<{ number: number; url: string }> {
  if (!project.github_repo_owner || !project.github_repo_name) {
    throw new Error(
      `El proyecto "${project.name}" no tiene un repositorio de GitHub configurado.`,
    );
  }

  const octokit = getOctokit();
  const label = LABEL_MAP[request.type];

  // Ensure the label exists in the target repository (idempotent).
  await ensureLabel(octokit, project.github_repo_owner, project.github_repo_name, label);

  const body = buildIssueBody(request);

  const { data: issue } = await octokit.issues.create({
    owner: project.github_repo_owner,
    repo: project.github_repo_name,
    title: request.title,
    body,
    labels: [label.name],
  });

  return { number: issue.number, url: issue.html_url };
}

// ---------------------------------------------------------------------------
// Webhook signature verification
// ---------------------------------------------------------------------------

/**
 * Verifies a GitHub webhook payload against its SHA-256 HMAC signature.
 * Uses GITHUB_WEBHOOK_SECRET env var as the shared secret.
 * Returns true if the signature is valid.
 */
export async function verifyWebhookSignature(
  payload: string,
  signature: string,
): Promise<boolean> {
  const secret = process.env.GITHUB_WEBHOOK_SECRET;

  if (!secret) {
    console.warn('[github] GITHUB_WEBHOOK_SECRET no está configurado — omitiendo verificación.');
    return false;
  }

  if (!signature.startsWith('sha256=')) {
    return false;
  }

  const expectedHex = signature.slice('sha256='.length);
  const hmac = createHmac('sha256', secret);
  hmac.update(payload, 'utf8');
  const computedHex = hmac.digest('hex');

  try {
    return timingSafeEqual(Buffer.from(computedHex, 'hex'), Buffer.from(expectedHex, 'hex'));
  } catch {
    // Buffer lengths differ — signature format is invalid.
    return false;
  }
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

/** Formats a human-readable issue body from a Request record. */
function buildIssueBody(request: Request): string {
  const typeLabels: Record<RequestType, string> = {
    bug: 'Reporte de error',
    feature: 'Nueva funcionalidad',
    improvement: 'Mejora',
  };

  const priorityLabels: Record<string, string> = {
    low: 'Baja',
    medium: 'Media',
    high: 'Alta',
    critical: 'Crítica',
  };

  const lines: string[] = [
    `## ${typeLabels[request.type]}`,
    '',
    request.description,
    '',
    '---',
    '',
    '**Detalles de la solicitud**',
    '',
    `- **Tipo:** ${typeLabels[request.type]}`,
    `- **Prioridad del cliente:** ${priorityLabels[request.priority_preference] ?? request.priority_preference}`,
    `- **Costo en créditos:** ${request.credit_cost}`,
    `- **ID interno:** \`${request.id}\``,
  ];

  return lines.join('\n');
}

/**
 * Creates the label on the repository if it does not already exist.
 * A 422 response from GitHub means the label is already there — that is fine.
 */
async function ensureLabel(
  octokit: Octokit,
  owner: string,
  repo: string,
  label: { name: string; color: string },
): Promise<void> {
  try {
    await octokit.issues.createLabel({
      owner,
      repo,
      name: label.name,
      color: label.color,
    });
  } catch (err: unknown) {
    // 422 = label already exists; ignore it.
    if (isOctokitResponseError(err) && err.status === 422) {
      return;
    }
    throw err;
  }
}

/** Type-guard for Octokit request errors that carry an HTTP status code. */
function isOctokitResponseError(err: unknown): err is { status: number } {
  return typeof err === 'object' && err !== null && 'status' in err;
}
