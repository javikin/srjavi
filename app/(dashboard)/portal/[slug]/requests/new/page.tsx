'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { createBrowserClient } from '@/lib/supabase/client';
import PageHeader from '@/components/dashboard/PageHeader';

const CREDIT_REFERENCE = [
  { label: 'Bug fix', cost: 0, note: 'Gratis' },
  { label: 'Feature pequena', cost: 4 },
  { label: 'Feature mediana', cost: 10 },
  { label: 'Feature grande', cost: 20 },
  { label: 'Bug externo', cost: 3 },
];

const REQUEST_TYPES = [
  { value: 'bug', label: 'Bug' },
  { value: 'feature', label: 'Feature' },
  { value: 'improvement', label: 'Mejora' },
];

const PRIORITIES = [
  { value: 'low', label: 'Baja' },
  { value: 'medium', label: 'Media' },
  { value: 'high', label: 'Alta' },
  { value: 'critical', label: 'Critica' },
];

export default function NewRequestPage() {
  const router = useRouter();
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const [projectId, setProjectId] = useState<string | null>(null);
  const [loadingProject, setLoadingProject] = useState(true);

  const [type, setType] = useState('feature');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Resolve slug to project ID on mount
  useEffect(() => {
    async function resolveProject() {
      const supabase = createBrowserClient();
      const { data, error } = await supabase
        .from('projects')
        .select('id')
        .eq('slug', slug)
        .single();

      if (error || !data) {
        setError('No se encontro el proyecto. Verifica el enlace.');
      } else {
        setProjectId(data.id);
      }
      setLoadingProject(false);
    }
    resolveProject();
  }, [slug]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!projectId) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/projects/${projectId}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
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

  if (loadingProject) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl space-y-6">
      <PageHeader
        title="Nueva Solicitud"
        description="Describe lo que necesitas y te lo haremos saber pronto."
      />

      {/* Credit reference info box */}
      <div className="rounded-xl bg-surface border border-white/5 p-5">
        <h3 className="text-sm font-medium text-text-secondary mb-3">
          Referencia de costo en creditos
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {CREDIT_REFERENCE.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/5"
            >
              <span className="text-xs text-text-muted">{item.label}</span>
              {item.cost === 0 ? (
                <span className="text-xs font-semibold text-mint shrink-0">Gratis</span>
              ) : (
                <span className="text-xs font-semibold text-primary tabular-nums shrink-0">
                  {item.cost} cr
                </span>
              )}
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-text-muted">
          El costo final lo asigna el equipo al aprobar la solicitud.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="rounded-xl bg-surface border border-white/5 p-6 space-y-5">
          {/* Type */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-text-secondary mb-1.5">
              Tipo de solicitud
            </label>
            <select
              id="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-lg bg-background border border-white/10 text-text-primary text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
            >
              {REQUEST_TYPES.map((t) => (
                <option key={t.value} value={t.value}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-text-secondary mb-1.5">
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
            <label htmlFor="description" className="block text-sm font-medium text-text-secondary mb-1.5">
              Descripcion
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              rows={5}
              placeholder="Describe el problema o la funcionalidad en detalle. Incluye pasos para reproducir (si es un bug), comportamiento esperado, contexto, etc."
              className="w-full px-3 py-2.5 rounded-lg bg-background border border-white/10 text-text-primary text-sm placeholder:text-text-muted focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors resize-none"
            />
          </div>

          {/* Priority */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-text-secondary mb-1.5">
              Prioridad preferida
            </label>
            <select
              id="priority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              required
              className="w-full px-3 py-2.5 rounded-lg bg-background border border-white/10 text-text-primary text-sm focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-colors"
            >
              {PRIORITIES.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-text-muted">
              El equipo puede ajustar la prioridad segun la carga de trabajo.
            </p>
          </div>
        </div>

        {error && (
          <div className="rounded-lg bg-coral/10 border border-coral/20 px-4 py-3 text-sm text-coral">
            {error}
          </div>
        )}

        <div className="flex items-center gap-3 justify-end">
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
            disabled={submitting || !projectId}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-primary text-background text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                Enviando...
              </>
            ) : (
              'Enviar solicitud'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
