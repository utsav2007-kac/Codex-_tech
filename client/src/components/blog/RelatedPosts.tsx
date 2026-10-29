import React from 'react';
import { BlogCard, BlogPostCardData } from './BlogCard';

interface RelatedPostsProps {
  posts: BlogPostCardData[];
}

export const RelatedPosts: React.FC<RelatedPostsProps> = ({ posts }) => {
  if (!posts || posts.length === 0) return null;

  return (
    <section aria-labelledby="related-posts-heading" className="pt-12 pb-16 border-t border-slate-200">
      <h2 id="related-posts-heading" className="text-2xl sm:text-3xl font-bold text-slate-900 mb-8">
        Related Articles
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {posts.slice(0, 3).map((post) => (
          <BlogCard key={post.id} post={post} subgrid />
        ))}
      </div>
    </section>
  );
};
