'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  // Capture hash fragment IMMEDIATELY before Supabase client auto-consumes it
  const [initialHash] = useState(() => {
    if (typeof window === 'undefined') return '';
    return window.location.hash.substring(1);
  });

  useEffect(() => {
    async function handleCallback() {
      const supabase = createBrowserClient();

      // Parse the initial hash that we captured before Supabase consumed it
      const hashParams = new URLSearchParams(initialHash);
      const hashType = hashParams.get('type') ?? '';
      const hashAccessToken = hashParams.get('access_token');
      const hashRefreshToken = hashParams.get('refresh_token');

      // Also check query params
      const code = searchParams.get('code');
      const tokenHash = searchParams.get('token_hash');
      const queryType = searchParams.get('type') ?? '';

      // Determine the auth type from wherever we can find it
      const type = queryType || hashType;

      // --- Flow 1: PKCE (code in query params) ---
      if (code) {
        const { error: err } = await supabase.auth.exchangeCodeForSession(code);
        if (err) {
          setError('El enlace ha expirado o ya fue usado.');
          return;
        }
      }

      // --- Flow 2: Token hash in query params ---
      if (tokenHash) {
        const { error: err } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: (type || 'invite') as 'invite' | 'recovery' | 'email',
        });
        if (err) {
          setError('El enlace ha expirado o ya fue usado.');
          return;
        }
      }

      // --- Flow 3: Implicit (hash fragment) ---
      // If Supabase didn't auto-process it, do it manually
      if (!code && !tokenHash && hashAccessToken && hashRefreshToken) {
        const { error: err } = await supabase.auth.setSession({
          access_token: hashAccessToken,
          refresh_token: hashRefreshToken,
        });
        if (err) {
          setError('El enlace ha expirado o ya fue usado.');
          return;
        }
      }

      // Wait briefly for Supabase auto-detection if none of the above matched
      if (!code && !tokenHash && !hashAccessToken) {
        await new Promise((r) => setTimeout(r, 1000));
      }

      // Verify session exists
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('El enlace ha expirado o ya fue usado. Solicita uno nuevo.');
        return;
      }

      // Redirect based on type
      if (type === 'invite' || type === 'signup' || type === 'magiclink') {
        router.replace('/reset-password?invite=true');
      } else if (type === 'recovery') {
        router.replace('/reset-password');
      } else {
        // Fallback: check user metadata
        const { data: { user } } = await supabase.auth.getUser();
        if (user?.invited_at) {
          router.replace('/reset-password?invite=true');
        } else {
          router.replace('/login?message=' + encodeURIComponent('Sesion verificada'));
        }
      }
    }

    handleCallback();
  }, [router, searchParams, initialHash]);

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="w-full max-w-sm space-y-6 text-center">
          <div className="w-12 h-12 rounded-full bg-coral/10 border border-coral/20 flex items-center justify-center mx-auto">
            <svg className="w-6 h-6 text-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-semibold text-text-primary">Enlace invalido</h1>
            <p className="text-sm text-text-secondary">{error}</p>
          </div>
          <a
            href="/login"
            className="inline-block px-6 py-2.5 rounded-lg bg-primary text-background text-sm font-medium hover:bg-primary/90 transition-colors"
          >
            Ir al inicio de sesion
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-text-secondary">Verificando...</p>
      </div>
    </div>
  );
}
