"use client";

import { useState, useEffect } from "react";

interface InlineEditProps {
  value: string;
  onSave: (newValue: string) => Promise<void>;
  field: string;
  multiline?: boolean;
  className?: string;
  editMode: boolean;
}

export default function InlineEdit({
  value,
  onSave,
  field,
  multiline = false,
  className = "",
  editMode,
}: InlineEditProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [tempValue, setTempValue] = useState(value);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setTempValue(value);
  }, [value]);

  const handleSave = async () => {
    if (tempValue !== value) {
      setIsSaving(true);
      try {
        await onSave(tempValue);
      } catch (error) {
        console.error("Error saving:", error);
        setTempValue(value); // Revert on error
      }
      setIsSaving(false);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTempValue(value);
    setIsEditing(false);
  };

  if (!editMode) {
    return <span className={className} dangerouslySetInnerHTML={{ __html: value }} />;
  }

  if (isEditing) {
    return (
      <div className="relative inline-block w-full">
        {multiline ? (
          <textarea
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className={`${className} w-full min-h-[100px] p-2 bg-background/50 border-2 border-mint rounded focus:outline-none focus:border-mint/80`}
            autoFocus
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                e.preventDefault();
                handleCancel();
              }
              if (e.key === "Enter" && e.metaKey) {
                e.preventDefault();
                handleSave();
              }
            }}
          />
        ) : (
          <input
            type="text"
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            className={`${className} w-full p-2 bg-background/50 border-2 border-mint rounded focus:outline-none focus:border-mint/80`}
            autoFocus
            onBlur={handleSave}
            onKeyDown={(e) => {
              if (e.key === "Escape") handleCancel();
              if (e.key === "Enter") handleSave();
            }}
          />
        )}
        {isSaving && (
          <div className="absolute -top-6 right-0 text-xs text-mint">Guardando...</div>
        )}
        <div className="text-xs text-text-muted mt-1">
          {multiline ? "⌘+Enter para guardar, Esc para cancelar" : "Enter para guardar, Esc para cancelar"}
        </div>
      </div>
    );
  }

  return (
    <span
      onClick={() => setIsEditing(true)}
      className={`${className} ${editMode ? "cursor-pointer hover:bg-mint/10 hover:outline hover:outline-2 hover:outline-mint/30 rounded px-1 transition-all" : ""}`}
      title={editMode ? `Click para editar: ${field}` : ""}
      dangerouslySetInnerHTML={{ __html: value }}
    />
  );
}
