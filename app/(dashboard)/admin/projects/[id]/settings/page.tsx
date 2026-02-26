'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

// ─── GitHub repo picker ────────────────────────────────────────────────────

interface GitHubRepo {
  full_name: string;
  name: string;
  owner: string;
  private: boolean;
}

function GitHubSection({
  owner,
  repo,
  onSelect,
  onDisconnect,
}: {
  owner: string;
  repo: string;
  onSelect: (owner: string, name: string) => void;
  onDisconnect: () => void;
}) {
  const isConnected = !!(owner && repo);
  const [showPicker, setShowPicker] = useState(false);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [repoError, setRepoError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const loadRepos = useCallback(async () => {
    setIsLoadingRepos(true);
    setRepoError(null);
    try {
      const res = await fetch('/api/github/repos');
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Error al cargar repositorios');
      }
      const { data } = await res.json();
      setRepos(data);
    } catch (err) {
      setRepoError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoadingRepos(false);
    }
  }, []);

  function handleOpenPicker() {
    setShowPicker(true);
    setSearch('');
    if (repos.length === 0) loadRepos();
  }

  function handleSelectRepo(r: GitHubRepo) {
    onSelect(r.owner, r.name);
    setShowPicker(false);
  }

  const filtered = search
    ? repos.filter((r) => r.full_name.toLowerCase().includes(search.toLowerCase()))
    : repos;

  return (
    <div className="rounded-xl bg-surface border border-white/5 p-6 space-y-4">
      <div className="flex items-center gap-3">
        <svg className="w-5 h-5 text-text-secondary" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
        </svg>
        <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
          Integracion con GitHub
        </h2>
      </div>
      <p className="text-xs text-text-muted">
        Vincula un repositorio de GitHub para crear issues automaticamente cuando se aprueban solicitudes.
      </p>

      {isConnected && !showPicker ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-mint/5 border border-mint/10">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-mint" />
              <a
                href={`https://github.com/${owner}/${repo}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-mono text-primary hover:underline"
              >
                {owner}/{repo}
              </a>
            </div>
            <span className="text-xs text-mint">Vinculado</span>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleOpenPicker}
              className="text-xs text-text-muted hover:text-text-secondary transition-colors"
            >
              Cambiar repositorio
            </button>
            <span className="text-xs text-white/10">|</span>
            <button
              type="button"
              onClick={onDisconnect}
              className="text-xs text-coral/70 hover:text-coral transition-colors"
            >
              Desvincular
            </button>
          </div>
        </div>
      ) : !showPicker ? (
        <button
          type="button"
          onClick={handleOpenPicker}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg border border-dashed border-white/10 text-sm text-text-secondary hover:border-primary/30 hover:text-primary transition-colors w-full justify-center"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
          </svg>
          Conectar repositorio de GitHub
        </button>
      ) : null}

      {showPicker && (
        <div className="space-y-3">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar repositorio..."
              autoFocus
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-background border border-white/10 text-text-primary placeholder-text-muted text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
            />
          </div>

          {repoError && (
            <div className="px-3 py-2 rounded-lg bg-coral/10 border border-coral/20 text-xs text-coral">
              {repoError}
            </div>
          )}

          {isLoadingRepos ? (
            <div className="flex items-center justify-center py-8">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="ml-2 text-sm text-text-muted">Cargando repositorios...</span>
            </div>
          ) : (
            <div className="max-h-64 overflow-y-auto rounded-lg border border-white/5 divide-y divide-white/5">
              {filtered.length === 0 ? (
                <p className="px-4 py-6 text-sm text-text-muted text-center">
                  {search ? 'Sin resultados' : 'No se encontraron repositorios'}
                </p>
              ) : (
                filtered.map((r) => (
                  <button
                    key={r.full_name}
                    type="button"
                    onClick={() => handleSelectRepo(r)}
                    className={`w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-white/[0.03] transition-colors ${
                      r.owner === owner && r.name === repo ? 'bg-primary/5' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <svg className="w-4 h-4 text-text-muted flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
                      </svg>
                      <span className="text-sm font-mono text-text-primary truncate">{r.full_name}</span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {r.private && (
                        <span className="text-xs px-1.5 py-0.5 rounded bg-white/5 text-text-muted border border-white/10">
                          Privado
                        </span>
                      )}
                      {r.owner === owner && r.name === repo && (
                        <svg className="w-4 h-4 text-mint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                  </button>
                ))
              )}
            </div>
          )}

          <button
            type="button"
            onClick={() => setShowPicker(false)}
            className="text-xs text-text-muted hover:text-text-secondary transition-colors"
          >
            Cancelar
          </button>
        </div>
      )}
    </div>
  );
}

const BILLING_OPTIONS = [
  { value: 'paid', label: 'De paga' },
  { value: 'pro_bono', label: 'Pro Bono' },
];

const STATUS_OPTIONS = [
  { value: 'active', label: 'Activo' },
  { value: 'paused', label: 'Pausado' },
  { value: 'completed', label: 'Completado' },
  { value: 'archived', label: 'Archivado' },
];

interface ProjectForm {
  name: string;
  slug: string;
  description: string;
  status: string;
  billing_type: string;
  tech_stack: string;
  monthly_credit_quota: number;
  github_repo_owner: string;
  github_repo_name: string;
  website_url: string;
}

