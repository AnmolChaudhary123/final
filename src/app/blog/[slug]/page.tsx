import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import RelatedPosts from '@/components/RelatedPosts';
import BlogImage from '@/components/BlogImage';
import { Blog, Comment, User } from '@/models';
import { formatDate } from '@/utils';
import { Eye, Clock, User as UserIcon, Calendar, Tag, MessageSquare, Heart, Bookmark, Share2 } from 'lucide-react';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import ShareButton from '@/components/ShareButton';
import BlogComments from '@/components/BlogComments';


interface BlogPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  await connectDB();

  const resolvedParams = await params;
  const blog = await Blog.findOne({ slug: resolvedParams.slug, status: 'published' })
    .populate('author', 'name');

  if (!blog) {
    return {
      title: 'Blog Post Not Found',
    };
  }

  return {
    title: blog.title,
    description: blog.excerpt,
    openGraph: {
      title: blog.title,
      description: blog.excerpt,
      type: 'article',
      publishedTime: blog.publishedAt ? (blog.publishedAt instanceof Date ? blog.publishedAt.toISOString() : new Date(blog.publishedAt).toISOString()) : undefined,
      authors: [blog.author?.name],
      images: blog.featuredImage ? [blog.featuredImage] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.title,
      description: blog.excerpt,
      images: blog.featuredImage ? [blog.featuredImage] : [],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  await connectDB();

  const resolvedParams = await params;
  const blog = await Blog.findOne({ slug: resolvedParams.slug, status: 'published' })
    .populate('author', 'name');

  if (!blog) {
    notFound();
  }

  // Increment view count
  await Blog.findByIdAndUpdate(blog._id, { $inc: { views: 1 } });

  // Get related posts
  const relatedPosts = await Blog.find({
    _id: { $ne: blog._id },
    status: 'published',
    $or: [
      { category: blog.category },
      { tags: { $in: blog.tags } },
    ],
  })
    .populate('author', 'name')
    .sort({ publishedAt: -1 })
    .limit(3)
    .lean(); // Use lean() to get plain objects

  // Get the current user's session
  const session = await getServerSession(authOptions);
  const currentUserId = session?.user?.id;

  // Get comments count
  const commentsCount = await Comment.countDocuments({ blog: blog._id });

  // Get like status for the current user
  const isLiked = currentUserId ? blog.likes.includes(currentUserId) : false;
  const likeCount = blog.likes?.length || 0;

  // Check if the post is saved by the current user
  let isSaved = false;
  if (currentUserId) {
    const user = await User.findById(currentUserId).select('savedPosts');
    isSaved = user?.savedPosts?.includes(blog._id) || false;
  }

  // Safely serialize blog data to avoid circular references
  const safeBlog = {
    _id: blog._id.toString(),
    title: blog.title,
    slug: blog.slug,
    content: blog.content,
    excerpt: blog.excerpt,
    featuredImage: blog.featuredImage,
    category: blog.category,
    tags: blog.tags || [],
    views: blog.views,
    readTime: blog.readTime,
    publishedAt: blog.publishedAt,
    createdAt: blog.createdAt,
    likes: blog.likes?.map((id: any) => id.toString()) || [],
    author: blog.author ? {
      _id: blog.author._id.toString(),
      name: blog.author.name,
      image: blog.author.image
    } : null,
    _count: {
      comments: commentsCount,
      likes: likeCount,
    },
    isLiked,
    isSaved,
  };

  // Safely serialize related posts
  const safeRelatedPosts = relatedPosts.map((post: any) => ({
    _id: post._id.toString(),
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    featuredImage: post.featuredImage,
    category: post.category,
    views: post.views,
    readTime: post.readTime,
    publishedAt: post.publishedAt,
    createdAt: post.createdAt,
    author: post.author ? {
      name: post.author.name
    } : undefined
  }));

  return (
    <article className="max-w-4xl mx-auto">
      {/* Header */}
      <header className="mb-8">
        <div className="mb-4">
          <span className="bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm font-medium">
            {safeBlog.category}
          </span>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
          {safeBlog.title}
        </h1>
          {/* Content */}
      <div className="prose prose-gray max-w-none dark:prose-invert mb-12">
        <div dangerouslySetInnerHTML={{ __html: safeBlog.content }} />
      </div>


      

        {/* Featured Image */}
        <div className="mb-8">
          <BlogImage
            src={safeBlog.featuredImage}
            alt={safeBlog.title}
            className="relative w-full h-96"
          />
        </div>

        {/* Meta Information */}
        <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-6">
          <div className="flex items-center gap-2">
            <UserIcon className="h-4 w-4" />
            <span>{safeBlog.author?.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(safeBlog.publishedAt || safeBlog.createdAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            <span>{safeBlog.views} views</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span>{safeBlog.readTime} min read</span>
          </div>
        </div>

        {/* Tags */}
        {safeBlog.tags && safeBlog.tags.length > 0 && (
          <div className="flex items-center gap-2 mb-6">
            <Tag className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <div className="flex flex-wrap gap-2">
              {safeBlog.tags.map((tag: string) => (
                <span
                  key={tag}
                  className="badge badge-outline"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Share Button */}
        <div className="flex justify-end mb-6">
          <ShareButton title={safeBlog.title} excerpt={safeBlog.excerpt} />
        </div>
      </header>
      <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
          {safeBlog.excerpt}
        </p>

    
      {/* Comments */}
      <BlogComments blogId={safeBlog._id} />

      {/* Related Posts */}
      {safeRelatedPosts.length > 0 && (
        <RelatedPosts posts={safeRelatedPosts} />
      )}
    </article>
  );
} 