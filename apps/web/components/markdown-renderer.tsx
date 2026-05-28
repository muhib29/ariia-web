'use client';

import dynamic from 'next/dynamic';

type Props = {
  children: string;
  components?: any;
  className?: string;
  withBreaks?: boolean;
};

const ReactMarkdown = dynamic(
  () => import('react-markdown'),
  { ssr: false }
);

const MarkdownWithBreaks = dynamic(
  () =>
    Promise.all([
      import('react-markdown'),
      import('remark-breaks'),
    ]).then(([{ default: MD }, { default: remarkBreaks }]) => {
      function Comp({
        children,
        components,
      }: Props) {
        return (
          <MD
            remarkPlugins={[remarkBreaks]}
            components={components}
          >
            {children}
          </MD>
        );
      }

      return { default: Comp };
    }),
  { ssr: false }
);

export default function MarkdownRenderer({
  children,
  components,
  className,
  withBreaks,
}: Props) {
  return (
    <div className={className}>
      {withBreaks ? (
        <MarkdownWithBreaks components={components}>
          {children}
        </MarkdownWithBreaks>
      ) : (
        <ReactMarkdown components={components}>
          {children}
        </ReactMarkdown>
      )}
    </div>
  );
}