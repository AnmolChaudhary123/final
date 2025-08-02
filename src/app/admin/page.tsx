import { getServerSession } from 'next-auth/next';
import type { Session } from 'next-auth';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import { Blog, User } from '@/models';
import { formatDate } from '@/utils';
import { Eye, Plus, Trash2, Edit } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

interface BlogData {
  _id: string;
  title: string;
  slug: string;
  status: string;
  views: number;
  createdAt: Date;
  author?: {
    name: string;
  };
}

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: Date;
}

export default async function AdminPage() {
  const session = (await getServerSession(authOptions)) as Session | null;
  
  if (!session) {
    redirect('/auth/signin');
  }

  // Type-safe check for user role
  if (session.user?.role !== 'admin') {
    redirect('/');
  }

  await connectDB();

  const blogs = await Blog.find()
    .populate('author', 'name')
    .sort({ createdAt: -1 })
    .lean();

  const users = await User.find()
    .sort({ createdAt: -1 })
    .lean();

  // Safely serialize data
  const safeBlogs: BlogData[] = blogs.map(blog => {
    // Convert _id to string properly
    const id = blog._id;
    const stringId = typeof id === 'object' && id !== null && '_bsontype' in id 
      ? (id as any).toString() 
      : String(id || '');

    return {
      _id: stringId,
      title: (blog.title as string) || '',
      slug: (blog.slug as string) || '',
      status: (blog.status as string) || 'draft',
      views: (blog.views as number) || 0,
      createdAt: blog.createdAt as Date,
      author: blog.author ? {
        name: (blog.author as { name: string }).name || 'Unknown'
      } : undefined,
    };
  });

  const safeUsers: UserData[] = users.map(user => {
    // Convert _id to string properly
    const id = user._id;
    const stringId = typeof id === 'object' && id !== null && '_bsontype' in id 
      ? (id as any).toString() 
      : String(id || '');

    return {
      _id: stringId,
      name: (user.name as string) || '',
      email: (user.email as string) || '',
      role: (user.role as string) || 'user',
      createdAt: user.createdAt as Date,
    };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-2">Total Posts</h3>
          <p className="text-3xl font-bold text-primary">{safeBlogs.length}</p>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-primary">{safeUsers.length}</p>
        </div>
      </div>

      {/* Blogs Table */}
      <div className="card mb-8">
        <div className="card-header">
          <h2 className="card-title">Recent Posts</h2>
          <Link href="/dashboard/create" className="btn btn-primary btn-sm">
            <Plus className="mr-2 h-4 w-4" />
            Create Post
          </Link>
        </div>
        <div className="card-content">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Title</th>
                  <th className="text-left p-4">Author</th>
                  <th className="text-left p-4">Status</th>
                  <th className="text-left p-4">Views</th>
                  <th className="text-left p-4">Created</th>
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {safeBlogs.slice(0, 10).map((blog) => (
                  <tr key={blog._id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <div>
                        <p className="font-medium">{blog.title}</p>
                        <p className="text-sm text-muted-foreground">{blog.slug}</p>
                      </div>
                    </td>
                    <td className="p-4">{blog.author?.name || 'Unknown'}</td>
                    <td className="p-4">
                      <span className={`badge ${blog.status === 'published' ? 'badge-primary' : 'badge-secondary'}`}>
                        {blog.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {blog.views}
                      </div>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {formatDate(blog.createdAt)}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/dashboard/edit/${blog._id}`}
                          className="btn btn-ghost btn-sm"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button className="btn btn-ghost btn-sm text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">Users</h2>
        </div>
        <div className="card-content">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Name</th>
                  <th className="text-left p-4">Email</th>
                  <th className="text-left p-4">Role</th>
                  <th className="text-left p-4">Joined</th>
                </tr>
              </thead>
              <tbody>
                {safeUsers.slice(0, 10).map((user) => (
                  <tr key={user._id} className="border-b hover:bg-muted/50">
                    <td className="p-4 font-medium">{user.name}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">
                      <span className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-secondary'}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-muted-foreground">
                      {formatDate(user.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
} 