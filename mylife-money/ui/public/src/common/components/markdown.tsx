import React from 'react';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

const Markdown: React.FunctionComponent<{ className?: string; value: string; }> = ({ className, value }) => (
  <ReactMarkdown remarkPlugins={[remarkGfm]} className={className} children={value} linkTarget='_blank' />
);

export default Markdown;