import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CheckCircle, XCircle } from "lucide-react";

function isJSON(str) {
  try {
    const parsed = JSON.parse(str);
    return parsed && Array.isArray(parsed) && parsed.every(item => typeof item.feature === "string");
  } catch {
    return false;
  }
}

function isHTML(str) {
  if (typeof window === "undefined") return false;
  return /<\/?[a-z][\s\S]*>/i.test(str);
}

function isMarkdown(str) {
  const markdownIndicators = ["\n", "*", "#", "`", "-", "_", ">", "[", "]"];
  return markdownIndicators.some(sym => str.includes(sym));
}

const ContentRenderer = ({ content, className = "" }) => {
  if (!content) return null;

  if (isJSON(content)) {
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

  if (isHTML(content)) {
    return (
      <div
        className={`prose max-w-none text-sm text-base-content/80 ${className}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  if (isMarkdown(content)) {
    return (
      <div className={`prose max-w-none text-sm text-base-content/80 ${className}`}>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            a: ({ href, children }) => (
              <a href={href} target="_blank" rel="noopener noreferrer" className="text-primary underline">
                {children}
              </a>
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    );
  }

  return (
    <div className={`text-sm text-base-content/80 whitespace-pre-wrap ${className}`}>
      {content}
    </div>
  );
};

export default ContentRenderer;
