import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeExternalLinks from 'rehype-external-links';
import remarkGfm from 'remark-gfm';

const Markdown: React.FC<{ className?: string; value: string }> = ({ className, value }) => (
  <div className={className}>
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[[rehypeExternalLinks, { target: '_blank' }]]}>
      {value}
    </ReactMarkdown>
  </div>
);

export default Markdown;
