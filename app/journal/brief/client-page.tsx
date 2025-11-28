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
      <BlogPostEditable
        content={content}
        backLabel="Volver al Journal"
        editMode={editMode}
        onUpdate={handleUpdate}
      />
    </>
  );
}
