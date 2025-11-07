'use client';

import ProjectWizard from '@/components/ProjectWizard';
import PerformanceMonitor from '@/components/PerformanceMonitor';

export const dynamic = 'force-dynamic';

export default function ShipFormPage() {
  return (
    <>
      <ProjectWizard />
      <PerformanceMonitor />
    </>
  );
}
