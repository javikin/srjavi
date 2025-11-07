'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to home after a brief delay
    const timeout = setTimeout(() => {
      router.push('/');
    }, 100);

    return () => clearTimeout(timeout);
  }, [router]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center">
        <p className="text-text-secondary">Redirecting to home...</p>
      </div>
    </div>
  );
}
