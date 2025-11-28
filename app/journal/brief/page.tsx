import { client } from '@/tina/__generated__/client';
import ClientPage from './client-page';

export default async function BriefPage() {
  const result = await client.queries.post({
    relativePath: "dos-anos.json"
  });

  return (
    <ClientPage
      query={result.query}
      variables={result.variables}
      data={result.data}
    />
  );
}
