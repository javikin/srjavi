"use client";

import { useState } from "react";

export default function TinaEditButton() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const correctPassword = "srjavi"; // Puedes cambiar esto

  const handleOpenAdmin = () => {
    if (!showPassword) {
      setShowPassword(true);
      return;
    }

    if (password === correctPassword) {
      // Abrir Tina admin en nueva ventana
      window.open('/admin/index.html#/collections/post/dos-anos.json', '_blank');
      setShowPassword(false);
      setPassword("");
    }
  };

  if (showPassword) {
    return (
      <div className="fixed top-4 right-4 z-50 bg-surface p-4 rounded-lg shadow-lg border border-white/20">
        <div className="flex flex-col gap-2">
          <p className="text-sm text-text-secondary mb-2">Enter password to edit:</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="px-3 py-2 bg-background border border-white/10 rounded text-text-primary focus:outline-none focus:border-mint"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleOpenAdmin();
            }}
            autoFocus
          />
          <div className="flex gap-2">
            <button
              onClick={handleOpenAdmin}
              className="px-4 py-2 bg-mint text-background rounded hover:bg-mint/80 transition-colors text-sm font-medium"
            >
              Open Editor
            </button>
            <button
              onClick={() => {
                setShowPassword(false);
                setPassword("");
              }}
              className="px-4 py-2 bg-surface border border-white/10 text-text-secondary rounded hover:bg-white/5 transition-colors text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <button
      onClick={handleOpenAdmin}
      className="fixed top-4 right-4 z-50 px-4 py-2 rounded-full font-medium transition-all shadow-lg bg-surface border border-white/20 text-text-primary hover:bg-white/5"
      title="Edit this page"
    >
      ✏️ Edit
    </button>
  );
}
