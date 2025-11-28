import BlogPost from '@/components/journal/BlogPost';
import { content } from './content.en';

export default function CarrilloStudioPost() {
  return <BlogPost content={content} backLabel="Back to Journal" />;
}
