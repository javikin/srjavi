"use client";

import { useState, useCallback } from "react";
import { useTina } from "tinacms/dist/react";
import BlogPostEditable from "@/components/journal/BlogPostEditable";
import { tinaToBlogPost } from "@/lib/tina-adapter";

export default function ClientPage(props: any) {
  const [editMode, setEditMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [localData, setLocalData] = useState<any>(null);

  // Pass our data through the "useTina" hook to make it editable
  const { data } = useTina({
    query: props.query,
    variables: props.variables,
    data: props.data,
  });

  // Use localData if available, otherwise use data from Tina
  const currentData = localData || data.post;
  const content = tinaToBlogPost(currentData);

  const handleUpdate = useCallback(async (field: string, value: string) => {
    console.log("Updating field:", field, "with value:", value);

    try {
      const response = await fetch('/api/tina/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file: 'dos-anos.json',
          field,
          value,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save');
      }

      // Update local state to reflect changes immediately
      setLocalData((prev: any) => {
        const current = prev || data.post;
        const newData = JSON.parse(JSON.stringify(current)); // Deep clone

        // Navigate to the field and update it
        const parts = field.split('.');
        let obj = newData;
        for (let i = 0; i < parts.length - 1; i++) {
          if (!obj[parts[i]]) obj[parts[i]] = {};
          obj = obj[parts[i]];
        }
        obj[parts[parts.length - 1]] = value;

        return newData;
      });
    } catch (error) {
      console.error('Error saving:', error);
      throw error;
    }
  }, [data.post]);

  const handleToggleEditMode = () => {
    if (!editMode && !showPassword) {
      setShowPassword(true);
      return;
    }

    if (showPassword && password === "srjavi") {
      setEditMode(true);
      setShowPassword(false);
      setPassword("");
    } else if (editMode) {
      setEditMode(false);
    }
  };

  return (
    <>
      {/* Edit Mode Toggle Button */}
      {showPassword ? (
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
                if (e.key === "Enter") handleToggleEditMode();
              }}
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={handleToggleEditMode}
                className="px-4 py-2 bg-mint text-background rounded hover:bg-mint/80 transition-colors text-sm font-medium"
              >
                Activate Edit Mode
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
      ) : (
        <button
          onClick={handleToggleEditMode}
          className={`fixed top-4 right-4 z-50 px-4 py-2 rounded-full font-medium transition-all shadow-lg ${
            editMode
              ? "bg-mint text-background hover:bg-mint/80 animate-pulse"
              : "bg-surface border border-white/20 text-text-primary hover:bg-white/5"
          }`}
          title={editMode ? "Haz clic en los textos para editarlos" : "Activar modo de edición"}
        >
          {editMode ? "✏️ Editando" : "👁️ Ver"}
        </button>
      )}

      <BlogPostEditable
        content={content}
        backLabel="Volver al Journal"
        editMode={editMode}
        onUpdate={handleUpdate}
      />
    </>
  );
}
