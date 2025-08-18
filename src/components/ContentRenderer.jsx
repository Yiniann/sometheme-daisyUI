import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize, { defaultSchema } from "rehype-sanitize";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CheckCircle, XCircle, ChevronRight } from "lucide-react";

// Extend sanitize schema to allow details/summary and class/style
const sanitizeSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames || []), 'details', 'summary'],
  attributes: {
    ...(defaultSchema.attributes || {}),
    details: ['open', 'className'],
    summary: ['className'],
    '*': [
      ...((defaultSchema.attributes && defaultSchema.attributes['*']) || []),
      'className',
      'style'
    ]
  }
};

const tryParseFeatureList = (str) => {
  try {
    const parsed = JSON.parse(str);
    if (Array.isArray(parsed) && parsed.every(item => typeof item.feature === 'string')) return parsed;
  } catch {}
  return null;
};

const DetailsWithIcon = ({ children, open: defaultOpen = false, ...props }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <details
      {...props}
      open={open}
      onToggle={(e) => setOpen(e.currentTarget.open)}
      className="border border-base-300 rounded-md p-3 mb-4 bg-base-200"
    >
      {children(open)}
    </details>
  );
};

const SummaryWithIcon = ({ children, isOpen, ...props }) => {
  return (
    <summary
      {...props}
      className="cursor-pointer font-semibold select-none flex items-center gap-2"
      aria-expanded={isOpen}
    >
      <ChevronRight
        aria-hidden="true"
        className={`w-5 h-5 transition-transform duration-200 ease-in-out ${isOpen ? "rotate-90" : "rotate-0"}`}
      />
      {children}
    </summary>
  );
};

const ContentRenderer = ({ content, className = "" }) => {
  if (!content) return null;

  const list = tryParseFeatureList(content);
  if (list) {
    return (
      <ul className={`space-y-1 text-sm text-base-content leading-relaxed ${className}`}>
        {list.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2">
            {item.support ? (
              <CheckCircle aria-hidden="true" className="text-success w-4 h-4 mt-0.5" />
            ) : (
              <XCircle aria-hidden="true" className="text-error w-4 h-4 mt-0.5" />
            )}
            <span>{item.feature}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className={`prose max-w-none dark:prose-invert text-base-content prose-a:text-primary prose-code:text-base-content prose-pre:p-0 ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, [rehypeSanitize, sanitizeSchema]]}
        components={{
          a: ({ href = '', children }) => {
            const isExternal = /^https?:\/\//i.test(href) && (typeof window !== 'undefined' ? !href.includes(window.location.host) : true);
            return (
              <a
                href={href}
                className="text-primary underline"
                {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              >
                {children}
              </a>
            );
          },
          details: ({ node, ...props }) => {
            const defaultOpen = props.open || false;
            const children = props.children;

            return (
              <DetailsWithIcon open={defaultOpen}>
                {(open) => 
                  React.Children.map(children, child => {
                    if (
                      React.isValidElement(child) &&
                      child.type === "summary"
                    ) {
                      return <SummaryWithIcon isOpen={open}>{child.props.children}</SummaryWithIcon>;
                    }
                    return child;
                  })
                }
              </DetailsWithIcon>
            );
          },
          code({ node, inline, className, children, ...props }) {
            const match = /language-([a-z0-9+-]+)/i.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={oneDark}
                language={match[1]}
                PreTag="div"
                {...props}
                customStyle={{ borderRadius: "0.375rem", padding: "0.5rem" }}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={`rounded px-1 py-[0.15rem] text-sm font-mono text-base-content bg-base-200 ${className}`} {...props}>
                {children}
              </code>
            );
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default ContentRenderer;
