// Journal Store - Temporary localStorage implementation
// Later: Replace with Supabase

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { nanoid } from 'nanoid';
import type { JournalEntry, CreateEntryInput, UpdateEntryInput } from './types';

interface JournalStore {
  entries: JournalEntry[];

  // Actions
  createEntry: (input: CreateEntryInput) => JournalEntry;
  updateEntry: (input: UpdateEntryInput) => JournalEntry | null;
  deleteEntry: (id: string) => void;
  getEntry: (id: string) => JournalEntry | undefined;
  getAllEntries: () => JournalEntry[];
  getEntriesByMood: (mood: string) => JournalEntry[];
  getEntriesByDate: (date: Date) => JournalEntry[];
}

// Helper: Extract text from TipTap JSON
function extractTextFromContent(content: any): string {
  if (!content) return '';

  let text = '';

  if (content.content && Array.isArray(content.content)) {
    content.content.forEach((node: any) => {
      if (node.type === 'text') {
        text += node.text;
      } else if (node.content) {
        text += extractTextFromContent(node);
      }
    });
  }

  return text;
}

// Helper: Count words
function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export const useJournalStore = create<JournalStore>()(
  persist(
    (set, get) => ({
      entries: [],

      createEntry: (input: CreateEntryInput) => {
        const now = new Date();
        const contentText = extractTextFromContent(input.content);
        const wordCount = countWords(contentText);
        const excerpt = contentText.slice(0, 200);

        const newEntry: JournalEntry = {
          id: nanoid(),
          createdAt: now,
          updatedAt: now,
          title: input.title,
          content: input.content,
          excerpt,
          photos: input.photos || [],
          coverPhoto: input.photos?.[0]?.url,
          mood: input.mood,
          tags: input.tags || [],
          location: input.location,
          wordCount,
          photoCount: input.photos?.length || 0,
        };

        set((state) => ({
          entries: [newEntry, ...state.entries],
        }));

        return newEntry;
      },

      updateEntry: (input: UpdateEntryInput) => {
        const entry = get().entries.find((e) => e.id === input.id);
        if (!entry) return null;

        const contentText = input.content
          ? extractTextFromContent(input.content)
          : extractTextFromContent(entry.content);

        const wordCount = countWords(contentText);
        const excerpt = contentText.slice(0, 200);

        const updatedEntry: JournalEntry = {
          ...entry,
          ...input,
          updatedAt: new Date(),
          excerpt,
          wordCount,
          photoCount: input.photos?.length ?? entry.photoCount,
          coverPhoto: input.photos?.[0]?.url ?? entry.coverPhoto,
        };

        set((state) => ({
          entries: state.entries.map((e) =>
            e.id === input.id ? updatedEntry : e
          ),
        }));

        return updatedEntry;
      },

      deleteEntry: (id: string) => {
        set((state) => ({
          entries: state.entries.filter((e) => e.id !== id),
        }));
      },

      getEntry: (id: string) => {
        return get().entries.find((e) => e.id === id);
      },

      getAllEntries: () => {
        return get().entries.sort(
          (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      },

      getEntriesByMood: (mood: string) => {
        return get().entries.filter((e) => e.mood === mood);
      },

      getEntriesByDate: (date: Date) => {
        return get().entries.filter((e) => {
          const entryDate = new Date(e.createdAt);
          return (
            entryDate.getDate() === date.getDate() &&
            entryDate.getMonth() === date.getMonth() &&
            entryDate.getFullYear() === date.getFullYear()
          );
        });
      },
    }),
    {
      name: 'journal-storage',
    }
  )
);
