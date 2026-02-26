'use client';

import { useState, useEffect, useTransition } from 'react';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  company: string | null;
  phone: string | null;
  avatar_url: string | null;
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [form, setForm] = useState({
    full_name: '',
    company: '',
    phone: '',
  });

  useEffect(() => {
    fetch('/api/me')
      .then((r) => r.json())
      .then((data: Profile) => {
        setProfile(data);
        setForm({
          full_name: data.full_name ?? '',
          company: data.company ?? '',
          phone: data.phone ?? '',
        });
      })
      .catch(() => {/* silently fail */})
      .finally(() => setIsLoadingProfile(false));
  }, []);

  function handleChange(key: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(null);
    setError(null);

    startTransition(async () => {
      const res = await fetch('/api/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: form.full_name,
          company: form.company || null,
          phone: form.phone || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? 'Error al guardar los cambios');
        return;
      }

      setSuccess('Perfil actualizado correctamente');
    });
  }

  const CREDIT_COSTS = [
    { type: 'bug', label: 'Bug', description: 'Correcci\u00f3n de errores', default: 1 },
    { type: 'feature', label: 'Feature', description: 'Nueva funcionalidad', default: 3 },
    { type: 'improvement', label: 'Mejora', description: 'Optimizaci\u00f3n o mejora', default: 2 },
  ];

  const GITHUB_CONFIG = [
    { key: 'GITHUB_TOKEN', label: 'GitHub Token', description: 'Personal access token con permisos de issues' },
    { key: 'GITHUB_WEBHOOK_SECRET', label: 'Webhook Secret', description: 'Secreto para validar webhooks de GitHub' },
  ];

  return (
    <div className="max-w-2xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-text-primary">Configuracion</h1>
        <p className="mt-1 text-sm text-text-secondary">
          Ajustes de cuenta, integracion con GitHub y referencia de costos.
        </p>
      </div>

      {/* Profile form */}
      <div className="rounded-xl bg-surface border border-white/5 p-6">
        <h2 className="text-base font-semibold text-text-primary mb-5">Perfil de administrador</h2>

        {isLoadingProfile ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-10 rounded-lg bg-white/5 animate-pulse" />
            ))}
          </div>
        ) : (
          <form onSubmit={handleSaveProfile} className="space-y-4">
            {error && (
              <div className="px-4 py-3 rounded-lg bg-coral/10 border border-coral/20 text-sm text-coral">
                {error}
              </div>
            )}
            {success && (
              <div className="px-4 py-3 rounded-lg bg-mint/10 border border-mint/20 text-sm text-mint">
                {success}
              </div>
            )}

            {/* Email (read-only) */}
            <div className="space-y-1.5">
              <label className="text-sm text-text-secondary font-medium">Email</label>
              <input
                type="email"
                value={profile?.email ?? ''}
                readOnly
                className="w-full px-3 py-2 rounded-lg bg-white/[0.03] border border-white/5 text-text-muted text-sm cursor-not-allowed"
              />
              <p className="text-xs text-text-muted">El email no se puede cambiar desde aqui.</p>
            </div>

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
                placeholder="Tu nombre"
                className="w-full px-3 py-2 rounded-lg bg-background border border-white/10 text-text-primary placeholder-text-muted text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="company" className="text-sm text-text-secondary font-medium">
                  Empresa
                </label>
                <input
                  id="company"
                  type="text"
                  value={form.company}
                  onChange={(e) => handleChange('company', e.target.value)}
                  placeholder="Mi empresa S.A."
                  className="w-full px-3 py-2 rounded-lg bg-background border border-white/10 text-text-primary placeholder-text-muted text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
                />
              </div>
              <div className="space-y-1.5">
                <label htmlFor="phone" className="text-sm text-text-secondary font-medium">
                  Telefono
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={form.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  placeholder="+52 55 1234 5678"
                  className="w-full px-3 py-2 rounded-lg bg-background border border-white/10 text-text-primary placeholder-text-muted text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2 rounded-lg bg-primary text-background text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isPending ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </form>
        )}
      </div>

      {/* GitHub config reference */}
      <div className="rounded-xl bg-surface border border-white/5 p-6">
        <h2 className="text-base font-semibold text-text-primary mb-2">
          Integracion con GitHub
        </h2>
        <p className="text-sm text-text-secondary mb-5">
          Estas variables de entorno deben configurarse en el servidor para habilitar la integracion con GitHub.
        </p>
        <div className="space-y-3">
          {GITHUB_CONFIG.map((item) => (
            <div
              key={item.key}
              className="flex items-start gap-3 p-3 rounded-lg bg-white/[0.03] border border-white/5"
            >
              <div className="flex-1 min-w-0">
                <p className="text-xs font-mono font-medium text-primary">{item.key}</p>
                <p className="text-xs text-text-muted mt-0.5">{item.description}</p>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-white/5 text-text-muted border border-white/10 flex-shrink-0">
                .env
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Credit cost reference */}
      <div className="rounded-xl bg-surface border border-white/5 p-6">
        <h2 className="text-base font-semibold text-text-primary mb-2">
          Costo de creditos por tipo de solicitud
        </h2>
        <p className="text-sm text-text-secondary mb-5">
          Referencia de costos predeterminados. El costo final se define al aprobar cada solicitud.
        </p>
        <div className="space-y-3">
          {CREDIT_COSTS.map((item) => (
            <div
              key={item.type}
              className="flex items-center justify-between p-3 rounded-lg bg-white/[0.03] border border-white/5"
            >
              <div>
                <p className="text-sm font-medium text-text-primary">{item.label}</p>
                <p className="text-xs text-text-muted">{item.description}</p>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-lg font-semibold text-primary">{item.default}</span>
                <span className="text-xs text-text-muted">creditos</span>
              </div>
            </div>
          ))}
        </div>
        <p className="text-xs text-text-muted mt-4">
          El campo <code className="font-mono bg-white/5 px-1 py-0.5 rounded">credit_cost</code> en la tabla{' '}
          <code className="font-mono bg-white/5 px-1 py-0.5 rounded">requests</code> almacena el costo real asignado al aprobar.
        </p>
      </div>
    </div>
  );
}
