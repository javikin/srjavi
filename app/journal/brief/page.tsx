import { promises as fs } from 'fs';
import path from 'path';
import ClientPage from './client-page';

export default async function BriefPage() {
  // Read the JSON file directly instead of using TinaCMS client
  const filePath = path.join(process.cwd(), 'content/posts/dos-anos.json');
  const fileContents = await fs.readFile(filePath, 'utf8');
  const postData = JSON.parse(fileContents);

  return (
    <ClientPage data={postData} />
  );
}
