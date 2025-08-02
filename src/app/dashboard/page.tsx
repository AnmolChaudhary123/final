import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import { Blog } from '@/models';
import { formatDate } from '@/utils';
import { Eye, Clock, User as UserIcon, Plus, Calendar, Tag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import DashboardActions from '@/components/DashboardActions';

interface BlogDoc {
  _id: { toString(): string };
  title?: string;
  slug?: string;
  content?: string;
  excerpt?: string;
  featuredImage?: string;
  category?: string;
  views?: number;
  readTime?: number;
  publishedAt?: Date;
  createdAt?: Date;
  status?: string;
  isFeatured?: boolean;
  author?: { name?: string };
}

export default async function DashboardPage() {
  const session = await getServerSession(authOptions) as { user: { id: string } } | null;
  
  if (!session) {
    redirect('/auth/signin');
  }

  await connectDB();

  const blogs = await Blog.find({ author: session.user.id })
    .populate('author', 'name')
    .sort({ createdAt: -1 })
    .lean();

  // Safely serialize blog data
  const safeBlogs = (blogs as BlogDoc[]).map(blog => {
    // Convert _id to string properly
    const id = blog._id;
    const stringId = typeof id === 'object' && id !== null && '_bsontype' in id 
      ? (id as any).toString() 
      : String(id || '');

    return {
      _id: stringId,
      title: blog.title || '',
      slug: blog.slug || '',
      content: blog.content || '',
      excerpt: blog.excerpt || '',
      featuredImage: blog.featuredImage || '',
      category: blog.category || '',
      views: blog.views || 0,
      readTime: blog.readTime || 1,
      publishedAt: blog.publishedAt || blog.createdAt,
      createdAt: blog.createdAt,
      status: blog.status || 'draft',
      isFeatured: blog.isFeatured || false,
      author: blog.author ? {
        name: blog.author.name || 'Unknown'
      } : undefined,
    };
  });

  const publishedCount = safeBlogs.filter(blog => blog.status === 'published').length;
  const draftCount = safeBlogs.filter(blog => blog.status === 'draft').length;
  const totalViews = safeBlogs.reduce((sum, blog) => sum + blog.views, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Manage your blog posts and track your performance
            </p>
          </div>
          <Link href="/dashboard/create" className="btn btn-primary">
            <Plus className="mr-2 h-4 w-4" />
            Create New Post
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Posts</p>
              <p className="text-2xl font-bold">{safeBlogs.length}</p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-full">
              <Calendar className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Published</p>
              <p className="text-2xl font-bold">{publishedCount}</p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900 rounded-full">
              <Eye className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Views</p>
              <p className="text-2xl font-bold">{totalViews}</p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-full">
              <UserIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Blog Posts */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your Posts</h2>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>{publishedCount} published</span>
            <span>•</span>
            <span>{draftCount} drafts</span>
          </div>
        </div>

        {safeBlogs.length > 0 ? (
          <div className="grid gap-6">
            {safeBlogs.map((blog) => (
              <div key={blog._id} className="card p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`badge ${blog.status === 'published' ? 'badge-success' : 'badge-secondary'}`}>
                        {blog.status}
                      </span>
                      {blog.isFeatured && (
                        <span className="badge badge-primary">Featured</span>
                      )}
                      <span className="text-sm text-muted-foreground">
                        {formatDate(blog.publishedAt || blog.createdAt || '')}
                      </span>
                    </div>

                    <h3 className="text-lg font-semibold mb-2">
                      <Link href={`/blog/${blog.slug}`} className="hover:text-primary transition-colors">
                        {blog.title}
                      </Link>
                    </h3>

                    <p className="text-muted-foreground mb-4 line-clamp-2">
                      {blog.excerpt}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="h-4 w-4" />
                          {blog.views} views
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {blog.readTime} min read
                        </span>
                        <span className="flex items-center gap-1">
                          <Tag className="h-4 w-4" />
                          {blog.category}
                        </span>
                      </div>

                      <DashboardActions blog={blog} />
                    </div>
                  </div>

                  {blog.featuredImage && (
                    <div className="ml-6">
                      <div className="relative w-20 h-20">
                        <Image
                          src={blog.featuredImage}
                          alt={blog.title}
                          fill
                          className="object-cover rounded-lg"
                          sizes="80px"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No posts yet</h3>
            <p className="text-muted-foreground mb-6">
              Start writing your first blog post to see it here.
            </p>
            <Link href="/dashboard/create" className="btn btn-primary">
              <Plus className="mr-2 h-4 w-4" />
              Create Your First Post
            </Link>
          </div>
        )}
      </div>
    </div>
  );
} 