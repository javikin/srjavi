/**
 * AudioRecorder — inline voice-note recorder for the dark-themed client portal.
 *
 * Clients can record voice notes to describe bugs or features instead of typing.
 *
 * Usage:
 *   <AudioRecorder
 *     onRecordingComplete={(file) => console.log(file.name, file.size)}
 *     maxDurationSeconds={120}
 *   />
 *
 * States:
 *   idle      → mic button + "Grabar nota de voz"
 *   recording → pulsing red dot, MM:SS counter, "Detener" button
 *   error     → coral-colored message explaining the problem
 */

'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

type RecorderState = 'idle' | 'recording' | 'error';

export interface AudioRecorderProps {
  onRecordingComplete: (file: File) => void;
  disabled?: boolean;
  maxDurationSeconds?: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatTime(seconds: number): string {
  const mm = Math.floor(seconds / 60).toString().padStart(2, '0');
  const ss = (seconds % 60).toString().padStart(2, '0');
  return `${mm}:${ss}`;
}

function isMediaRecorderSupported(): boolean {
  return (
    typeof window !== 'undefined' &&
    typeof navigator !== 'undefined' &&
    typeof navigator.mediaDevices !== 'undefined' &&
    typeof MediaRecorder !== 'undefined'
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function MicIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"
      />
    </svg>
  );
}

function StopIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="currentColor"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <rect x="5" y="5" width="14" height="14" rx="2" />
    </svg>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AudioRecorder({
  onRecordingComplete,
  disabled = false,
  maxDurationSeconds = 120,
}: AudioRecorderProps) {
  const [state, setRecorderState] = useState<RecorderState>('idle');
  const [elapsed, setElapsed] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoStopRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Cleanup helpers ──────────────────────────────────────────────────────

  const clearTimers = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (autoStopRef.current !== null) {
      clearTimeout(autoStopRef.current);
      autoStopRef.current = null;
    }
  }, []);

  const releaseStream = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  }, []);

  // ── Stop recording ───────────────────────────────────────────────────────

  const stopRecording = useCallback(() => {
    clearTimers();

    const recorder = mediaRecorderRef.current;
    if (recorder && recorder.state !== 'inactive') {
      recorder.stop();
    }
  }, [clearTimers]);

  // ── Start recording ──────────────────────────────────────────────────────

  const startRecording = useCallback(async () => {
    if (!isMediaRecorderSupported()) {
      setErrorMessage(
        'Tu navegador no soporta la grabación de audio. Prueba con Chrome o Firefox.'
      );
      setRecorderState('error');
      return;
    }

    setErrorMessage('');
    chunksRef.current = [];

    let stream: MediaStream;
    try {
      stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
      const isDenied =
        err instanceof DOMException &&
        (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError');

      setErrorMessage(
        isDenied
          ? 'No se pudo acceder al micrófono. Verifica los permisos del navegador.'
          : 'No se pudo iniciar la grabación. Comprueba que tu micrófono esté conectado.'
      );
      setRecorderState('error');
      return;
    }

    streamRef.current = stream;

    // Prefer webm/opus; fall back to browser default
    const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus')
      ? 'audio/webm;codecs=opus'
      : MediaRecorder.isTypeSupported('audio/webm')
      ? 'audio/webm'
      : '';

    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    mediaRecorderRef.current = recorder;

    recorder.ondataavailable = (event: BlobEvent) => {
      if (event.data && event.data.size > 0) {
        chunksRef.current.push(event.data);
      }
    };

    recorder.onstop = () => {
      releaseStream();

      const blob = new Blob(chunksRef.current, {
        type: recorder.mimeType || 'audio/webm',
      });

      const extension = (recorder.mimeType || 'audio/webm').includes('ogg')
        ? 'ogg'
        : 'webm';
      const timestamp = Date.now();
      const file = new File([blob], `nota-de-voz-${timestamp}.${extension}`, {
        type: blob.type,
        lastModified: timestamp,
      });

      setRecorderState('idle');
      setElapsed(0);
      onRecordingComplete(file);
    };

    recorder.onerror = () => {
      clearTimers();
      releaseStream();
      setErrorMessage('Ocurrió un error durante la grabación.');
      setRecorderState('error');
    };

    recorder.start(250); // collect chunks every 250ms
    setRecorderState('recording');
    setElapsed(0);

    // Tick counter every second
    intervalRef.current = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);

    // Auto-stop at maxDurationSeconds
    autoStopRef.current = setTimeout(() => {
      stopRecording();
    }, maxDurationSeconds * 1000);
  }, [maxDurationSeconds, onRecordingComplete, clearTimers, releaseStream, stopRecording]);

  // ── Dismiss error ────────────────────────────────────────────────────────

  const dismissError = useCallback(() => {
    setRecorderState('idle');
    setErrorMessage('');
  }, []);

  // ── Cleanup on unmount ───────────────────────────────────────────────────

  useEffect(() => {
    return () => {
      clearTimers();
      if (
        mediaRecorderRef.current &&
        mediaRecorderRef.current.state !== 'inactive'
      ) {
        mediaRecorderRef.current.stop();
      }
      releaseStream();
    };
  }, [clearTimers, releaseStream]);

  // ─── Render ────────────────────────────────────────────────────────────────

  // Error state
  if (state === 'error') {
    return (
      <div
        role="alert"
        className="flex items-start gap-3 px-4 py-2.5 rounded-lg bg-coral/5 border border-coral/20"
      >
        {/* Warning icon */}
        <svg
          className="w-4 h-4 text-coral shrink-0 mt-0.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
          />
        </svg>

        <p className="text-sm text-coral leading-snug flex-1">{errorMessage}</p>

        {/* Dismiss */}
        <button
          type="button"
          onClick={dismissError}
          className="shrink-0 text-coral/60 hover:text-coral transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-coral rounded"
          aria-label="Cerrar mensaje de error"
        >
          <svg
            className="w-4 h-4"
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
      </div>
    );
  }

  // Recording state
  if (state === 'recording') {
    return (
      <div
        className="inline-flex items-center gap-3 px-4 py-2.5 rounded-lg border border-coral/30 bg-white/[0.02]"
        role="status"
        aria-live="polite"
        aria-label={`Grabando. Tiempo transcurrido: ${formatTime(elapsed)}`}
      >
        {/* Pulsing red dot */}
        <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-coral opacity-60" />
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-coral" />
        </span>

        {/* Elapsed time */}
        <span
          className="text-sm font-medium text-coral tabular-nums min-w-[3rem]"
          aria-hidden="true"
        >
          {formatTime(elapsed)}
        </span>

        {/* Max duration hint */}
        <span className="text-xs text-text-muted hidden sm:inline" aria-hidden="true">
          / {formatTime(maxDurationSeconds)}
        </span>

        {/* Stop button */}
        <button
          type="button"
          onClick={stopRecording}
          className="ml-1 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-coral/10 border border-coral/20 text-coral text-xs font-medium hover:bg-coral/20 hover:border-coral/35 transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-coral"
          aria-label="Detener grabación"
        >
          <StopIcon className="w-3 h-3" />
          Detener
        </button>
      </div>
    );
  }

  // Idle state
  return (
    <button
      type="button"
      onClick={startRecording}
      disabled={disabled}
      className={[
        'inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm transition-colors',
        'focus:outline-none focus-visible:ring-1 focus-visible:ring-primary/60',
        disabled
          ? 'opacity-40 cursor-not-allowed bg-white/[0.02] border-white/8 text-text-muted'
          : 'bg-white/[0.02] border-white/8 text-text-secondary hover:bg-white/[0.05] hover:border-white/15 hover:text-text-primary cursor-pointer',
      ].join(' ')}
      aria-label="Grabar nota de voz"
    >
      <MicIcon className="w-4 h-4 shrink-0" />
      <span>Grabar nota de voz</span>
    </button>
  );
}
