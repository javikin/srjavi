import BlogPost from '@/components/journal/BlogPost';
import { content } from '../../carrillo-studio/content.es';

export default function EstudioCarrilloPost() {
  return <BlogPost content={content} backLabel="Volver al Journal" />;
}
