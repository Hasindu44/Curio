import { InlineMath } from "react-katex";
import "katex/dist/katex.min.css";

// Renders text with $inline math$ segments typeset by KaTeX.
export default function RichText({ children }) {
  if (typeof children !== "string" || !children.includes("$")) return children;
  return children.split(/(\$[^$]+\$)/g).filter(Boolean).map((part, index) =>
    part.startsWith("$") && part.endsWith("$")
      ? <InlineMath key={`${part}-${index}`} math={part.slice(1, -1)} />
      : <span key={`${part}-${index}`}>{part}</span>
  );
}
