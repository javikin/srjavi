'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const BILLING_OPTIONS = [
  { value: 'paid', label: 'De paga' },
  { value: 'pro_bono', label: 'Pro Bono' },
];

export default function NewProjectPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    billing_type: 'paid',
    tech_stack: '',
    monthly_credit_quota: 10,
    github_repo_owner: '',
    github_repo_name: '',
    website_url: '',
  });

  function handleNameChange(value: string) {
    setForm((prev) => ({
      ...prev,
      name: value,
      slug: slugify(value),
    }));
  }

  function handleChange(key: keyof typeof form, value: string | number) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        ...form,
        tech_stack: form.tech_stack
          ? form.tech_stack.split(',').map((s) => s.trim()).filter(Boolean)
          : [],
        monthly_credit_quota: Number(form.monthly_credit_quota),
        github_repo_owner: form.github_repo_owner || null,
        github_repo_name: form.github_repo_name || null,
        website_url: form.website_url || null,
        description: form.description || null,
      };

      const res = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Error al crear el proyecto');
      }

      const created = await res.json();
      router.push(`/admin/projects/${created.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/admin/projects"
          className="text-text-muted hover:text-text-secondary transition-colors"
          aria-label="Volver a proyectos"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Nuevo proyecto</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Configura los datos basicos del proyecto.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-coral/10 border border-coral/20 px-4 py-3 text-sm text-coral">
            {error}
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
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Mi proyecto"
              className="w-full px-3 py-2 rounded-lg bg-background border border-white/10 text-text-primary placeholder-text-muted text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="slug" className="text-sm text-text-secondary font-medium">
              Slug (identificador URL) <span className="text-coral">*</span>
            </label>
            <input
              id="slug"
              type="text"
              required
              value={form.slug}
              onChange={(e) => handleChange('slug', e.target.value)}
              placeholder="mi-proyecto"
              className="w-full px-3 py-2 rounded-lg bg-background border border-white/10 text-text-primary placeholder-text-muted text-sm font-mono focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
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
              placeholder="Descripcion breve del proyecto..."
              className="w-full px-3 py-2 rounded-lg bg-background border border-white/10 text-text-primary placeholder-text-muted text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="billing_type" className="text-sm text-text-secondary font-medium">
                Tipo de facturacion <span className="text-coral">*</span>
              </label>
              <select
                id="billing_type"
                value={form.billing_type}
                onChange={(e) => handleChange('billing_type', e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-background border border-white/10 text-text-primary text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
              >
                {BILLING_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="monthly_credit_quota" className="text-sm text-text-secondary font-medium">
                Cuota mensual de creditos <span className="text-coral">*</span>
              </label>
              <input
                id="monthly_credit_quota"
                type="number"
                min={0}
                required
                value={form.monthly_credit_quota}
                onChange={(e) => handleChange('monthly_credit_quota', Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-background border border-white/10 text-text-primary text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
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
              className="w-full px-3 py-2 rounded-lg bg-background border border-white/10 text-text-primary placeholder-text-muted text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
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
              className="w-full px-3 py-2 rounded-lg bg-background border border-white/10 text-text-primary placeholder-text-muted text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
            />
          </div>
        </div>

        {/* GitHub config */}
        <div className="rounded-xl bg-surface border border-white/5 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
            Integracion con GitHub
          </h2>
          <p className="text-xs text-text-muted">
            Ambos campos deben completarse o dejarse vacios.
          </p>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="github_repo_owner" className="text-sm text-text-secondary font-medium">
                Propietario del repositorio
              </label>
              <input
                id="github_repo_owner"
                type="text"
                value={form.github_repo_owner}
                onChange={(e) => handleChange('github_repo_owner', e.target.value)}
                placeholder="usuario-o-org"
                className="w-full px-3 py-2 rounded-lg bg-background border border-white/10 text-text-primary placeholder-text-muted text-sm font-mono focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="github_repo_name" className="text-sm text-text-secondary font-medium">
                Nombre del repositorio
              </label>
              <input
                id="github_repo_name"
                type="text"
                value={form.github_repo_name}
                onChange={(e) => handleChange('github_repo_name', e.target.value)}
                placeholder="nombre-del-repo"
                className="w-full px-3 py-2 rounded-lg bg-background border border-white/10 text-text-primary placeholder-text-muted text-sm font-mono focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 rounded-lg bg-primary text-background text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Creando...' : 'Crear proyecto'}
          </button>
          <Link
            href="/admin/projects"
            className="px-6 py-2.5 rounded-lg border border-white/10 text-text-secondary text-sm hover:bg-white/5 transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
