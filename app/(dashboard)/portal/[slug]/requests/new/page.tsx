'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { createBrowserClient } from '@/lib/supabase/client';
import PageHeader from '@/components/dashboard/PageHeader';
import CreditBar from '@/components/dashboard/CreditBar';
import FileUploadZone from '@/components/dashboard/FileUploadZone';
import AudioRecorder from '@/components/dashboard/AudioRecorder';
import { useGemini } from '@/hooks/useGemini';

// ---------------------------------------------------------------------------
// Data definitions
// ---------------------------------------------------------------------------

const REQUEST_CATEGORIES = [
  {
    id: 'bug_fix',
    label: 'Bug fix',
    description: 'Error en codigo entregado por nosotros',
    cost: 0,
    type: 'bug' as const,
    costLabel: 'Gratis',
  },
  {
    id: 'feature_small',
    label: 'Feature pequena',
    description: 'Campo nuevo, ajuste de flujo, cambio visual',
    cost: 4,
    type: 'feature' as const,
    costLabel: null,
  },
  {
    id: 'feature_medium',
    label: 'Feature mediana',
    description: 'Nueva pantalla o modulo',
    cost: 10,
    type: 'feature' as const,
    costLabel: null,
  },
  {
    id: 'feature_large',
    label: 'Feature grande',
    description: 'Integracion, sistema complejo',
    cost: 20,
    type: 'feature' as const,
    costLabel: null,
  },
  {
    id: 'bug_external',
    label: 'Bug externo',
    description: 'Causado por cambios del cliente o APIs de terceros',
    cost: 3,
    type: 'bug' as const,
    costLabel: null,
  },
] as const;

type CategoryId = (typeof REQUEST_CATEGORIES)[number]['id'];

const PRIORITIES = [
  { value: 'low', label: 'Baja' },
  { value: 'medium', label: 'Media' },
  { value: 'high', label: 'Alta' },
  { value: 'critical', label: 'Critica' },
] as const;

type PriorityValue = (typeof PRIORITIES)[number]['value'];

// ---------------------------------------------------------------------------
// Draft type
// ---------------------------------------------------------------------------

