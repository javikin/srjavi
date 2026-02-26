'use client';

import { useState, useEffect } from 'react';
import { createBrowserClient } from '@/lib/supabase/client';
import PageHeader from '@/components/dashboard/PageHeader';

interface ProfileData {
  id: string;
  email: string;
  full_name: string;
  company: string | null;
  phone: string | null;
}

export default function PortalSettingsPage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);

  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadProfile() {
      const supabase = createBrowserClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('id, email, full_name, company, phone')
        .eq('id', user.id)
        .single();

      if (data) {
        setProfile(data);
        setFullName(data.full_name ?? '');
        setCompany(data.company ?? '');
        setPhone(data.phone ?? '');
      }
      setLoading(false);
    }
    loadProfile();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!profile) return;

    setSaving(true);
    setError(null);
    setSuccess(false);

    const supabase = createBrowserClient();
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        full_name: fullName.trim(),
        company: company.trim() || null,
        phone: phone.trim() || null,
      })
      .eq('id', profile.id);

    if (updateError) {
      setError('No se pudieron guardar los cambios. Intenta de nuevo.');
    } else {
      setSuccess(true);
      setProfile((prev) =>
        prev
          ? { ...prev, full_name: fullName.trim(), company: company.trim() || null, phone: phone.trim() || null }
          : prev
      );
      setTimeout(() => setSuccess(false), 3000);
    }

    setSaving(false);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="rounded-xl bg-surface border border-white/5 p-6 text-center">
        <p className="text-text-muted">No se pudo cargar el perfil.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg space-y-6">
      <PageHeader
        title="Mi Perfil"
        description="Actualiza tu informacion de contacto."
      />

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-xl bg-surface border border-white/5 p-6 space-y-5">
          {/* Email (read-only) */}
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-1.5">
              Correo electronico
            </label>
            <input
              type="email"
              value={profile.email}
              readOnly
              disabled
              className="w-full px-3 py-2.5 rounded-lg bg-white/[0.03] border border-white/5 text-text-muted text-sm cursor-not-allowed"
            />
            <p className="mt-1 text-xs text-text-muted">
              El correo no se puede modificar desde aqui.
            </p>
          </div>

          {/* Full name */}
          <div>
            <label htmlFor="full_name" className="block text-sm font-medium text-text-secondary mb-1.5">
              Nombre completo
            </label>
            <input
              id="full_name"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              maxLength={120}
              placeholder="Tu nombre completo"
              className="w-full px-3 py-2.5 rounded-lg bg-background border border-white/10 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
            />
          </div>

          {/* Company */}
          <div>
            <label htmlFor="company" className="block text-sm font-medium text-text-secondary mb-1.5">
              Empresa <span className="text-text-muted font-normal">(opcional)</span>
            </label>
            <input
              id="company"
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              maxLength={120}
              placeholder="Nombre de tu empresa"
              className="w-full px-3 py-2.5 rounded-lg bg-background border border-white/10 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
            />
          </div>

          {/* Phone */}
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-text-secondary mb-1.5">
              Telefono <span className="text-text-muted font-normal">(opcional)</span>
            </label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              maxLength={30}
              placeholder="+52 55 1234 5678"
              className="w-full px-3 py-2.5 rounded-lg bg-background border border-white/10 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
            />
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-coral/10 border border-coral/20 px-4 py-3 text-sm text-coral">
            {error}
          </div>
        )}

        {success && (
          <div className="rounded-lg bg-mint/10 border border-mint/20 px-4 py-3 text-sm text-mint flex items-center gap-2">
            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Cambios guardados correctamente.
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-background text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                Guardando...
              </>
            ) : (
              'Guardar cambios'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
