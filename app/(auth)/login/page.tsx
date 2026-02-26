'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@/lib/supabase/client';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const supabase = createBrowserClient();

      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        if (signInError.message === 'Invalid login credentials') {
          setError('Credenciales incorrectas. Verifica tu correo y contrasena.');
        } else {
          setError(signInError.message);
        }
        setLoading(false);
        return;
      }

      if (!data.user) {
        setError('Error al iniciar sesion. Intenta de nuevo.');
        setLoading(false);
        return;
      }

      // Determine redirect based on role
      const role = data.user.app_metadata?.role;

      if (redirectTo) {
        router.push(redirectTo);
      } else if (role === 'admin') {
        router.push('/admin');
      } else {
        // For clients, try to find their first project slug
        const { data: membership } = await supabase
          .from('project_members')
          .select('project_id, projects(slug)')
          .eq('profile_id', data.user.id)
          .limit(1)
          .single();

        const projects = membership?.projects as unknown as { slug: string } | null;
        const slug = projects?.slug;

        if (slug) {
          router.push(`/portal/${slug}`);
        } else {
          // Fallback: client with no projects yet
          router.push('/portal');
        }
      }

      router.refresh();
    } catch {
      setError('Error inesperado. Intenta de nuevo.');
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-semibold text-text-primary">
          Iniciar sesion
        </h1>
        <p className="text-text-secondary text-sm">
          Ingresa a tu cuenta para acceder al panel
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm text-text-secondary"
          >
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

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm text-text-secondary"
          >
            Contrasena
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Tu contrasena"
            required
            autoComplete="current-password"
            className="w-full px-4 py-2.5 rounded-lg bg-surface border border-white/10 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-primary text-background font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Ingresando...' : 'Ingresar'}
        </button>
      </form>

      <div className="text-center">
        <Link
          href="/forgot-password"
          className="text-sm text-text-muted hover:text-text-secondary transition-colors"
        >
          Olvidaste tu contrasena?
        </Link>
      </div>
    </div>
  );
}
