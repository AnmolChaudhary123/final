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
  likes?: string[];
  author?: {
    name: string;
  };
  isFeatured?: boolean;
}

interface BlogCardProps {
  blog: Blog;
  excerptLength?: number;
  showReadMore?: boolean;
}

export default function BlogCard({ blog, excerptLength = 120, showReadMore = false }: BlogCardProps) {
  const [imageSrc, setImageSrc] = useState(getSafeImageUrl(blog.featuredImage));
  const excerpt = blog.excerpt.length > excerptLength
    ? blog.excerpt.substring(0, excerptLength) + '...'
    : blog.excerpt;

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
        {/* Content */}
        <div className="p-6">
          {/* Title - Moved to top */}
          <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
            {blog.title}
          </h3>

          {/* Content (Excerpt) - Moved up */}
          <p className="text-muted-foreground mb-4 line-clamp-3">
            {excerpt}
          </p>

          {/* Featured Image - Moved below content */}
          {blog.featuredImage && (
            <div className="relative aspect-video overflow-hidden rounded-lg my-4">
              <Image
                src={imageSrc}
                alt={blog.title}
                fill
                className="object-cover transition-transform group-hover:scale-105"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              />
            </div>
          )}

          {/* Category and Meta Information - Moved to bottom */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <span className="badge badge-outline">
                {blog.category}
              </span>
              {blog.isFeatured && (
                <span className="badge badge-primary">
                  Featured
                </span>
              )}
            </div>

            {/* Meta Information */}
            <div className="flex items-center text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <UserIcon className="h-4 w-4" />
                <span className="mr-3">{blog.author?.name || 'Unknown'}</span>
                <Clock className="h-4 w-4" />
                <span className="mr-3">{blog.readTime} min</span>
                <Eye className="h-4 w-4" />
                <span>{blog.views}</span>
              </div>
              <time 
                className="ml-4"
                dateTime={
                  blog.publishedAt
                    ? (blog.publishedAt instanceof Date ? blog.publishedAt.toISOString() : new Date(blog.publishedAt).toISOString())
                    : (blog.createdAt instanceof Date ? blog.createdAt.toISOString() : new Date(blog.createdAt).toISOString())
                }>
                {formatDate(blog.publishedAt || blog.createdAt)}
              </time>
            </div>

          </div>

          {/* Read More Button */}
          {showReadMore && blog.excerpt.length > excerptLength && (
            <div className="mt-4">
              <span className="text-primary font-medium hover:underline">
                Read More →
              </span>
            </div>
          )}
        </div>
      </Link>
    </article>
  );
} 