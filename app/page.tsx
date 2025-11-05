import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export default async function RootPage() {
  const headersList = await headers();
  const acceptLanguage = headersList.get('accept-language') || '';

  // Simple detection: if Spanish is preferred, redirect to /es, otherwise /en
  const preferredLocale = acceptLanguage.toLowerCase().includes('es') ? 'es' : 'en';

  redirect(`/${preferredLocale}`);
}
