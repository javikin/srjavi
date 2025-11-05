'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PasswordGate({ children }: { children: React.ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Password from environment variable or default
  const correctPassword = process.env.NEXT_PUBLIC_SITE_PASSWORD || 'javi2025';

  useEffect(() => {
    // Check if already unlocked in this session
    const unlocked = sessionStorage.getItem('site_unlocked');
    if (unlocked === 'true') {
      setIsUnlocked(true);
    }
    setIsLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === correctPassword) {
      sessionStorage.setItem('site_unlocked', 'true');
      setIsUnlocked(true);
      setError('');
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  // Show loading state briefly
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

  // If unlocked, show content
  if (isUnlocked) {
    return <>{children}</>;
  }

  // Password gate UI
  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-1/4 -left-40 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 -right-40 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '-2s' }} />

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="relative z-10 max-w-md w-full mx-4"
        >
          <div className="bg-surface border border-text-primary/10 rounded-3xl p-8 md:p-12 backdrop-blur-xl">
            {/* Logo/Brand */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-text-primary mb-2">Javi</h1>
              <p className="text-text-secondary text-sm">Portfolio Access</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-text-primary mb-2">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-background border border-text-primary/20 rounded-xl text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary transition-colors"
                  placeholder="Enter password"
                  autoFocus
                  autoComplete="off"
                />
              </div>

              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-red-400 text-sm"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Submit button */}
              <button
                type="submit"
                className="w-full px-8 py-4 rounded-full bg-gradient-to-r from-primary to-secondary text-white font-medium hover:shadow-2xl hover:shadow-primary/50 transition-all duration-300"
              >
                Enter
              </button>
            </form>

            {/* Hint */}
            <p className="text-center text-text-secondary text-xs mt-6">
              This portfolio is password-protected
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
