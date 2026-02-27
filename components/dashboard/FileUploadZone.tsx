'use client';

/**
 * FileUploadZone — dark-themed file upload zone with three upload methods.
 *
 * Supports clipboard paste, drag & drop, and click-to-browse.
 * Includes image compression, preview grid, and inline validation errors.
 *
 * Usage:
 *   const [files, setFiles] = useState<File[]>([]);
 *   <FileUploadZone
 *     files={files}
 *     onFilesChange={setFiles}
 *     maxFiles={5}
 *     maxSizeMB={10}
 *     accept="image/*,audio/*,.pdf"
 *   />
 */

import { useCallback, useEffect, useRef, useState } from 'react';

// ---------------------------------------------------------------------------
// Props interface
// ---------------------------------------------------------------------------

export interface FileUploadZoneProps {
  files: File[];
  onFilesChange: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  accept?: string;
  disabled?: boolean;
}

// ---------------------------------------------------------------------------
// Internal helpers
// ---------------------------------------------------------------------------

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isImageFile(file: File): boolean {
  return file.type.startsWith('image/');
}

function isAudioFile(file: File): boolean {
  return file.type.startsWith('audio/');
}

function isPdfFile(file: File): boolean {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
}

/**
 * Compress an image file using the Canvas API.
 * Only compresses if the file is > 2 MB.
 * Resizes to max 2000 px wide, JPEG quality 0.85.
 */
async function compressImage(file: File): Promise<File> {
  const TWO_MB = 2 * 1024 * 1024;
  if (file.size <= TWO_MB) return file;

  return new Promise<File>((resolve) => {
    const img = new Image();
    const objectUrl = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(objectUrl);

      const MAX_WIDTH = 2000;
      let { width, height } = img;

      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width);
        width = MAX_WIDTH;
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(file);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            resolve(file);
            return;
          }
          const compressed = new File([blob], file.name, {
            type: 'image/jpeg',
            lastModified: Date.now(),
          });
          resolve(compressed);
        },
        'image/jpeg',
        0.85,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(file);
    };

    img.src = objectUrl;
  });
}

// ---------------------------------------------------------------------------
// Preview item sub-component
// ---------------------------------------------------------------------------

interface PreviewItemProps {
  file: File;
  previewUrl: string | null;
  onRemove: () => void;
  disabled: boolean;
}

