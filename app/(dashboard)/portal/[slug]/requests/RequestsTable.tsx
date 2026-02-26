'use client';

import { useRouter } from 'next/navigation';
import DataTable, { Column } from '@/components/dashboard/DataTable';
import StatusBadge from '@/components/dashboard/StatusBadge';
import RequestTypeBadge from '@/components/dashboard/RequestTypeBadge';
import PriorityBadge from '@/components/dashboard/PriorityBadge';

interface Request {
  id: string;
  title: string;
  type: string;
  status: string;
  priority_preference: string;
  admin_priority: string | null;
  credit_cost: number;
  created_at: string;
  updated_at: string;
  [key: string]: unknown;
}

interface RequestsTableProps {
  requests: Request[];
  slug: string;
}

export default function RequestsTable({ requests, slug }: RequestsTableProps) {
  const router = useRouter();

  const columns: Column<Request>[] = [
    {
      key: 'title',
      label: 'Titulo',
      sortable: true,
      render: (r) => (
        <span className="font-medium text-text-primary">{r.title}</span>
      ),
    },
    {
      key: 'type',
      label: 'Tipo',
      render: (r) => (
        <RequestTypeBadge type={r.type as 'bug' | 'feature' | 'improvement'} />
      ),
    },
    {
      key: 'status',
      label: 'Estado',
      render: (r) => (
        <StatusBadge status={r.status as 'pending' | 'approved' | 'in_progress' | 'completed' | 'rejected'} />
      ),
    },
    {
      key: 'priority_preference',
      label: 'Prioridad',
      render: (r) => {
        const priority = (r.admin_priority ?? r.priority_preference) as 'low' | 'medium' | 'high' | 'critical';
        return <PriorityBadge priority={priority} />;
      },
    },
    {
      key: 'credit_cost',
      label: 'Creditos',
      sortable: true,
      render: (r) => (
        <span className="tabular-nums text-text-secondary">
          {r.credit_cost > 0 ? `${r.credit_cost} cr` : '—'}
        </span>
      ),
    },
    {
      key: 'created_at',
      label: 'Fecha',
      sortable: true,
      render: (r) => (
        <span className="text-text-muted text-xs">
          {new Date(r.created_at).toLocaleDateString('es-MX', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={requests}
      emptyMessage="Sin solicitudes"
      onRowClick={(r) => router.push(`/portal/${slug}/requests/${r.id}`)}
    />
  );
}
