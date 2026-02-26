'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Project {
  id: string;
  name: string;
}

const ROLE_OPTIONS = [
  { value: 'owner', label: 'Propietario (puede enviar solicitudes)' },
  { value: 'viewer', label: 'Lector (solo visualizacion)' },
];

export default function InviteClientPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);

  const [form, setForm] = useState({
    email: '',
    full_name: '',
    project_id: '',
    role: 'owner',
  });

  // Fetch projects for the select
  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setProjects(data);
        else if (Array.isArray(data?.data)) setProjects(data.data);
      })
      .catch(() => {/* silently fail */});
  }, []);

  function handleChange(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          full_name: form.full_name,
          project_id: form.project_id || undefined,
          role: form.role,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? 'Error al enviar la invitacion');
      }

      router.push('/admin/clients');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="max-w-lg">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link
          href="/admin/clients"
          className="text-text-muted hover:text-text-secondary transition-colors"
          aria-label="Volver a clientes"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-text-primary">Invitar cliente</h1>
          <p className="text-sm text-text-secondary mt-0.5">
            Envia una invitacion por email para acceder al portal.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="rounded-lg bg-coral/10 border border-coral/20 px-4 py-3 text-sm text-coral">
            {error}
          </div>
        )}

        <div className="rounded-xl bg-surface border border-white/5 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
            Datos del cliente
          </h2>

          <div className="space-y-1.5">
            <label htmlFor="full_name" className="text-sm text-text-secondary font-medium">
              Nombre completo <span className="text-coral">*</span>
            </label>
            <input
              id="full_name"
              type="text"
              required
              value={form.full_name}
              onChange={(e) => handleChange('full_name', e.target.value)}
              placeholder="Ana Garcia"
              className="w-full px-3 py-2 rounded-lg bg-background border border-white/10 text-text-primary placeholder-text-muted text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm text-text-secondary font-medium">
              Email <span className="text-coral">*</span>
            </label>
            <input
              id="email"
              type="email"
              required
              value={form.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="ana@empresa.com"
              className="w-full px-3 py-2 rounded-lg bg-background border border-white/10 text-text-primary placeholder-text-muted text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
            />
          </div>
        </div>

        <div className="rounded-xl bg-surface border border-white/5 p-6 space-y-4">
          <h2 className="text-sm font-semibold text-text-primary uppercase tracking-wider">
            Asignacion al proyecto
          </h2>
          <p className="text-xs text-text-muted">
            Opcional. Puedes asignarlo a un proyecto despues.
          </p>

          <div className="space-y-1.5">
            <label htmlFor="project_id" className="text-sm text-text-secondary font-medium">
              Proyecto
            </label>
            <select
              id="project_id"
              value={form.project_id}
              onChange={(e) => handleChange('project_id', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-background border border-white/10 text-text-primary text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
            >
              <option value="">Sin asignar</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="role" className="text-sm text-text-secondary font-medium">
              Rol en el proyecto <span className="text-coral">*</span>
            </label>
            <select
              id="role"
              value={form.role}
              onChange={(e) => handleChange('role', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-background border border-white/10 text-text-primary text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
            >
              {ROLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Info box */}
        <div className="rounded-lg bg-sky/5 border border-sky/20 px-4 py-3">
          <p className="text-xs text-sky/80">
            El cliente recibira un email con un enlace magico para configurar su cuenta y acceder al portal.
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={isLoading}
            className="px-6 py-2.5 rounded-lg bg-primary text-background text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? 'Enviando invitacion...' : 'Enviar invitacion'}
          </button>
          <Link
            href="/admin/clients"
            className="px-6 py-2.5 rounded-lg border border-white/10 text-text-secondary text-sm hover:bg-white/5 transition-colors"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
}
