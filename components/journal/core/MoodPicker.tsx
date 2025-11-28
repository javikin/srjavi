'use client';

import { motion } from 'framer-motion';
import type { Mood } from '@/lib/journal/types';
import { MOOD_COLORS, MOOD_EMOJIS, MOOD_LABELS } from '@/lib/journal/utils';

interface MoodPickerProps {
  selected?: Mood;
  onChange: (mood: Mood) => void;
}

const moods: Mood[] = [
  'happy',
  'excited',
  'calm',
  'reflective',
  'grateful',
  'sad',
  'energetic',
  'creative',
];

export default function MoodPicker({ selected, onChange }: MoodPickerProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-text-secondary">
        How are you feeling?
      </label>

      <div className="grid grid-cols-4 gap-3">
        {moods.map((mood) => {
          const isSelected = selected === mood;

          return (
            <motion.button
              key={mood}
              type="button"
              onClick={() => onChange(mood)}
              className="relative flex flex-col items-center justify-center p-4 rounded-2xl bg-surface border-2 transition-all"
              style={{
                borderColor: isSelected
                  ? MOOD_COLORS[mood]
                  : 'rgba(255, 255, 255, 0.1)',
                backgroundColor: isSelected
                  ? `${MOOD_COLORS[mood]}15`
                  : 'rgba(255, 255, 255, 0.03)',
              }}
              whileHover={{
                scale: 1.05,
                borderColor: MOOD_COLORS[mood],
              }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: isSelected
                  ? `0 0 20px ${MOOD_COLORS[mood]}40`
                  : '0 0 0px transparent',
              }}
            >
              {/* Emoji */}
              <span className="text-3xl mb-1">{MOOD_EMOJIS[mood]}</span>

              {/* Label */}
              <span
                className="text-xs font-medium capitalize"
                style={{
                  color: isSelected ? MOOD_COLORS[mood] : '#999',
                }}
              >
                {MOOD_LABELS[mood]}
              </span>

              {/* Selected indicator */}
              {isSelected && (
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 rounded-full"
                  style={{ backgroundColor: MOOD_COLORS[mood] }}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 15 }}
                >
                  <svg
                    className="w-3 h-3 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </motion.div>
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Clear selection */}
      {selected && (
        <motion.button
          type="button"
          onClick={() => onChange(undefined as any)}
          className="text-xs text-text-muted hover:text-text-secondary transition-colors"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          Clear mood
        </motion.button>
      )}
    </div>
  );
}
