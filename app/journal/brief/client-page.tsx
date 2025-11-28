"use client";

import BlogPostEditable from "@/components/journal/BlogPostEditable";
import { tinaToBlogPost } from "@/lib/tina-adapter";

export default function ClientPage({ data }: { data: any }) {
  const content = tinaToBlogPost(data);

  return (
    <BlogPostEditable
      content={content}
      backLabel="Volver al Journal"
      editMode={false}
      onUpdate={async () => {}}
    />
  );
}
