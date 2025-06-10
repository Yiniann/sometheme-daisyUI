import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { CheckCircle, XCircle } from "lucide-react";

const isJsonArray = (str) => {
  try {
    const parsed = JSON.parse(str);
    return Array.isArray(parsed) && parsed.every(item => typeof item.feature === "string");
  } catch {
    return false;
  }
};

const DetailsWithIcon = ({ children, open: defaultOpen = false, ...props }) => {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <details
      {...props}
      open={open}
      onToggle={(e) => setOpen(e.currentTarget.open)}
      className="border border-gray-300 rounded-md p-3 mb-4 bg-base-100"
    >
      {children}
    </details>
  );
};

const SummaryWithIcon = (props) => {
  const { children } = props;

  return (
    <summary
      {...props}
      className="cursor-pointer font-semibold select-none flex items-center gap-2"
    >
      <svg
        className="w-4 h-4 transition-transform duration-200"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7"></path>
      </svg>
      {children}
    </summary>
  );
};

const ContentRenderer = ({ content, className = "" }) => {
  if (!content) return null;

  if (isJsonArray(content)) {
    const parsed = JSON.parse(content);
    return (
      <ul className={`space-y-1 text-sm text-base-content/80 ${className}`}>
        {parsed.map((item, idx) => (
          <li key={idx} className="flex items-start gap-2">
            {item.support ? (
              <CheckCircle className="text-success w-4 h-4 mt-0.5" />
            ) : (
              <XCircle className="text-error w-4 h-4 mt-0.5" />
            )}
            <span>{item.feature}</span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <div className={`prose max-w-none text-sm text-base-content/80 ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSanitize]}
        components={{
          a: ({ href, children }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline">
              {children}
            </a>
          ),
          details: DetailsWithIcon,
          summary: SummaryWithIcon,
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
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
              <code className={`rounded px-1 py-[0.15rem] text-sm font-mono ${className}`} {...props}>
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
