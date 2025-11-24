import React from 'react';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeExternalLinks from 'rehype-external-links';

const Markdown: React.FunctionComponent<{ className?: string; value: string }> = ({ className, value }) => (
  <div className={className}>
    <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[[rehypeExternalLinks, { target: '_blank' }]]} children={value} />
  </div>
);

export default Markdown;
