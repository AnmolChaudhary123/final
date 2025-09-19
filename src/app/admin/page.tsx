'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { Eye, Plus, Trash2, Edit, UserPlus, UserMinus } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

interface BlogData {
  _id: string;
  title: string;
  slug: string;
  status: string;
  views: number;
  createdAt: string;
  author?: {
    name: string;
  };
}

interface UserData {
  _id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
}

// Confirmation Dialog Component
const ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};



// Client component for the admin page
export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [blogs, setBlogs] = useState<BlogData[]>([]);
  const [users, setUsers] = useState<UserData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<{id: string, name: string} | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingRole, setIsUpdatingRole] = useState(false);
  const [editingUser, setEditingUser] = useState<{id: string, role: string} | null>(null);

  // Check authentication and fetch data
  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }

    if (session.user?.role !== 'admin') {
      router.push('/');
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetch('/api/admin/data');
        if (!response.ok) throw new Error('Failed to fetch data');
        const result = await response.json();
        setBlogs(result.blogs);
        setUsers(result.users);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session, status, router]);

  // Handle user deletion
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/users/${selectedUser.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete user');
      }

      // Update the users list
      setUsers(prevUsers => prevUsers.filter(user => user._id !== selectedUser.id));
      
      toast.success('User deleted successfully');
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(error.message || 'Failed to delete user');
    } finally {
      setSelectedUser(null);
      setShowDeleteDialog(false);
      setIsDeleting(false);
    }
  };

  // Handle role update
  const handleUpdateRole = async (userId: string, newRole: 'admin' | 'user') => {
    try {
      setIsUpdatingRole(true);
      setEditingUser({ id: userId, role: newRole });
      
      const response = await fetch(`/api/users/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to update user role');
      }

      // Update the users list
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user._id === userId ? { ...user, role: newRole } : user
        )
      );
      
      toast.success('User role updated successfully');
    } catch (error: any) {
      console.error('Error updating user role:', error);
      toast.error(error.message || 'Failed to update user role');
    } finally {
      setEditingUser(null);
      setIsUpdatingRole(false);
    }
  };

  // Handle blog deletion
  const handleDeleteBlog = async (blogId: string) => {
    if (!confirm('Are you sure you want to delete this blog post? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/blogs/${blogId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete blog post');
      }

      // Update the blogs list
      setBlogs(prevBlogs => prevBlogs.filter(blog => blog._id !== blogId));
      
      toast.success('Blog post deleted successfully');
    } catch (error: any) {
      console.error('Error deleting blog post:', error);
      toast.error(error.message || 'Failed to delete blog post');
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid date';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-2">Total Posts</h3>
          <p className="text-3xl font-bold text-primary">{blogs.length}</p>
        </div>
        <div className="card p-6">
          <h3 className="text-lg font-semibold mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-primary">{users.length}</p>
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
                {blogs.slice(0, 10).map((blog) => (
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
                          className="btn btn-ghost btn-sm hover:bg-gray-100 rounded-full p-2"
                          title="Edit post"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <button 
                          onClick={() => handleDeleteBlog(blog._id)}
                          className="btn btn-ghost btn-sm text-destructive hover:bg-red-50 rounded-full p-2"
                          title="Delete post"
                          disabled={isDeleting}
                        >
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
                  <th className="text-left p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.slice(0, 10).map((user) => (
                  <tr key={user._id} className="border-b hover:bg-muted/50">
                    <td className="p-4 font-medium">{user.name}</td>
                    <td className="p-4">{user.email}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className={`badge ${user.role === 'admin' ? 'badge-primary' : 'badge-secondary'}`}>
                          {user.role}
                        </span>
                        {session?.user?.email !== user.email && (
                          <button
                            onClick={() => handleUpdateRole(user._id, user.role === 'admin' ? 'user' : 'admin')}
                            className="text-gray-500 hover:text-primary transition-colors"
                            title={user.role === 'admin' ? 'Demote to user' : 'Promote to admin'}
                            disabled={isUpdatingRole && editingUser?.id === user._id}
                          >
                            {isUpdatingRole && editingUser?.id === user._id ? (
                              <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                            ) : user.role === 'admin' ? (
                              <UserMinus className="h-4 w-4" />
                            ) : (
                              <UserPlus className="h-4 w-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <button
                        onClick={() => {
                          setSelectedUser({ id: user._id, name: user.name });
                          setShowDeleteDialog(true);
                        }}
                        className="text-red-600 hover:text-red-800 transition-colors"
                        title="Delete user"
                        disabled={session?.user?.email === user.email}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
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

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDeleteUser}
        title="Delete User"
        message={`Are you sure you want to delete user "${selectedUser?.name}"? This action cannot be undone.`}
      />
    </div>
  );
}