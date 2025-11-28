import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeExternalLinks from 'rehype-external-links';
import remarkGfm from 'remark-gfm';

export interface MarkdownProps {
  className?: string;
  value: string;
}

export default function Markdown({ className, value }: MarkdownProps) {
  return (
    <div className={className}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[[rehypeExternalLinks, { target: '_blank' }]]}>
        {value}
      </ReactMarkdown>
    </div>
  );
}
