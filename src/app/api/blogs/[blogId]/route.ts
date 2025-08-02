import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import { Blog } from '@/models';
import { generateSlug } from '@/utils';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ blogId: string }> }
) {
  try {
    await connectDB();
    const resolvedParams = await params;

    const blog = await Blog.findById(resolvedParams.blogId)
      .populate('author', 'name email');

    if (!blog) {
      return NextResponse.json(
        { message: 'Blog post not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(blog);
  } catch (error) {
    console.error('Error fetching blog:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    await connectDB();
    const resolvedParams = await params;

    // Check if blog exists and user is the author
    const existingBlog = await Blog.findById(resolvedParams.blogId);
    if (!existingBlog) {
      return NextResponse.json(
        { message: 'Blog post not found' },
        { status: 404 }
      );
    }

    if (existingBlog.author.toString() !== session.user.id) {
      return NextResponse.json(
        { message: 'You are not authorized to edit this post' },
        { status: 403 }
      );
    }

    const {
      title,
      content,
      excerpt,
      category,
      tags,
      featuredImage,
      status,
      isFeatured,
    } = await request.json();

    if (!title || !content || !excerpt || !category) {
      return NextResponse.json(
        { message: 'Title, content, excerpt, and category are required' },
        { status: 400 }
      );
    }

    // Generate new slug if title changed
    let slug = existingBlog.slug;
    if (title !== existingBlog.title) {
      slug = generateSlug(title);
      
      // Check if new slug already exists
      const slugExists = await Blog.findOne({ slug, _id: { $ne: resolvedParams.blogId } });
      if (slugExists) {
        return NextResponse.json(
          { message: 'A blog with this title already exists' },
          { status: 400 }
        );
      }
    }

    // Calculate read time
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / 200);

    // Update blog
    const updatedBlog = await Blog.findByIdAndUpdate(
      resolvedParams.blogId,
      {
        title,
        slug,
        content,
        excerpt,
        category,
        tags: tags || [],
        featuredImage: featuredImage || '',
        status: status || 'draft',
        isFeatured: isFeatured || false,
        readTime,
        publishedAt: status === 'published' ? new Date() : existingBlog.publishedAt,
      },
      { new: true }
    );

    return NextResponse.json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
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

    await connectDB();
    const resolvedParams = await params;

    // Check if blog exists and user is the author
    const existingBlog = await Blog.findById(resolvedParams.blogId);
    if (!existingBlog) {
      return NextResponse.json(
        { message: 'Blog post not found' },
        { status: 404 }
      );
    }

    if (existingBlog.author.toString() !== session.user.id) {
      return NextResponse.json(
        { message: 'You are not authorized to delete this post' },
        { status: 403 }
      );
    }

    // Delete blog
    await Blog.findByIdAndDelete(resolvedParams.blogId);

    return NextResponse.json(
      { message: 'Blog post deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting blog:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 