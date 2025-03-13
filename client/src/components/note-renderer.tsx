import { useMemo } from "react";
import { marked } from "marked";

interface NoteRendererProps {
  content: string;
}

export default function NoteRenderer({ content }: NoteRendererProps) {
  const htmlContent = useMemo(() => {
    return marked(content, {
      breaks: true,
      gfm: true,
    });
  }, [content]);

  return (
    <div 
      className="prose prose-sm max-w-none dark:prose-invert"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
