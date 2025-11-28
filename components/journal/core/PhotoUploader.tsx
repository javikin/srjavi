'use client';

import { useCallback, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { nanoid } from 'nanoid';
import type { Photo } from '@/lib/journal/types';

interface PhotoUploaderProps {
  photos: Photo[];
  onChange: (photos: Photo[]) => void;
  maxPhotos?: number;
}

export default function PhotoUploader({
  photos,
  onChange,
  maxPhotos = 10,
}: PhotoUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files) return;

      const remainingSlots = maxPhotos - photos.length;
      const filesToProcess = Array.from(files).slice(0, remainingSlots);

      filesToProcess.forEach((file) => {
        if (!file.type.startsWith('image/')) return;

        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          const newPhoto: Photo = {
            id: nanoid(),
            url: dataUrl,
            dataUrl,
          };

          onChange([...photos, newPhoto]);
        };
        reader.readAsDataURL(file);
      });
    },
    [photos, maxPhotos, onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const removePhoto = useCallback(
    (id: string) => {
      onChange(photos.filter((p) => p.id !== id));
    },
    [photos, onChange]
  );

  const canAddMore = photos.length < maxPhotos;

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium text-text-secondary">
        Photos
        <span className="text-xs text-text-muted ml-2">
          ({photos.length}/{maxPhotos})
        </span>
      </label>

      {/* Photo Grid */}
      {photos.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <AnimatePresence>
            {photos.map((photo, index) => (
              <motion.div
                key={photo.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="relative aspect-square rounded-xl overflow-hidden bg-surface group"
              >
                <Image
                  src={photo.dataUrl || photo.url}
                  alt={`Photo ${index + 1}`}
                  fill
                  className="object-cover"
                />

                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removePhoto(photo.id)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/70 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center hover:bg-black/90"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                {/* First photo indicator */}
                {index === 0 && (
                  <div className="absolute bottom-2 left-2 px-2 py-1 rounded-full bg-black/70 text-white text-xs">
                    Cover
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Upload Area */}
      {canAddMore && (
        <motion.div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className="relative"
          animate={{
            scale: isDragging ? 1.02 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => handleFiles(e.target.files)}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
            id="photo-upload"
          />

          <label
            htmlFor="photo-upload"
            className="block rounded-2xl border-2 border-dashed transition-all cursor-pointer"
            style={{
              borderColor: isDragging
                ? 'rgba(52, 211, 153, 0.5)'
                : 'rgba(255, 255, 255, 0.1)',
              backgroundColor: isDragging
                ? 'rgba(52, 211, 153, 0.05)'
                : 'rgba(255, 255, 255, 0.02)',
            }}
          >
            <div className="flex flex-col items-center justify-center py-12 px-4">
              {/* Icon */}
              <motion.div
                animate={{
                  y: isDragging ? -5 : 0,
                }}
                transition={{ duration: 0.2 }}
              >
                <svg
                  className="w-12 h-12 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  style={{
                    color: isDragging
                      ? 'rgb(52, 211, 153)'
                      : 'rgba(255, 255, 255, 0.4)',
                  }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </motion.div>

              {/* Text */}
              <p className="text-sm font-medium text-text-secondary mb-1">
                {isDragging ? 'Drop photos here' : 'Click or drag photos'}
              </p>
              <p className="text-xs text-text-muted">
                Up to {maxPhotos - photos.length} more photos
              </p>
            </div>
          </label>
        </motion.div>
      )}
    </div>
  );
}