function PreviewItem({ file, previewUrl, onRemove, disabled }: PreviewItemProps) {
  const isImage = isImageFile(file);
  const isAudio = isAudioFile(file);
  const isPdf = isPdfFile(file);

  return (
    <div className="relative group rounded-lg overflow-hidden border border-white/5 bg-[#121214]">
      {/* Thumbnail or icon */}
      {isImage && previewUrl ? (
        <div className="aspect-square w-full overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt={file.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      ) : (
        <div className="aspect-square w-full flex flex-col items-center justify-center gap-2 px-3">
          {isAudio ? (
            <svg
              className="w-8 h-8 text-[#8AD8C0] shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
              />
            </svg>
          ) : isPdf ? (
            <svg
              className="w-8 h-8 text-[#F39A8E] shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          ) : (
            <svg
              className="w-8 h-8 text-[#737373] shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
          )}

          <span className="text-[10px] text-[#737373] text-center leading-tight break-all line-clamp-2 w-full px-1">
            {file.name}
          </span>
        </div>
      )}

      {/* File size badge */}
      <div className="px-2 py-1.5 border-t border-white/5">
        <p className="text-[10px] text-[#737373] truncate" title={file.name}>
          {file.name}
        </p>
        <p className="text-[10px] text-[#A3A3A3] mt-0.5">{formatBytes(file.size)}</p>
      </div>

      {/* Remove button */}
      {!disabled && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/70 border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity hover:bg-[#F39A8E]/20 hover:border-[#F39A8E]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#F39A8E]/50"
          aria-label={`Eliminar ${file.name}`}
        >
          <svg
            className="w-3 h-3 text-[#F39A8E]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function FileUploadZone({
  files,
  onFilesChange,
  maxFiles = 5,
  maxSizeMB = 10,
  accept = 'image/*,audio/*,.pdf',
  disabled = false,
}: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Map from file object reference → blob URL for image previews
  const [previewUrls, setPreviewUrls] = useState<Map<File, string>>(new Map());

  const inputRef = useRef<HTMLInputElement>(null);
  const zoneRef = useRef<HTMLDivElement>(null);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ------------------------------------------------------------------
  // Preview URL management
  // ------------------------------------------------------------------

  // Revoke stale URLs and create new ones when `files` changes
  useEffect(() => {
    setPreviewUrls((prev) => {
      // Revoke URLs that belong to files no longer in the list
      prev.forEach((url, file) => {
        if (!files.includes(file)) {
          URL.revokeObjectURL(url);
        }
      });

      // Build a fresh map for current files
      const next = new Map<File, string>();
      files.forEach((file) => {
        if (isImageFile(file)) {
          // Re-use existing URL if the file object is the same reference
          const existing = prev.get(file);
          next.set(file, existing ?? URL.createObjectURL(file));
        }
      });
      return next;
    });
  }, [files]);

  // Revoke all URLs on unmount
  useEffect(() => {
    return () => {
      setPreviewUrls((prev) => {
        prev.forEach((url) => URL.revokeObjectURL(url));
        return new Map();
      });
    };
  }, []);

  // ------------------------------------------------------------------
  // Error management
  // ------------------------------------------------------------------

  function showError(message: string) {
    setError(message);
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    errorTimerRef.current = setTimeout(() => setError(null), 3000);
  }

  useEffect(() => {
    return () => {
      if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    };
  }, []);

  // ------------------------------------------------------------------
  // File processing pipeline
  // ------------------------------------------------------------------

  const processFiles = useCallback(
    async (incoming: FileList | File[]) => {
      if (disabled || isProcessing) return;

      const incomingArray = Array.from(incoming);
      if (incomingArray.length === 0) return;

      // Check total count
      const availableSlots = maxFiles - files.length;
      if (availableSlots <= 0) {
        showError(`Maximo ${maxFiles} archivos permitidos.`);
        return;
      }

      setIsProcessing(true);

      const accepted: File[] = [];
      const maxBytes = maxSizeMB * 1024 * 1024;

      // Build accepted MIME types / extensions from the `accept` prop
      const acceptParts = accept
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);

      function isAcceptedType(file: File): boolean {
        if (acceptParts.length === 0) return true;
        return acceptParts.some((part) => {
          if (part.endsWith('/*')) {
            const category = part.slice(0, -2);
            return file.type.startsWith(category + '/');
          }
          if (part.startsWith('.')) {
            return file.name.toLowerCase().endsWith(part);
          }
          return file.type === part;
        });
      }

      for (const file of incomingArray.slice(0, availableSlots)) {
        if (!isAcceptedType(file)) {
          showError(`Tipo de archivo no permitido: ${file.name}`);
          continue;
        }
        if (file.size > maxBytes) {
          showError(`"${file.name}" supera el limite de ${maxSizeMB} MB.`);
          continue;
        }

        // Compress images > 2 MB before adding
        const processed = isImageFile(file) ? await compressImage(file) : file;
        accepted.push(processed);
      }

      if (accepted.length > 0) {
        onFilesChange([...files, ...accepted]);
      }

      setIsProcessing(false);
    },
    [disabled, isProcessing, maxFiles, maxSizeMB, accept, files, onFilesChange],
  );

  // ------------------------------------------------------------------
  // Drag & drop handlers
  // ------------------------------------------------------------------

  function handleDragOver(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }

  function handleDragLeave(e: React.DragEvent<HTMLDivElement>) {
    // Only leave if the pointer truly left the zone (not a child element)
    if (!zoneRef.current?.contains(e.relatedTarget as Node)) {
      setIsDragging(false);
    }
  }

  function handleDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;
    processFiles(e.dataTransfer.files);
  }

  // ------------------------------------------------------------------
  // Click to browse handler
  // ------------------------------------------------------------------

  function handleZoneClick() {
    if (!disabled) inputRef.current?.click();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLDivElement>) {
    if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      inputRef.current?.click();
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      processFiles(e.target.files);
      // Reset so the same file can be re-selected after removal
      e.target.value = '';
    }
  }

  // ------------------------------------------------------------------
  // Clipboard paste handler
  // ------------------------------------------------------------------

  function handlePaste(e: React.ClipboardEvent<HTMLDivElement>) {
    if (disabled) return;
    const items = e.clipboardData?.items;
    if (!items) return;

    const pastedFiles: File[] = [];
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.kind === 'file') {
        const file = item.getAsFile();
        if (file) pastedFiles.push(file);
      }
    }

    if (pastedFiles.length > 0) {
      e.preventDefault();
      processFiles(pastedFiles);
    }
  }

  // ------------------------------------------------------------------
  // Remove a file
  // ------------------------------------------------------------------

  function removeFile(index: number) {
    const next = files.filter((_, i) => i !== index);
    onFilesChange(next);
  }

  // ------------------------------------------------------------------
  // Derived state
  // ------------------------------------------------------------------

  const hasFiles = files.length > 0;

  // ------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------

  return (
    <div className="flex flex-col gap-3">
      {/* Drop zone */}
      <div
        ref={zoneRef}
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-label="Zona de carga de archivos. Arrastra archivos, pega o haz clic para subir"
        aria-disabled={disabled}
        onClick={handleZoneClick}
        onKeyDown={handleKeyDown}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onPaste={handlePaste}
        className={[
          'relative flex flex-col items-center justify-center gap-3 rounded-xl px-6 py-8',
          'border-2 border-dashed transition-colors duration-200',
          'min-h-[160px] select-none',
          disabled
            ? 'opacity-50 cursor-not-allowed border-white/5'
            : 'cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8AD8C0]/40',
          isDragging && !disabled
            ? 'border-[#8AD8C0]/50 bg-[#8AD8C0]/5'
            : !disabled
              ? 'border-white/10 hover:border-white/20 bg-[#121214] hover:bg-white/[0.02]'
              : 'border-white/5 bg-[#121214]',
        ]
          .filter(Boolean)
          .join(' ')}
      >
        {/* Drag overlay text */}
        {isDragging && (
          <div className="absolute inset-0 flex items-center justify-center rounded-xl pointer-events-none">
            <span className="text-sm font-medium text-[#8AD8C0]">Soltar archivo aqui</span>
          </div>
        )}

        {/* Default empty-state content (hidden while dragging) */}
        {!isDragging && (
          <>
            {/* Upload icon */}
            <div className="flex items-center justify-center w-12 h-12 rounded-full bg-white/5" aria-hidden="true">
              <svg
                className="w-6 h-6 text-[#737373]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
                />
              </svg>
            </div>

            {/* Primary label */}
            <p className="text-sm text-center text-[#A3A3A3] leading-snug max-w-xs">
              Arrastra archivos aqui, pega una captura de pantalla, o{' '}
              <span className="text-[#8AD8C0] font-medium underline underline-offset-2">
                haz clic para subir
              </span>
            </p>

            {/* Constraints hint */}
            <p className="text-xs text-[#737373] text-center">
              Imagenes, PDFs y audio &middot; Max {maxFiles} archivos &middot; {maxSizeMB} MB por archivo
            </p>

            {/* Processing indicator */}
            {isProcessing && (
              <span className="text-xs text-[#8AD8C0] animate-pulse">Procesando...</span>
            )}
          </>
        )}

        {/* Hidden file input */}
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept}
          disabled={disabled}
          onChange={handleInputChange}
          className="sr-only"
          aria-hidden="true"
          tabIndex={-1}
        />
      </div>

      {/* Inline error */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-lg px-3 py-2 bg-[#F39A8E]/10 border border-[#F39A8E]/20 text-xs text-[#F39A8E]"
        >
          <svg
            className="w-3.5 h-3.5 mt-0.5 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Preview grid */}
      {hasFiles && (
        <div
          className="grid grid-cols-2 sm:grid-cols-3 gap-2"
          aria-label={`${files.length} archivo${files.length !== 1 ? 's' : ''} seleccionado${files.length !== 1 ? 's' : ''}`}
        >
          {files.map((file, index) => (
            <PreviewItem
              key={`${file.name}-${file.size}-${index}`}
              file={file}
              previewUrl={previewUrls.get(file) ?? null}
              onRemove={() => removeFile(index)}
              disabled={disabled}
            />
          ))}
        </div>
      )}
    </div>
  );
}
