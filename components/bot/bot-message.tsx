import React from 'react';
import { MemoizedReactMarkdown } from '@/components/markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import { CodeBlock } from '@/components/ui/codeblock';
import { StreamableValue } from 'ai/rsc';
import { useStreamableText } from '@/lib/hooks/use-streamable-text';

interface BotMessageProps {
  content: string | StreamableValue<string>;
}

export function BotMessage({ content }: BotMessageProps) {

  const text = useStreamableText(content);
  return (
    <div className="prose dark:prose-invert">
      <MemoizedReactMarkdown
        className="break-words"
        remarkPlugins={[remarkGfm, remarkMath]}
        components={{
          code({ node, inline, className, children, ...props }) {
            if (inline) {
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }

            const match = /language-(\w+)/.exec(className || '');

            return (
              <CodeBlock
                key={Math.random()}
                language={(match && match[1]) || ''}
                value={String(children).replace(/\n$/, '')}
                {...props}
              />
            );
          },
        }}
      >
        {text}
      </MemoizedReactMarkdown>
    </div>
  );
}