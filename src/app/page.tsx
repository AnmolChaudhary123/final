import Link from 'next/link';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import { Blog } from '@/models';
import { ArrowRight, TrendingUp, BookOpen, Users, Plus } from 'lucide-react';
import BlogCard from '@/components/BlogCard';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

interface BlogData {
  _id: string;
  title: string;
  slug: string;
  content: string;
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
  isFeatured?: boolean;
}

interface CategoryData {
  _id: string;
  count: number;
}

// Safe data serialization function
function safeSerializeBlog(blog: Record<string, unknown>): BlogData | null {
  try {
    // Convert _id to string properly
    const id = blog._id;
    const stringId = typeof id === 'object' && id !== null && '_bsontype' in id 
      ? (id as any).toString() 
      : String(id || '');

    return {
      _id: stringId,
      title: (blog.title as string) || '',
      slug: (blog.slug as string) || '',
      content: (blog.content as string) || '',
      excerpt: (blog.excerpt as string) || '',
      featuredImage: (blog.featuredImage as string) || '',
      category: (blog.category as string) || '',
      views: (blog.views as number) || 0,
      readTime: (blog.readTime as number) || 1,
      publishedAt: blog.publishedAt as Date || blog.createdAt as Date,
      createdAt: blog.createdAt as Date,
      author: blog.author ? {
        name: (blog.author as { name: string }).name || 'Unknown'
      } : undefined,
      isFeatured: (blog.isFeatured as boolean) || false
    };
  } catch (error) {
    console.error('Error serializing blog:', error);
    return null;
  }
}

export default async function HomePage() {
  try {
    const session = await getServerSession(authOptions);
    await connectDB();
    
    // Get featured and latest blogs with error handling
    let featuredBlogs: Record<string, unknown>[] = [];
    let latestBlogs: Record<string, unknown>[] = [];
    let categories: CategoryData[] = [];

    try {
      featuredBlogs = await Blog.find({ 
        status: 'published', 
        isFeatured: true 
      })
      .populate('author', 'name')
      .sort({ publishedAt: -1 })
      .limit(3)
      .lean(); // Use lean() to get plain objects

      latestBlogs = await Blog.find({ 
        status: 'published' 
      })
      .populate('author', 'name')
      .sort({ publishedAt: -1 })
      .limit(6)
      .lean(); // Use lean() to get plain objects

      // Get categories
      categories = await Blog.aggregate([
        { $match: { status: 'published' } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 6 }
      ]);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      // Continue with empty arrays
    }

    // Safely serialize blog data
    const safeFeaturedBlogs = featuredBlogs
      .map(safeSerializeBlog)
      .filter((blog): blog is BlogData => blog !== null);

    const safeLatestBlogs = latestBlogs
      .map(safeSerializeBlog)
      .filter((blog): blog is BlogData => blog !== null);

    return (
      <div className="space-y-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-8 md:p-12">
          <div className="absolute inset-0 bg-grid-white/[0.2] bg-[size:60px_60px]" />
          <div className="relative mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-primary-foreground md:text-6xl lg:text-7xl">
              Share Your{' '}
              <span className="bg-gradient-to-r from-primary-foreground to-primary-foreground/80 bg-clip-text text-transparent">
                Stories
              </span>
            </h1>
            <p className="mt-6 text-lg text-primary-foreground/90 md:text-xl">
              A modern blog platform for writers, creators, and storytellers. 
              Connect with readers and share your unique perspective with the world.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/blog"
                className="btn btn-primary btn-lg group bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                Explore Blogs
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              {session ? (
                <Link
                  href="/dashboard/create"
                  className="btn btn-primary btn-lg group bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Create Post
                </Link>
              ) : (
                <Link
                  href="/auth/signup"
                  className="btn btn-primary btn-lg group bg-primary-foreground text-primary hover:bg-primary-foreground/90"
                >
                  Start Writing
                </Link>
              )}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="card p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <BookOpen className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">100+</h3>
            <p className="text-sm text-muted-foreground">Blog Posts</p>
          </div>
          <div className="card p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">50+</h3>
            <p className="text-sm text-muted-foreground">Writers</p>
          </div>
          <div className="card p-6 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">10K+</h3>
            <p className="text-sm text-muted-foreground">Readers</p>
          </div>
        </section>

        {/* Featured Blogs */}
        {safeFeaturedBlogs.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold">Featured Stories</h2>
                <p className="text-muted-foreground">Discover our most popular and engaging content</p>
              </div>
              <Link
                href="/blog"
                className="btn btn-ghost group"
              >
                View All 
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {safeFeaturedBlogs.map((blog) => (
                <BlogCard 
                  key={blog._id} 
                  blog={blog}
                  excerptLength={80}
                  showReadMore={true}
                />
              ))}
            </div>
          </section>
        )}

        {/* Latest Blogs */}
        {safeLatestBlogs.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold">Latest Stories</h2>
                <p className="text-muted-foreground">Fresh content from our community of writers</p>
              </div>
              <Link
                href="/blog"
                className="btn btn-ghost group"
              >
                View All 
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {safeLatestBlogs.map((blog) => (
                <BlogCard 
                  key={blog._id} 
                  blog={blog}
                  excerptLength={100}
                  showReadMore={true}
                />
              ))}
            </div>
          </section>
        )}

        {/* Categories */}
        {categories.length > 0 && (
          <section>
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold">Explore Categories</h2>
              <p className="text-muted-foreground">Find content that interests you</p>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {categories.map((category) => (
                <Link
                  key={category._id}
                  href={`/blog?category=${category._id}`}
                  className="card p-6 hover-lift group"
                >
                  <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                    {category._id}
                  </h3>
                  <p className="text-muted-foreground">
                    {category.count} {category.count === 1 ? 'post' : 'posts'}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error in HomePage:', error);
    return (
      <div className="space-y-16">
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-primary/90 to-primary/80 p-8 md:p-12">
          <div className="absolute inset-0 bg-grid-white/[0.2] bg-[size:60px_60px]" />
          <div className="relative mx-auto max-w-4xl text-center">
            <h1 className="text-4xl font-bold tracking-tight text-primary-foreground md:text-6xl lg:text-7xl">
              Share Your{' '}
              <span className="bg-gradient-to-r from-primary-foreground to-primary-foreground/80 bg-clip-text text-transparent">
                Stories
              </span>
            </h1>
            <p className="mt-6 text-lg text-primary-foreground/90 md:text-xl">
              A modern blog platform for writers, creators, and storytellers. 
              Connect with readers and share your unique perspective with the world.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/blog"
                className="btn btn-primary btn-lg group bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                Explore Blogs
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <Link
                href="/auth/signup"
                className="btn btn-primary btn-lg group bg-primary-foreground text-primary hover:bg-primary-foreground/90"
              >
                Start Writing
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }
}
