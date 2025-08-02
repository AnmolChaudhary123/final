'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { formatDate, getSafeImageUrl } from '@/utils';
import { Eye, Clock, User as UserIcon } from 'lucide-react';

interface Blog {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  featuredImage?: string;
  category: string;
  views: number;
  readTime: number;
  publishedAt?: Date;
  createdAt: Date;
  author?: {
    name: string;
  };
}

interface RelatedPostsProps {
  posts: Blog[];
}

export default function RelatedPosts({ posts }: RelatedPostsProps) {
  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <section className="mt-12 pt-8 border-t">
      <h2 className="text-2xl font-bold mb-6">Related Posts</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <RelatedPostCard key={post._id} post={post} />
        ))}
      </div>
    </section>
  );
}

// Separate RelatedPostCard component
function RelatedPostCard({ post }: { post: Blog }) {
  const [imageSrc, setImageSrc] = useState(getSafeImageUrl(post.featuredImage));

  // Update image after hydration to avoid mismatch
  useEffect(() => {
    if (!post.featuredImage || post.featuredImage.includes('via.placeholder.com') || post.featuredImage.includes('placeholder.com')) {
      const randomId = Math.floor(Math.random() * 1000);
      setImageSrc(`https://picsum.photos/800/400?random=${randomId}`);
    }
  }, [post.featuredImage]);

  return (
    <article className="card group hover-lift">
      <Link href={`/blog/${post.slug}`}>
        {/* Featured Image */}
        <div className="relative aspect-video overflow-hidden rounded-t-lg">
          <Image
            src={imageSrc}
            alt={post.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Category */}
          <div className="mb-3">
            <span className="badge badge-outline">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-muted-foreground mb-4 line-clamp-2">
            {post.excerpt}
          </p>

          {/* Meta Information */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <UserIcon className="h-4 w-4" />
                <span>{post.author?.name || 'Unknown'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{post.readTime} min read</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{post.views} views</span>
              </div>
            </div>
            <time dateTime={post.publishedAt?.toISOString() || post.createdAt.toISOString()}>
              {formatDate(post.publishedAt || post.createdAt)}
            </time>
          </div>
        </div>
      </Link>
    </article>
  );
} 