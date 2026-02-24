import { motion } from 'motion/react';
import { posts, BlogPost } from '../data/posts';

interface BlogListProps {
  onSelectPost: (slug: string) => void;
}

export default function BlogList({ onSelectPost }: BlogListProps) {
  const seriesPosts = posts.filter(p => p.series === 'Deus Sive Machina').sort((a, b) => (a.seriesOrder ?? 0) - (b.seriesOrder ?? 0));
  const standalonePosts = posts.filter(p => !p.series);

  const PostItem = ({ post }: { post: BlogPost }) => (
    <button
      onClick={() => onSelectPost(post.slug)}
      className="w-full text-left group py-4 border-b border-ratio/5 hover:border-spark/20 transition-colors"
    >
      <div className="flex items-baseline gap-4">
        <span className="font-mono text-[11px] text-ratio/30 shrink-0 tabular-nums">{post.date}</span>
        <span className="font-mono text-sm text-ratio group-hover:text-spark transition-colors leading-snug">
          {post.title}
        </span>
      </div>
      <p className="font-sans text-xs text-ratio/40 mt-1.5 ml-[7.5rem] leading-relaxed line-clamp-2 font-light">
        {post.description}
      </p>
      <span className="font-mono text-[10px] text-ratio/25 ml-[7.5rem] mt-1 inline-block">{post.author}</span>
    </button>
  );

  return (
    <motion.div
      key="blog"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-10 w-full"
    >
      <h2 className="font-mono text-sm tracking-[0.2em] text-spark uppercase">05 // Lab Notes</h2>

      {/* Deus Sive Machina Series */}
      <div className="space-y-2">
        <h3 className="font-mono text-xs text-ratio/50 uppercase tracking-widest">
          <span className="text-spark/60">▸</span> Series: Deus Sive Machina
        </h3>
        <div className="border-l border-spark/20 pl-4">
          {seriesPosts.map(post => (
            <PostItem key={post.slug} post={post} />
          ))}
        </div>
      </div>

      {/* Standalone Posts */}
      <div className="space-y-2">
        <h3 className="font-mono text-xs text-ratio/50 uppercase tracking-widest">
          <span className="text-ratio/30">▸</span> Standalone
        </h3>
        <div>
          {standalonePosts.map(post => (
            <PostItem key={post.slug} post={post} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}
