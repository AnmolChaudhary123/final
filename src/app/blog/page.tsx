import { Blog } from '@/models';
import SearchFilters from '@/components/SearchFilters';
import BlogCard from '@/components/BlogCard';

// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

interface SearchParams {
  page?: string;
  limit?: string;
  search?: string;
  category?: string;
  author?: string;
  sort?: string;
}

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

function safeSerializeBlog(blog: Record<string, unknown>): BlogData | null {
  try {
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
      publishedAt: blog.publishedAt as Date,
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

export default async function BlogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  try {
    const resolvedSearchParams = await searchParams;
    const page = parseInt(resolvedSearchParams.page || '1');
    const limit = parseInt(resolvedSearchParams.limit || '12');
    const search = resolvedSearchParams.search || '';
    const category = resolvedSearchParams.category || '';
    const author = resolvedSearchParams.author || '';
    const sort = resolvedSearchParams.sort || 'latest';

    const skip = (page - 1) * limit;

    // Build query
    const query: Record<string, unknown> = { status: 'published' };
    
    if (search) {
      query.$text = { $search: search };
    }
    
    if (category) {
      query.category = category;
    }
    
    if (author) {
      query.author = author;
    }

    // Build sort
    let sortQuery: Record<string, 1 | -1> = {};
    switch (sort) {
      case 'oldest':
        sortQuery = { publishedAt: 1 };
        break;
      case 'popular':
        sortQuery = { views: -1 };
        break;
      case 'latest':
      default:
        sortQuery = { publishedAt: -1 };
        break;
    }

    let blogs: Record<string, unknown>[] = [];
    let total = 0;
    let totalPages = 0;
    let categories: CategoryData[] = [];

    try {
      blogs = await Blog.find(query)
        .populate('author', 'name')
        .sort(sortQuery)
        .skip(skip)
        .limit(limit)
        .lean(); // Use lean() to get plain objects

      total = await Blog.countDocuments(query);
      totalPages = Math.ceil(total / limit);

      // Get categories for filter
      categories = await Blog.aggregate([
        { $match: { status: 'published' } },
        { $group: { _id: '$category', count: { $sum: 1 } } },
        { $sort: { count: -1 } },
        { $limit: 10 }
      ]);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      // Continue with empty arrays
    }

    // Safely serialize blog data
    const safeBlogs = blogs
      .map(safeSerializeBlog)
      .filter((blog): blog is BlogData => blog !== null);

    return (
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">Blog</h1>
          <p className="text-muted-foreground">
            Discover stories, thinking, and expertise from writers on any topic.
          </p>
        </div>

        {/* Filters */}
        <SearchFilters 
          search={search}
          category={category}
          sort={sort}
          categories={categories}
        />

        {/* Blog Grid */}
        {safeBlogs.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {safeBlogs.map((blog) => (
              <BlogCard 
                key={blog._id} 
                blog={blog}
                excerptLength={80}
                showReadMore={true}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <svg className="h-8 w-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2">No posts found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search criteria or browse all posts.
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <nav className="flex items-center gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                <a
                  key={pageNum}
                  href={`/blog?page=${pageNum}`}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    pageNum === page
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {pageNum}
                </a>
              ))}
            </nav>
          </div>
        )}
      </div>
    );
  } catch (error) {
    console.error('Error in BlogPage:', error);
    return (
      <div className="max-w-7xl mx-auto">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Error Loading Blog</h1>
          <p className="text-muted-foreground">
            Something went wrong while loading the blog posts.
          </p>
        </div>
      </div>
    );
  }
} 