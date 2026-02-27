'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createBrowserClient } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createBrowserClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        { redirectTo: `${window.location.origin}/auth/callback` },
      );

      if (resetError) {
        setError(resetError.message);
        setLoading(false);
        return;
      }

      setSent(true);
    } catch {
      setError('Error inesperado. Intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="space-y-8 text-center">
        <div className="space-y-2">
          <div className="w-12 h-12 rounded-full bg-mint/10 border border-mint/20 flex items-center justify-center mx-auto">
            <svg className="w-6 h-6 text-mint" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold text-text-primary">
            Revisa tu correo
          </h1>
          <p className="text-text-secondary text-sm">
            Enviamos un enlace de recuperacion a <strong className="text-text-primary">{email}</strong>
          </p>
        </div>

        <p className="text-xs text-text-muted">
          Si no ves el correo, revisa tu carpeta de spam.
        </p>

        <Link
          href="/login"
          className="inline-block text-sm text-primary hover:text-primary/80 transition-colors"
        >
          Volver al inicio de sesion
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold text-text-primary">
          Recuperar contrasena
        </h1>
        <p className="text-text-secondary text-sm">
          Ingresa tu correo y te enviaremos un enlace para restablecerla
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm text-text-secondary">
            Correo electronico
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@correo.com"
            required
            autoComplete="email"
            className="w-full px-4 py-2.5 rounded-lg bg-surface border border-white/10 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-primary text-background font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Enviando...' : 'Enviar enlace de recuperacion'}
        </button>
      </form>

      <div className="text-center">
        <Link
          href="/login"
          className="text-sm text-text-muted hover:text-text-secondary transition-colors"
        >
          Volver al inicio de sesion
        </Link>
      </div>
    </div>
  );
}
