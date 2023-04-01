import { React } from 'mylife-tools-ui';
import ReactMarkdown from 'react-markdown';

const Markdown: React.FunctionComponent<{ className?: string; value: string; }> = ({ className, style, value }) => (
  <ReactMarkdown className={className} children={value} linkTarget='_blank' />
);

export default Markdown;