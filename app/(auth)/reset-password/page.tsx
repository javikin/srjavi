'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isInvite = searchParams.get('invite') === 'true';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError('La contrasena debe tener al menos 8 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Las contrasenas no coinciden.');
      return;
    }

    setLoading(true);

    try {
      const supabase = createBrowserClient();
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) {
        setError(updateError.message);
        setLoading(false);
        return;
      }

      // Get user to determine where to redirect
      const { data: { user } } = await supabase.auth.getUser();
      const role = user?.app_metadata?.role;

      if (role === 'admin') {
        router.push('/admin');
      } else {
        // Find client's first project
        const { data: membership } = await supabase
          .from('project_members')
          .select('project_id, projects(slug)')
          .eq('profile_id', user!.id)
          .limit(1)
          .single();

        const projects = membership?.projects as unknown as { slug: string } | null;
        const slug = projects?.slug;
        router.push(slug ? `/portal/${slug}` : '/portal');
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
          {isInvite ? 'Configura tu contrasena' : 'Restablecer contrasena'}
        </h1>
        <p className="text-text-secondary text-sm">
          {isInvite
            ? 'Crea una contrasena para acceder al portal'
            : 'Ingresa tu nueva contrasena'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm text-text-secondary">
            {isInvite ? 'Contrasena' : 'Nueva contrasena'}
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Minimo 8 caracteres"
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full px-4 py-2.5 rounded-lg bg-surface border border-white/10 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="confirm" className="block text-sm text-text-secondary">
            Confirmar contrasena
          </label>
          <input
            id="confirm"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repite tu contrasena"
            required
            minLength={8}
            autoComplete="new-password"
            className="w-full px-4 py-2.5 rounded-lg bg-surface border border-white/10 text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 rounded-lg bg-primary text-background font-medium hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading
            ? 'Guardando...'
            : isInvite
              ? 'Activar mi cuenta'
              : 'Guardar contrasena'}
        </button>
      </form>
    </div>
  );
}