interface DraftData {
  selectedCategory: CategoryId | null;
  title: string;
  description: string;
  priority: PriorityValue;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getDescriptionPlaceholder(categoryId: CategoryId | null): string {
  if (!categoryId) {
    return 'Selecciona un tipo de solicitud para ver sugerencias.';
  }
  const category = REQUEST_CATEGORIES.find((c) => c.id === categoryId);
  if (!category) return '';
  if (category.type === 'bug') {
    return 'Describe el error: ¿que esperabas que pasara? ¿Que paso en su lugar? Incluye pasos para reproducirlo.';
  }
  return 'Describe la funcionalidad que necesitas: ¿Que problema resuelve? ¿Como deberia funcionar?';
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface CategoryChipProps {
  category: (typeof REQUEST_CATEGORIES)[number];
  selected: boolean;
  onSelect: (id: CategoryId) => void;
}

function CategoryChip({ category, selected, onSelect }: CategoryChipProps) {
  const isFree = category.cost === 0;

  return (
    <button
      type="button"
      onClick={() => onSelect(category.id)}
      aria-pressed={selected}
      className={[
        'relative flex flex-col gap-1 w-full text-left px-4 py-3 rounded-xl border transition-all duration-150',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
        selected
          ? 'bg-primary/10 border-primary/50 shadow-[0_0_0_1px_rgba(138,216,192,0.2)]'
          : 'bg-white/[0.02] border-white/8 hover:bg-white/[0.05] hover:border-white/15',
      ].join(' ')}
    >
      {/* Cost badge */}
      <span
        className={[
          'absolute top-3 right-3 text-xs font-semibold tabular-nums',
          isFree ? 'text-[#8AD8C0]' : selected ? 'text-primary' : 'text-text-muted',
        ].join(' ')}
      >
        {isFree ? 'Gratis' : `${category.cost} cr`}
      </span>

      {/* Label */}
      <span
        className={[
          'text-sm font-medium pr-12',
          selected ? 'text-text-primary' : 'text-text-secondary',
        ].join(' ')}
      >
        {category.label}
      </span>

      {/* Description */}
      <span className="text-xs text-text-muted pr-12 leading-snug">
        {category.description}
      </span>
    </button>
  );
}

interface PriorityChipProps {
  priority: (typeof PRIORITIES)[number];
  selected: boolean;
  onSelect: (value: PriorityValue) => void;
}

function PriorityChip({ priority, selected, onSelect }: PriorityChipProps) {
  return (
    <button
      type="button"
      onClick={() => onSelect(priority.value)}
      aria-pressed={selected}
      className={[
        'px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-150',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
        selected
          ? 'bg-primary/10 border-primary/50 text-primary'
          : 'bg-white/[0.02] border-white/8 text-text-muted hover:bg-white/[0.05] hover:border-white/15 hover:text-text-secondary',
      ].join(' ')}
    >
      {priority.label}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Confirmation screen sub-component
// ---------------------------------------------------------------------------

interface ConfirmationScreenProps {
  title: string;
  estimatedCost: number | null;
  attachmentCount: number;
  slug: string;
  onSendAnother: () => void;
}

function ConfirmationScreen({
  title,
  estimatedCost,
  attachmentCount,
  slug,
  onSendAnother,
}: ConfirmationScreenProps) {
  const costLabel =
    estimatedCost === null || estimatedCost === 0
      ? 'Gratis'
      : `~${estimatedCost} creditos`;

  return (
    <div className="max-w-2xl">
      <div className="rounded-2xl bg-surface border border-white/5 px-8 py-12 flex flex-col items-center text-center gap-6">
        {/* Check icon */}
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#8AD8C0]/10 border border-[#8AD8C0]/20">
          <svg
            className="w-8 h-8 text-[#8AD8C0]"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>

        {/* Heading */}
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-text-primary">Solicitud enviada</h2>
          <p className="text-sm text-text-muted max-w-sm">
            Tu equipo la revisara pronto y te notificara cuando sea aprobada.
          </p>
        </div>

        {/* Details */}
        <div className="w-full max-w-sm rounded-xl bg-background border border-white/5 divide-y divide-white/5">
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-xs text-text-muted">Titulo</span>
            <span className="text-xs text-text-secondary font-medium text-right max-w-[60%] truncate">
              {title}
            </span>
          </div>
          <div className="flex items-center justify-between px-5 py-3">
            <span className="text-xs text-text-muted">Costo estimado</span>
            <span
              className={[
                'text-xs font-semibold tabular-nums',
                estimatedCost === 0 || estimatedCost === null
                  ? 'text-[#8AD8C0]'
                  : 'text-text-secondary',
              ].join(' ')}
            >
              {costLabel}
            </span>
          </div>
          {attachmentCount > 0 && (
            <div className="flex items-center justify-between px-5 py-3">
              <span className="text-xs text-text-muted">Adjuntos</span>
              <span className="text-xs text-text-secondary font-medium">
                {attachmentCount} {attachmentCount === 1 ? 'archivo' : 'archivos'}
              </span>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-sm">
          <Link
            href={`/portal/${slug}/requests`}
            className="w-full inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-primary text-background text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Ver solicitudes
          </Link>
          <button
            type="button"
            onClick={onSendAnother}
            className="w-full inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-white/10 text-sm text-text-secondary hover:bg-white/5 hover:text-text-primary hover:border-white/20 transition-colors"
          >
            Enviar otra
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

interface CreditData {
  quota: number;
  used: number;
}

type SubmitPhase = 'idle' | 'creating' | 'uploading' | 'done';

const DRAFT_KEY_PREFIX = 'draft_request_';

export default function NewRequestPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const slug = params.slug;
  const draftKey = `${DRAFT_KEY_PREFIX}${slug}`;

  // Project resolution
  const [projectId, setProjectId] = useState<string | null>(null);
  const [loadingProject, setLoadingProject] = useState(true);

  // Credits
  const [credits, setCredits] = useState<CreditData | null>(null);

  // Form state
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<PriorityValue>('medium');
  const [files, setFiles] = useState<File[]>([]);

  // Draft state
  const [hasDraft, setHasDraft] = useState(false);
  const [draftDismissed, setDraftDismissed] = useState(false);
  const draftDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // AI state
  const { generateText, loading: aiLoading } = useGemini();

  // Submit state
  const [submitPhase, setSubmitPhase] = useState<SubmitPhase>('idle');
  const [uploadProgress, setUploadProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState<string | null>(null);

  // Post-submission confirmation
  const [submittedRequest, setSubmittedRequest] = useState<{
    title: string;
    estimatedCost: number | null;
    attachmentCount: number;
  } | null>(null);

  const submitting = submitPhase === 'creating' || submitPhase === 'uploading';

  // ---------------------------------------------------------------------------
  // Data fetching
  // ---------------------------------------------------------------------------

  useEffect(() => {
    async function bootstrap() {
      const supabase = createBrowserClient();

      // Resolve slug to project ID
      const { data: project, error: projectError } = await supabase
        .from('projects')
        .select('id')
        .eq('slug', slug)
        .single();

      if (projectError || !project) {
        setError('No se encontro el proyecto. Verifica el enlace.');
        setLoadingProject(false);
        return;
      }

      setProjectId(project.id);

      // Fetch credit allocation for this project
      const { data: allocation } = await supabase
        .from('credit_allocations')
        .select('quota, used, period_start')
        .eq('project_id', project.id)
        .order('period_start', { ascending: false })
        .limit(1)
        .single();

      if (allocation) {
        setCredits({ quota: allocation.quota, used: allocation.used });
      }

      setLoadingProject(false);
    }

    bootstrap();
  }, [slug]);

  // ---------------------------------------------------------------------------
  // Draft recovery: check on mount
  // ---------------------------------------------------------------------------

  useEffect(() => {
    try {
      const raw = localStorage.getItem(draftKey);
      if (raw) {
        setHasDraft(true);
      }
    } catch {
      // localStorage may be unavailable in some contexts
    }
  }, [draftKey]);

  // ---------------------------------------------------------------------------
  // Auto-save draft with debounce
  // ---------------------------------------------------------------------------

  const saveDraft = useCallback(() => {
    if (draftDebounceRef.current) clearTimeout(draftDebounceRef.current);

    draftDebounceRef.current = setTimeout(() => {
      try {
        const draft: DraftData = {
          selectedCategory,
          title,
          description,
          priority,
        };
        localStorage.setItem(draftKey, JSON.stringify(draft));
      } catch {
        // Ignore serialization errors
      }
    }, 2000);
  }, [draftKey, selectedCategory, title, description, priority]);

  // Trigger save whenever form fields change (skip if already submitted)
  useEffect(() => {
    if (submittedRequest) return;
    // Only save if there's actual content to persist
    if (!selectedCategory && !title && description === '' && priority === 'medium') return;
    saveDraft();
  }, [selectedCategory, title, description, priority, saveDraft, submittedRequest]);

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (draftDebounceRef.current) clearTimeout(draftDebounceRef.current);
    };
  }, []);

  // ---------------------------------------------------------------------------
  // Draft handlers
  // ---------------------------------------------------------------------------

  function handleContinueDraft() {
    try {
      const raw = localStorage.getItem(draftKey);
      if (!raw) return;
      const draft: DraftData = JSON.parse(raw);
      if (draft.selectedCategory) setSelectedCategory(draft.selectedCategory);
      if (draft.title) setTitle(draft.title);
      if (draft.description) setDescription(draft.description);
      if (draft.priority) setPriority(draft.priority);
    } catch {
      // Malformed draft — ignore
    }
    setHasDraft(false);
    setDraftDismissed(true);
  }

  function handleDiscardDraft() {
    try {
      localStorage.removeItem(draftKey);
    } catch {
      // Ignore
    }
    setHasDraft(false);
    setDraftDismissed(true);
  }

  // ---------------------------------------------------------------------------
  // Reset form (used by "Enviar otra" button)
  // ---------------------------------------------------------------------------

  function resetForm() {
    setSelectedCategory(null);
    setTitle('');
    setDescription('');
    setPriority('medium');
    setFiles([]);
    setError(null);
    setSubmitPhase('idle');
    setSubmittedRequest(null);
    setUploadProgress({ current: 0, total: 0 });
  }

  // ---------------------------------------------------------------------------
  // AI description improvement
  // ---------------------------------------------------------------------------

  async function handleImproveDescription() {
    if (!selectedCategory || description.length < 20) return;

    const category = REQUEST_CATEGORIES.find((c) => c.id === selectedCategory);
    if (!category) return;

    const prompt = `Eres un asistente que ayuda a mejorar descripciones de tickets de soporte tecnico.

Tipo de solicitud: ${category.label} (${category.description})
Descripcion actual del usuario: "${description}"

Mejora la descripcion para que sea mas clara, estructurada y util para el equipo de desarrollo.
Si es un bug, organiza en: Pasos para reproducir, Resultado esperado, Resultado actual.
Si es una feature, organiza en: Problema que resuelve, Comportamiento deseado, Contexto adicional.

Mantén el tono del usuario. Responde SOLO con la descripcion mejorada, sin titulos ni explicaciones.
Responde en espanol.`;

    const result = await generateText(prompt);
    if (result) {
      setDescription(result.trim());
    }
  }

  // ---------------------------------------------------------------------------
  // Derived values
  // ---------------------------------------------------------------------------

  const activeCategory = selectedCategory
    ? REQUEST_CATEGORIES.find((c) => c.id === selectedCategory) ?? null
    : null;

  const estimatedCost = activeCategory?.cost ?? null;

  const availableCredits =
    credits !== null ? credits.quota - credits.used : null;

  const wouldExceedCredits =
    estimatedCost !== null &&
    estimatedCost > 0 &&
    availableCredits !== null &&
    estimatedCost > availableCredits;

  const descriptionPlaceholder = getDescriptionPlaceholder(selectedCategory);
  const canImproveWithAI = description.length >= 20 && !!selectedCategory;

  const submitLabel = (() => {
    if (submitPhase === 'creating') return 'Enviando solicitud...';
    if (submitPhase === 'uploading') {
      return `Subiendo archivos... (${uploadProgress.current}/${uploadProgress.total})`;
    }
    return null;
  })();

  // ---------------------------------------------------------------------------
  // Submit handler
  // ---------------------------------------------------------------------------

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!projectId || !selectedCategory) return;

    setSubmitting_phase('creating');
    setError(null);

    const category = REQUEST_CATEGORIES.find((c) => c.id === selectedCategory)!;

    let newRequestId: string | null = null;

    try {
      // Phase 1: Create the request
      const res = await fetch(`/api/projects/${projectId}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: category.type,
          title: title.trim(),
          description: description.trim(),
          priority_preference: priority,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? 'No se pudo enviar la solicitud. Intenta de nuevo.');
        setSubmitPhase('idle');
        return;
      }

      const { data: newRequest } = await res.json();
      newRequestId = newRequest.id;

      // Phase 2: Upload files if any
      if (files.length > 0 && newRequestId) {
        setSubmitPhase('uploading');
        setUploadProgress({ current: 0, total: files.length });

        const supabase = createBrowserClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          setUploadProgress({ current: i + 1, total: files.length });

          const filePath = `${user?.id ?? 'unknown'}/${newRequestId}/${Date.now()}-${file.name}`;

          const { error: uploadError } = await supabase.storage
            .from('request-attachments')
            .upload(filePath, file, { contentType: file.type, upsert: false });

          if (!uploadError) {
            // Register attachment in DB
            await fetch(`/api/requests/${newRequestId}/attachments`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                file_name: file.name,
                file_url: filePath,
                file_size: file.size,
                mime_type: file.type,
              }),
            });
          }
        }
      }

      // Clear draft on success
      try {
        localStorage.removeItem(draftKey);
      } catch {
        // Ignore
      }

      setSubmitPhase('done');
      setSubmittedRequest({
        title: title.trim(),
        estimatedCost,
        attachmentCount: files.length,
      });
    } catch {
      setError('Ocurrio un error inesperado. Intenta de nuevo.');
      setSubmitPhase('idle');
    }
  }

  // Helper to set submit phase (used inside handleSubmit to avoid variable name conflict)
  function setSubmitting_phase(phase: SubmitPhase) {
    setSubmitPhase(phase);
  }

  // ---------------------------------------------------------------------------
  // Render: loading state
  // ---------------------------------------------------------------------------

  if (loadingProject) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // Render: confirmation screen
  // ---------------------------------------------------------------------------

  if (submittedRequest) {
    return (
      <ConfirmationScreen
        title={submittedRequest.title}
        estimatedCost={submittedRequest.estimatedCost}
        attachmentCount={submittedRequest.attachmentCount}
        slug={slug}
        onSendAnother={resetForm}
      />
    );
  }

  // ---------------------------------------------------------------------------
  // Render: main form
  // ---------------------------------------------------------------------------

  return (
    <div className="max-w-2xl">
      {/* ------------------------------------------------------------------ */}
      {/* Draft recovery banner                                               */}
      {/* ------------------------------------------------------------------ */}
      {hasDraft && !draftDismissed && (
        <div className="mb-5 flex items-center justify-between gap-4 rounded-xl bg-surface border border-white/8 px-5 py-3.5">
          <div className="flex items-center gap-3 min-w-0">
            <svg
              className="w-4 h-4 text-primary shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
            <p className="text-sm text-text-secondary truncate">
              Tienes un borrador guardado
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleContinueDraft}
              className="text-xs font-medium text-primary hover:text-primary/80 transition-colors focus:outline-none focus-visible:underline"
            >
              Continuar
            </button>
            <span className="text-white/20 text-xs">|</span>
            <button
              type="button"
              onClick={handleDiscardDraft}
              className="text-xs text-text-muted hover:text-text-secondary transition-colors focus:outline-none focus-visible:underline"
            >
              Descartar
            </button>
          </div>
        </div>
      )}

      <PageHeader
        title="Nueva solicitud"
        description="Describe lo que necesitas y te lo haremos saber pronto."
      />

      <form onSubmit={handleSubmit} className="space-y-5">

        {/* ------------------------------------------------------------------ */}
        {/* Credit balance card                                                 */}
        {/* ------------------------------------------------------------------ */}
        {credits !== null && (
          <div className="rounded-xl bg-surface border border-white/5 px-5 py-4 space-y-3">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-medium text-text-secondary">
                Balance de creditos
              </span>
              <span className="text-sm font-semibold text-text-primary tabular-nums">
                <span className="text-primary">{availableCredits}</span>
                {' '}disponibles de{' '}
                {credits.quota}
              </span>
            </div>
            <CreditBar used={credits.used} quota={credits.quota} showLabel={false} size="md" />
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* Type selection chips                                                */}
        {/* ------------------------------------------------------------------ */}
        <div className="rounded-xl bg-surface border border-white/5 p-5 space-y-4">
          <div>
            <span className="text-sm font-medium text-text-secondary">
              Tipo de solicitud
            </span>
            <p className="mt-0.5 text-xs text-text-muted">
              El costo es referencial; el equipo lo confirma al aprobar.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {REQUEST_CATEGORIES.map((category) => (
              <CategoryChip
                key={category.id}
                category={category}
                selected={selectedCategory === category.id}
                onSelect={setSelectedCategory}
              />
            ))}
          </div>

          {/* Insufficient credits warning */}
          {wouldExceedCredits && (
            <div className="rounded-lg bg-[#F39A8E]/8 border border-[#F39A8E]/20 px-4 py-3 text-xs text-[#F39A8E] leading-relaxed">
              Esta solicitud requiere {estimatedCost} cr pero tienes {availableCredits} disponibles. Puedes enviarla de todas formas; el equipo la revisara.
            </div>
          )}
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Form fields                                                         */}
        {/* ------------------------------------------------------------------ */}
        <div className="rounded-xl bg-surface border border-white/5 p-6 space-y-5">

          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-text-secondary mb-1.5"
            >
              Titulo
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              maxLength={120}
              placeholder="Resumen breve de lo que necesitas"
              className="w-full px-3 py-2.5 rounded-lg bg-background border border-white/10 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
            />
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="description"
                className="text-sm font-medium text-text-secondary"
              >
                Descripcion
              </label>
              {canImproveWithAI && (
                <button
                  type="button"
                  onClick={handleImproveDescription}
                  disabled={aiLoading}
                  className="inline-flex items-center gap-1.5 text-xs text-primary/70 hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus-visible:underline"
                  aria-label="Mejorar descripcion con IA"
                >
                  {aiLoading ? (
                    <>
                      <div className="w-3 h-3 border border-primary/60 border-t-transparent rounded-full animate-spin" />
                      Mejorando...
                    </>
                  ) : (
                    <>
                      <svg
                        className="w-3 h-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                        />
                      </svg>
                      Mejorar con IA
                    </>
                  )}
                </button>
              )}
            </div>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={5}
              placeholder={descriptionPlaceholder}
              className="w-full px-3 py-2.5 rounded-lg bg-background border border-white/10 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors resize-none"
            />
          </div>

          {/* File attachments */}
          <div>
            <div className="mb-2">
              <span className="text-sm font-medium text-text-secondary">Adjuntos</span>
              <p className="mt-0.5 text-xs text-text-muted">
                Capturas de pantalla, PDFs o notas de voz
              </p>
            </div>
            <FileUploadZone
              files={files}
              onFilesChange={setFiles}
              maxFiles={5}
              maxSizeMB={10}
              disabled={submitting}
            />
            <div className="mt-3">
              <AudioRecorder
                onRecordingComplete={(file) => setFiles((prev) => [...prev, file])}
                disabled={submitting}
              />
            </div>
          </div>

          {/* Priority chips */}
          <div>
            <span className="block text-sm font-medium text-text-secondary mb-2">
              Prioridad preferida
            </span>
            <div className="flex flex-wrap gap-2">
              {PRIORITIES.map((p) => (
                <PriorityChip
                  key={p.value}
                  priority={p}
                  selected={priority === p.value}
                  onSelect={setPriority}
                />
              ))}
            </div>
            <p className="mt-2 text-xs text-text-muted">
              El equipo puede ajustar la prioridad segun la carga de trabajo.
            </p>
          </div>
        </div>

        {/* ------------------------------------------------------------------ */}
        {/* Note & cost footnote                                                */}
        {/* ------------------------------------------------------------------ */}
        <p className="text-xs text-text-muted px-1">
          El costo final lo asigna el equipo al aprobar la solicitud.
        </p>

        {/* ------------------------------------------------------------------ */}
        {/* Error message                                                       */}
        {/* ------------------------------------------------------------------ */}
        {error && (
          <div className="rounded-lg bg-coral/10 border border-coral/20 px-4 py-3 text-sm text-coral">
            {error}
          </div>
        )}

        {/* ------------------------------------------------------------------ */}
        {/* Submit row                                                          */}
        {/* ------------------------------------------------------------------ */}
        <div className="flex items-center gap-3 justify-end pt-1">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={submitting}
            className="px-4 py-2.5 rounded-lg text-sm text-text-secondary hover:text-text-primary hover:bg-white/5 transition-colors disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="submit"
            disabled={submitting || !projectId || !selectedCategory}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-background text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                {submitLabel}
              </>
            ) : (
              <>
                Enviar solicitud
                {estimatedCost !== null && (
                  <span className="font-normal opacity-75">
                    {estimatedCost === 0 ? '· Gratis' : `· ~${estimatedCost} cr`}
                  </span>
                )}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
