
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import { Comment, Blog } from '@/models';
import mongoose from 'mongoose';

export async function GET(
  request: NextRequest,
  { params }: { params: { blogId: string } }
) {
  try {
    const { blogId } = params;
    
    if (!mongoose.Types.ObjectId.isValid(blogId)) {
      return NextResponse.json(
        { message: 'Invalid blog ID' },
        { status: 400 }
      );
    }

    await connectDB();

    const comments = await Comment.find({ blog: blogId })
      .populate({
        path: 'author',
        select: 'name image',
        model: 'User'
      })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(comments);
  } catch (error) {
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { blogId: string } }
) {
  const { blogId } = params;
  try {
    const session = await getServerSession(authOptions) as { user: { id: string } } | null;
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { content, parentComment } = await request.json();

    if (!content || !content.trim()) {
      return NextResponse.json(
        { message: 'Comment content is required' },
        { status: 400 }
      );
    }

    await connectDB();

    // Verify blog exists
    const blog = await Blog.findById(blogId);
    if (!blog) {
      return NextResponse.json(
        { message: 'Blog not found' },
        { status: 404 }
      );
    }

    // Create comment
    const comment = new Comment({
      content: content.trim(),
      author: session.user.id,
      blog: blogId,
      parentComment: parentComment || null,
    });

    await comment.save();

    // If this is a reply, add it to the parent comment's replies
    if (parentComment) {
      await Comment.findByIdAndUpdate(parentComment, {
        $push: { replies: comment._id },
      });
    }

    // Populate author info
    await comment.populate('author', 'name image');

    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 