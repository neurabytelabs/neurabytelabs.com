import { useMemo } from 'react';
import { motion } from 'motion/react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { posts } from '../data/posts';

const blogFiles = import.meta.glob('/src/content/blog/*.mdx', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

function getPostContent(slug: string): string {
  const key = `/src/content/blog/${slug}.mdx`;
  const raw = blogFiles[key];
  if (!raw) return '*Post content not found.*';

  // Strip frontmatter
  const fmEnd = raw.indexOf('---', 3);
  let content = fmEnd !== -1 ? raw.slice(fmEnd + 3).trim() : raw;

  // Strip import lines and JSX components
  content = content
    .split('\n')
    .filter(line => !line.trimStart().startsWith('import ') && !/<[A-Z]/.test(line))
    .join('\n');

  return content;
}

interface BlogPostProps {
  slug: string;
  onBack: () => void;
}

export default function BlogPostView({ slug, onBack }: BlogPostProps) {
  const post = posts.find(p => p.slug === slug);
  const content = useMemo(() => getPostContent(slug), [slug]);

  if (!post) return null;

  return (
    <motion.div
      key="blog-post"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-8 w-full max-w-3xl"
    >
      <button
        onClick={onBack}
        className="font-mono text-xs text-ratio/40 hover:text-spark transition-colors uppercase tracking-widest"
      >
        ← Back to Lab Notes
      </button>

      <header className="space-y-3 border-b border-ratio/10 pb-6">
        {post.series && (
          <span className="font-mono text-[10px] text-spark/60 uppercase tracking-widest">{post.series}</span>
        )}
        <h1 className="font-mono text-2xl sm:text-3xl text-ratio leading-tight">{post.title}</h1>
        <div className="font-mono text-xs text-ratio/30 flex gap-4">
          <span>{post.date}</span>
          <span>·</span>
          <span>{post.author}</span>
        </div>
      </header>

      <article className="prose-membrane font-sans text-sm text-ratio/70 leading-relaxed font-light max-h-[55vh] overflow-y-auto custom-scrollbar pr-4">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            h1: ({ children }) => <h1 className="font-mono text-xl text-ratio mt-8 mb-4">{children}</h1>,
            h2: ({ children }) => <h2 className="font-mono text-lg text-ratio mt-8 mb-3">{children}</h2>,
            h3: ({ children }) => <h3 className="font-mono text-base text-ratio mt-6 mb-2">{children}</h3>,
            p: ({ children }) => <p className="mb-4 leading-relaxed">{children}</p>,
            strong: ({ children }) => <strong className="text-ratio font-medium">{children}</strong>,
            em: ({ children }) => <em className="text-ratio/80 italic">{children}</em>,
            a: ({ href, children }) => <a href={href} target="_blank" rel="noreferrer" className="text-spark hover:underline">{children}</a>,
            blockquote: ({ children }) => <blockquote className="border-l-2 border-spark/30 pl-4 my-4 text-ratio/50 italic">{children}</blockquote>,
            code: ({ children, className }) => {
              const isBlock = className?.includes('language-');
              return isBlock
                ? <code className="block bg-ratio/5 border border-ratio/10 p-4 my-4 font-mono text-xs text-ratio/80 overflow-x-auto">{children}</code>
                : <code className="bg-ratio/5 px-1.5 py-0.5 font-mono text-xs text-spark/80">{children}</code>;
            },
            ul: ({ children }) => <ul className="list-disc list-inside mb-4 space-y-1">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal list-inside mb-4 space-y-1">{children}</ol>,
            hr: () => <hr className="border-ratio/10 my-8" />,
          }}
        >
          {content}
        </ReactMarkdown>
      </article>
    </motion.div>
  );
}
