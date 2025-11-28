'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useJournalStore } from '@/lib/journal/store';
import MoodPicker from '@/components/journal/core/MoodPicker';
import PhotoUploader from '@/components/journal/core/PhotoUploader';
import RichTextEditor from '@/components/journal/core/RichTextEditor';
import type { Mood, Photo } from '@/lib/journal/types';

export default function NewJournalEntryPage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const createEntry = useJournalStore((state) => state.createEntry);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState(null);
  const [mood, setMood] = useState<Mood | undefined>();
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [tags, setTags] = useState<string>('');
  const [location, setLocation] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!content) {
      alert('Please write something before saving');
      return;
    }

    setIsSaving(true);

    try {
      const tagsArray = tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);

      const entry = createEntry({
        title: title || undefined,
        content,
        mood,
        photos,
        tags: tagsArray,
        location: location
          ? {
              name: location,
              coordinates: undefined, // Will add GPS later
            }
          : undefined,
      });

      // Success! Navigate to the entry or home
      router.push('/journal');
    } catch (error) {
      console.error('Failed to save entry:', error);
      alert('Failed to save entry. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-text-secondary">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/10 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <motion.button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors"
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.95 }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span className="text-sm font-medium">Back</span>
            </motion.button>

            <motion.button
              onClick={handleSave}
              disabled={isSaving || !content}
              className="px-6 py-2 rounded-full font-medium transition-all"
              style={{
                backgroundColor: 'rgb(52, 211, 153)',
                color: '#000',
                opacity: isSaving || !content ? 0.5 : 1,
              }}
              whileHover={{ scale: !isSaving && content ? 1.05 : 1 }}
              whileTap={{ scale: !isSaving && content ? 0.95 : 1 }}
            >
              {isSaving ? 'Saving...' : 'Save Entry'}
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Title */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-text-secondary">
              Title <span className="text-text-muted">(optional)</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your entry a title..."
              className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-surface text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
            />
          </div>

          {/* Mood Picker */}
          <MoodPicker selected={mood} onChange={setMood} />

          {/* Rich Text Editor */}
          <RichTextEditor
            content={content}
            onChange={setContent}
            placeholder="What's on your mind? Start writing..."
          />

          {/* Photo Uploader */}
          <PhotoUploader photos={photos} onChange={setPhotos} maxPhotos={10} />

          {/* Location */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-text-secondary">
              Location <span className="text-text-muted">(optional)</span>
            </label>
            <div className="flex gap-3">
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Where are you writing from?"
                className="flex-1 px-4 py-3 rounded-2xl border border-white/10 bg-surface text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
              />
              <motion.button
                type="button"
                className="px-4 py-3 rounded-2xl border border-white/10 bg-surface hover:bg-white/5 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                title="Get current location"
              >
                <svg
                  className="w-5 h-5 text-text-secondary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </motion.button>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-text-secondary">
              Tags <span className="text-text-muted">(optional)</span>
            </label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="life, work, travel (comma-separated)"
              className="w-full px-4 py-3 rounded-2xl border border-white/10 bg-surface text-text-primary placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-accent/50 transition-all"
            />
            {tags && (
              <div className="flex flex-wrap gap-2 mt-2">
                {tags
                  .split(',')
                  .map((tag) => tag.trim())
                  .filter(Boolean)
                  .map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: 'rgba(52, 211, 153, 0.15)',
                        color: 'rgb(52, 211, 153)',
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
              </div>
            )}
          </div>

          {/* Metadata Preview */}
          <div className="rounded-2xl border border-white/10 bg-surface/50 p-4">
            <div className="flex items-center justify-between text-xs text-text-muted">
              <span>Entry preview</span>
              <span>{new Date().toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</span>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
