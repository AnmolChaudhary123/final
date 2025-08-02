import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import { Comment } from '@/models';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ commentId: string }> }
) {
  try {
    const session = await getServerSession(authOptions) as { user: { id: string } } | null;
    if (!session) {
      return NextResponse.json(
        { message: 'Unauthorized' },
        { status: 401 }
      );
    }

    await connectDB();

    const resolvedParams = await params;
    const comment = await Comment.findById(resolvedParams.commentId);
    if (!comment) {
      return NextResponse.json(
        { message: 'Comment not found' },
        { status: 404 }
      );
    }

    const userId = session.user.id;
    const isLiked = comment.likes.includes(userId);

    if (isLiked) {
      // Unlike
      await Comment.findByIdAndUpdate(resolvedParams.commentId, {
        $pull: { likes: userId },
      });
    } else {
      // Like
      await Comment.findByIdAndUpdate(resolvedParams.commentId, {
        $addToSet: { likes: userId },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 