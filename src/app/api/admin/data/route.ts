import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import { Blog, User } from '@/models';
import type { Session } from 'next-auth';
import { Document } from 'mongoose';


interface BlogDocument extends Document {
  _id: any;
  title: string;
  slug: string;
  status: string;
  views: number;
  author?: {
    name: string;
  } | null;
  createdAt: Date;
}

interface UserDocument extends Document {
  _id: any;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

export async function GET() {
  try {
    const session = (await getServerSession(authOptions)) as Session | null;
    
    if (!session || session.user?.role !== 'admin') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const [blogs, users] = await Promise.all([
      Blog.find()
        .populate<{ name: string }>('author', 'name')
        .sort({ createdAt: -1 })
        .lean() as unknown as BlogDocument[],
      User.find()
        .select('-password')
        .sort({ createdAt: -1 })
        .lean() as unknown as UserDocument[]
    ]);

    const formattedBlogs = blogs.map(blog => ({
      ...blog,
      _id: blog._id.toString(),
      author: blog.author ? { name: blog.author.name } : null,
      createdAt: blog.createdAt.toISOString()
    }));

    const formattedUsers = users.map(user => ({
      _id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt.toISOString()
    }));

    return NextResponse.json({
      blogs: formattedBlogs,
      users: formattedUsers
    });
  } catch (error) {
    console.error('Error fetching admin data:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