export default function ProjectSettingsPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState<ProjectForm>({
    name: '',
    slug: '',
    description: '',
    status: 'active',
    billing_type: 'paid',
    tech_stack: '',
    monthly_credit_quota: 10,
    github_repo_owner: '',
    github_repo_name: '',
    website_url: '',
  });

  useEffect(() => {
    async function loadProject() {
      try {
        const res = await fetch(`/api/projects/${id}`);
        if (!res.ok) throw new Error('Error al cargar proyecto');
        const { data } = await res.json();
        setForm({
          name: data.name ?? '',
          slug: data.slug ?? '',
          description: data.description ?? '',
          status: data.status ?? 'active',
          billing_type: data.billing_type ?? 'paid',
          tech_stack: Array.isArray(data.tech_stack) ? data.tech_stack.join(', ') : '',
          monthly_credit_quota: data.monthly_credit_quota ?? 10,
          github_repo_owner: data.github_repo_owner ?? '',
          github_repo_name: data.github_repo_name ?? '',
          website_url: data.website_url ?? '',
        });
      } catch {
        setError('No se pudo cargar el proyecto');
      } finally {
        setIsLoading(false);
      }
    }
    loadProject();
  }, [id]);

  function handleChange(key: keyof ProjectForm, value: string | number) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSuccess(false);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const payload = {
        name: form.name,
        slug: form.slug,
        description: form.description || null,
        status: form.status,
        billing_type: form.billing_type,
        tech_stack: form.tech_stack
          ? form.tech_stack.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        monthly_credit_quota: Number(form.monthly_credit_quota),
        github_repo_owner: form.github_repo_owner || null,
        github_repo_name: form.github_repo_name || null,
        website_url: form.website_url || null,
      };

      const res = await fetch(`/api/projects/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Error al guardar los cambios');
      }

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsSaving(false);
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const inputClasses =
    'w-full px-3 py-2 rounded-lg bg-background border border-white/10 text-text-primary placeholder-text-muted text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors';

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href={`/admin/projects/${id}`}
          className="text-text-muted hover:text-text-secondary transition-colors"
          aria-label="Volver al proyecto"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Ajustes del proyecto</h1>
          <p className="text-sm text-text-secondary mt-0.5">{form.name}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-coral/10 border border-coral/20 px-4 py-3 text-sm text-coral">
            {error}
          </div>
        )}
        {success && (
          <div className="rounded-lg bg-mint/10 border border-mint/20 px-4 py-3 text-sm text-mint">
            Cambios guardados correctamente.
          </div>
        )}

        {/* Basic info */}
        <div className="rounded-xl bg-surface border border-white/5 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
            Informacion basica
          </h2>

          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm text-text-secondary font-medium">
              Nombre del proyecto <span className="text-coral">*</span>
            </label>
            <input
              id="name"
              type="text"
              required
              value={form.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={inputClasses}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="slug" className="text-sm text-text-secondary font-medium">
              Slug <span className="text-coral">*</span>
            </label>
            <input
              id="slug"
              type="text"
              required
              value={form.slug}
              onChange={(e) => handleChange('slug', e.target.value)}
              className={`${inputClasses} font-mono`}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="description" className="text-sm text-text-secondary font-medium">
              Descripcion
            </label>
            <textarea
              id="description"
              rows={3}
              value={form.description}
              onChange={(e) => handleChange('description', e.target.value)}
              className={`${inputClasses} resize-none`}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="status" className="text-sm text-text-secondary font-medium">
                Estado
              </label>
              <select
                id="status"
                value={form.status}
                onChange={(e) => handleChange('status', e.target.value)}
                className={inputClasses}
              >
                {STATUS_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="billing_type" className="text-sm text-text-secondary font-medium">
                Tipo de facturacion
              </label>
              <select
                id="billing_type"
                value={form.billing_type}
                onChange={(e) => handleChange('billing_type', e.target.value)}
                className={inputClasses}
              >
                {BILLING_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="monthly_credit_quota" className="text-sm text-text-secondary font-medium">
                Cuota mensual de creditos
              </label>
              <input
                id="monthly_credit_quota"
                type="number"
                min={0}
                value={form.monthly_credit_quota}
                onChange={(e) => handleChange('monthly_credit_quota', Number(e.target.value))}
                className={inputClasses}
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="website_url" className="text-sm text-text-secondary font-medium">
                URL del sitio web
              </label>
              <input
                id="website_url"
                type="url"
                value={form.website_url}
                onChange={(e) => handleChange('website_url', e.target.value)}
                placeholder="https://ejemplo.com"
                className={inputClasses}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="tech_stack" className="text-sm text-text-secondary font-medium">
              Stack tecnologico
            </label>
            <input
              id="tech_stack"
              type="text"
              value={form.tech_stack}
              onChange={(e) => handleChange('tech_stack', e.target.value)}
              placeholder="Next.js, Supabase, Tailwind CSS (separados por coma)"
              className={inputClasses}
            />
          </div>
        </div>

        {/* GitHub config */}
        <GitHubSection
          owner={form.github_repo_owner}
          repo={form.github_repo_name}
          onSelect={(owner, name) => {
            setForm((prev) => ({ ...prev, github_repo_owner: owner, github_repo_name: name }));
            setSuccess(false);
          }}
          onDisconnect={() => {
            setForm((prev) => ({ ...prev, github_repo_owner: '', github_repo_name: '' }));
            setSuccess(false);
          }}
        />

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isSaving}
            className="px-6 py-2.5 rounded-lg bg-primary text-background text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSaving ? 'Guardando...' : 'Guardar cambios'}
          </button>
          <Link
            href={`/admin/projects/${id}`}
            className="px-6 py-2.5 rounded-lg border border-white/10 text-text-secondary text-sm hover:bg-white/5 transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
