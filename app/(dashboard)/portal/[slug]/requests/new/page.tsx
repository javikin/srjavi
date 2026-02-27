'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';
import PageHeader from '@/components/dashboard/PageHeader';
import CreditBar from '@/components/dashboard/CreditBar';

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
// Page
// ---------------------------------------------------------------------------

interface CreditData {
  quota: number;
  used: number;
}

export default function NewRequestPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

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

  // UI state
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ---------------------------------------------------------------------------
  // Data fetching
  // ---------------------------------------------------------------------------

  useEffect(() => {
    async function bootstrap() {
      const supabase = createBrowserClient();

      // Resolve slug → project ID
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

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!projectId || !selectedCategory) return;

    setSubmitting(true);
    setError(null);

    const category = REQUEST_CATEGORIES.find((c) => c.id === selectedCategory)!;

    try {
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
        setSubmitting(false);
        return;
      }

      router.push(`/portal/${slug}/requests`);
      router.refresh();
    } catch {
      setError('Ocurrio un error inesperado. Intenta de nuevo.');
      setSubmitting(false);
    }
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
  // Render: main page
  // ---------------------------------------------------------------------------

  return (
    <div className="max-w-2xl">
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
            <label
              htmlFor="description"
              className="block text-sm font-medium text-text-secondary mb-1.5"
            >
              Descripcion
            </label>
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
                Enviando...
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
