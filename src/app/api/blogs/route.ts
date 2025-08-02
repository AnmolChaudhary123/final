import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import connectDB from '@/lib/mongodb';
import { Blog } from '@/models';
import { generateSlug } from '@/utils';

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions) as { user: { id: string } } | null;
  if (!session) {
    return NextResponse.json(
      { message: 'Unauthorized' },
      { status: 401 }
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

  await connectDB();

  // Generate slug
  const slug = generateSlug(title);

  // Check if slug already exists
  const existingBlog = await Blog.findOne({ slug });
  if (existingBlog) {
    return NextResponse.json(
      { message: 'A blog with this title already exists' },
      { status: 400 }
    );
  }

  // Calculate read time (rough estimate: 200 words per minute)
  const wordCount = content.split(/\s+/).length;
  const readTime = Math.ceil(wordCount / 200);

  // Create blog
  const blog = new Blog({
    title,
    slug,
    content,
    excerpt,
    category,
    tags: tags || [],
    featuredImage: featuredImage || '',
    author: session.user.id,
    status: status || 'draft',
    isFeatured: isFeatured || false,
    readTime,
    publishedAt: status === 'published' ? new Date() : null,
  });

  await blog.save();

  return NextResponse.json(blog, { status: 201 });
}

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const author = searchParams.get('author');

    const skip = (page - 1) * limit;

    // Build query
    const query: Record<string, unknown> = {};
    if (status) query.status = status;
    if (author) query.author = author;

    const blogs = await Blog.find(query)
      .populate('author', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments(query);

    return NextResponse.json({
      blogs,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Error fetching blogs:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
} 