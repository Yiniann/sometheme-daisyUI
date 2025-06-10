import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";  // 允许渲染 HTML
import rehypeSanitize from "rehype-sanitize"; // HTML 安全过滤
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

  // Markdown + HTML + 代码块高亮
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
