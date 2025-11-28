// Journal utilities

import type { Mood } from './types';

// Mood colors for visualization
export const MOOD_COLORS: Record<Mood, string> = {
  happy: '#FFD700', // Gold
  excited: '#FF4500', // Orange red
  calm: '#4A90E2', // Serene blue
  reflective: '#9B59B6', // Purple
  grateful: '#2ECC71', // Green
  sad: '#95A5A6', // Gray
  energetic: '#E74C3C', // Red
  creative: '#F39C12', // Orange
};

// Mood emojis
export const MOOD_EMOJIS: Record<Mood, string> = {
  happy: '😊',
  excited: '🤩',
  calm: '😌',
  reflective: '🤔',
  grateful: '🙏',
  sad: '😔',
  energetic: '⚡',
  creative: '🎨',
};

// Mood labels
export const MOOD_LABELS: Record<Mood, string> = {
  happy: 'Happy',
  excited: 'Excited',
  calm: 'Calm',
  reflective: 'Reflective',
  grateful: 'Grateful',
  sad: 'Sad',
  energetic: 'Energetic',
  creative: 'Creative',
};

// Get mood color
export function getMoodColor(mood?: Mood): string {
  if (!mood) return '#666666';
  return MOOD_COLORS[mood];
}

// Get mood emoji
export function getMoodEmoji(mood?: Mood): string {
  if (!mood) return '📝';
  return MOOD_EMOJIS[mood];
}

// Get mood label
export function getMoodLabel(mood?: Mood): string {
  if (!mood) return 'No mood';
  return MOOD_LABELS[mood];
}

// Format date
export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

// Format time
export function formatTime(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });
}

// Reading time estimate
export function getReadingTime(wordCount: number): string {
  const minutes = Math.ceil(wordCount / 200); // Average reading speed
  return `${minutes} min read`;
}
