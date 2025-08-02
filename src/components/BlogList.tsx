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

interface BlogListProps {
  blogs: Blog[];
}

export default function BlogList({ blogs }: BlogListProps) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {blogs.map((blog) => (
        <BlogCard key={blog._id} blog={blog} />
      ))}
    </div>
  );
}

// Separate BlogCard component for BlogList
function BlogCard({ blog }: { blog: Blog }) {
  const [imageSrc, setImageSrc] = useState(getSafeImageUrl(blog.featuredImage));

  // Update image after hydration to avoid mismatch
  useEffect(() => {
    if (!blog.featuredImage || blog.featuredImage.includes('via.placeholder.com') || blog.featuredImage.includes('placeholder.com')) {
      const randomId = Math.floor(Math.random() * 1000);
      setImageSrc(`https://picsum.photos/800/400?random=${randomId}`);
    }
  }, [blog.featuredImage]);

  return (
    <article className="card group hover-lift">
      <Link href={`/blog/${blog.slug}`}>
        {/* Featured Image */}
        <div className="relative aspect-video overflow-hidden rounded-t-lg">
          <Image
            src={imageSrc}
            alt={blog.title}
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
              {blog.category}
            </span>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
            {blog.title}
          </h3>

          {/* Excerpt */}
          <p className="text-muted-foreground mb-4 line-clamp-3">
            {blog.excerpt}
          </p>

          {/* Meta Information */}
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <UserIcon className="h-4 w-4" />
                <span>{blog.author?.name || 'Unknown'}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{blog.readTime} min read</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4" />
                <span>{blog.views} views</span>
              </div>
            </div>
            <time dateTime={blog.publishedAt?.toISOString() || blog.createdAt.toISOString()}>
              {formatDate(blog.publishedAt || blog.createdAt)}
            </time>
          </div>
        </div>
      </Link>
    </article>
  );
} 