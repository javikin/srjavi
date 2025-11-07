'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PasswordProtectProps {
  children: React.ReactNode;
}

export default function PasswordProtect({ children }: PasswordProtectProps) {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If no password is set, skip authentication
    const sitePassword = process.env.NEXT_PUBLIC_SITE_PASSWORD;
    if (!sitePassword || sitePassword.trim() === '') {
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }

    // Check if user is already authenticated
    const auth = sessionStorage.getItem('site_authenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const correctPassword = process.env.NEXT_PUBLIC_SITE_PASSWORD?.trim();

    console.log('Entered password:', password);
    console.log('Correct password:', correctPassword);
    console.log('Match:', password.trim() === correctPassword);

    if (password.trim() === correctPassword) {
      setIsAuthenticated(true);
      sessionStorage.setItem('site_authenticated', 'true');
      setError(false);
    } else {
      setError(true);
      setPassword('');
    }
  };

  if (isLoading) {
    return null; // Or a loading spinner
  }

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
      {/* Background gradient orbs */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-mint/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative max-w-md w-full mx-6 p-8 bg-surface/80 backdrop-blur-xl rounded-2xl border border-text-primary/10 shadow-2xl"
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold text-text-primary mb-2">Welcome</h1>
          <p className="text-text-secondary">Enter password to continue</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
          >
            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                setError(false);
              }}
              placeholder="Enter password"
              className="w-full px-4 py-3 bg-background border border-text-primary/20 rounded-lg text-text-primary placeholder-text-muted focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/20 transition-all"
              autoFocus
            />
          </motion.div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="text-red-400 text-sm text-center"
              >
                Incorrect password. Please try again.
              </motion.p>
            )}
          </AnimatePresence>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300"
          >
            Enter
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}
