import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import { Comment, Blog } from '@/models';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ blogId: string }> }
) {
  try {
    await connectDB();

    const resolvedParams = await params;
    const comments = await Comment.find({ blog: resolvedParams.blogId })
      .populate('author', 'name image')
      .sort({ createdAt: -1 });

    return NextResponse.json(comments);
  } catch (error) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ blogId: string }> }
) {
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

    const resolvedParams = await params;

    // Verify blog exists
    const blog = await Blog.findById(resolvedParams.blogId);
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
      blog: resolvedParams.blogId,
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