'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Save, ArrowLeft, Globe } from 'lucide-react';
import Link from 'next/link';
import RichTextEditor from '@/components/RichTextEditor';
import ImageUpload from '@/components/ImageUpload';
import ExplanationEditor from '@/components/ExplanationEditor';

interface BlogFormData {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string;
  featuredImage: string;
  status: 'draft' | 'published';
  isFeatured: boolean;
}

export default function CreateBlogPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [categories, setCategories] = useState([
    'Technology',
    'Travel',
    'Food',
    'Lifestyle',
    'Health & Wellness',
    'Business',
    'Education',
    'Entertainment',
  ]);
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    content: '',
    excerpt: '',
    category: '',
    tags: '',
    featuredImage: '',
    status: 'draft',
    isFeatured: false,
  });

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) {
      router.push('/auth/signin');
    }
  }, [session, status, router]);

  const handleChange = (field: keyof BlogFormData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return;

    setIsLoading(true);

    try {
      const response = await fetch('/api/blogs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        }),
      });

      const contentType = response.headers.get('content-type');
      
      if (response.ok) {
        try {
          // Only try to parse JSON if there's content
          const data = contentType?.includes('application/json') ? await response.json() : {};
          if (formData.status === 'published') {
            router.push(`/blog/${data.slug || ''}`);
          } else {
            router.push('/dashboard');
          }
        } catch (jsonError) {
          console.error('Error parsing JSON response:', jsonError);
          // If JSON parsing fails but the response was OK, still proceed with navigation
          router.push('/dashboard');
        }
      } else {
        let errorMessage = 'Something went wrong';
        try {
          const errorData = contentType?.includes('application/json') 
            ? await response.json() 
            : { message: await response.text() };
          errorMessage = errorData.message || errorMessage;
        } catch (error) {
          console.error('Error parsing error response:', error);
        }
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Error creating blog:', error);
      alert('Something went wrong');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!session) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Link href="/dashboard" className="btn btn-ghost">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Create New Post</h1>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${formData.status === 'published' ? 'bg-green-500' : 'bg-yellow-500'
              }`}></div>
            <span className="text-sm font-medium capitalize text-muted-foreground">
              {formData.status}
            </span>
          </div>
        </div>
        <p className="text-muted-foreground mt-2">
          {formData.status === 'draft'
            ? 'Save your work as a draft to continue later'
            : 'Share your thoughts and ideas with the world'
          }
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Title *
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => handleChange('title', e.target.value)}
            className="input w-full"
            placeholder="Enter your blog title"
            required
          />
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Content *
          </label>
          <RichTextEditor
            value={formData.content}
            onChange={(value) => handleChange('content', value)}
            placeholder="Write your blog content..."
          />
        </div>

        {/* Excerpt */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Explain
          </label>
          <ExplanationEditor
            value={formData.excerpt}
            onChange={(value) => handleChange('excerpt', value)}
            placeholder="Write a brief excerpt of your blog post..."
             />
        </div>

        {/* Category */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4" />
              <label className="block text-sm font-medium">
                Category *
              </label>
            </div>
            {!showCustomCategory && (
              <button
                type="button"
                onClick={() => setShowCustomCategory(true)}
                className="text-xs text-blue-500 hover:underline"
              >
                + Add Custom Category
              </button>
            )}
          </div>
          
          {showCustomCategory ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="input flex-1"
                placeholder="Enter your custom category"
                required
              />
              <button
                type="button"
                onClick={() => {
                  if (formData.category.trim() && !categories.includes(formData.category)) {
                    setCategories([...categories, formData.category]);
                  }
                  setShowCustomCategory(false);
                }}
                className="btn btn-outline"
              >
                Save
              </button>
            </div>
          ) : (
            <select
              value={formData.category}
              onChange={(e) => {
                if (e.target.value === 'custom') {
                  setShowCustomCategory(true);
                  handleChange('category', '');
                } else {
                  handleChange('category', e.target.value);
                }
              }}
              className="input w-full"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
              <option value="custom">+ Add New Category</option>
            </select>
          )}
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Tags
          </label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => handleChange('tags', e.target.value)}
            className="input w-full"
            placeholder="Enter tags separated by commas"
          />
        </div>

        {/* Featured Image URL */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <label className="block text-sm font-medium">
              Featured Image
            </label>
            <span className="text-xs text-muted-foreground">(Optional)</span>
          </div>
          <ImageUpload
            value={formData.featuredImage}
            onChange={(url) => handleChange('featuredImage', url)}
            placeholder="Upload featured image for your blog post"
            maxSize={20}
          />
        </div>

        {/* Status and Featured */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) => handleChange('status', e.target.value as 'draft' | 'published')}
              className="input w-full"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
            <p className="text-xs text-muted-foreground mt-1">
              {formData.status === 'draft'
                ? 'Draft posts are saved but not visible to the public'
                : 'Published posts are visible to all visitors'
              }
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Featured Post
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isFeatured"
                checked={formData.isFeatured}
                onChange={(e) => handleChange('isFeatured', e.target.checked)}
                className="rounded border-gray-300"
              />
              <label htmlFor="isFeatured" className="text-sm font-medium">
                Mark as Featured
              </label>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Featured posts appear prominently on the homepage
            </p>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className={`btn flex-1 ${formData.status === 'published'
              ? 'btn-primary'
              : 'btn-outline'
              }`}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2"></div>
                {formData.status === 'published' ? 'Publishing...' : 'Saving...'}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {formData.status === 'published' ? 'Publish Post' : 'Save as Draft'}
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              const newStatus = formData.status === 'draft' ? 'published' : 'draft';
              handleChange('status', newStatus);
            }}
            disabled={isLoading}
            className="btn btn-outline flex-1"
          >
            {formData.status === 'draft' ? 'Switch to Publish' : 'Switch to Draft'}
          </button>
        </div>

        {/* Status Indicator */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${formData.status === 'published' ? 'bg-green-500' : 'bg-yellow-500'
              }`}></div>
            <span className="text-muted-foreground">
              Status: <span className="font-medium capitalize">{formData.status}</span>
            </span>
          </div>
          {formData.isFeatured && (
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              ⭐ Featured Post
            </span>
          )}
        </div>

        {/* Cancel Button */}
        <div className="flex justify-end">
          <Link href="/dashboard" className="btn btn-outline">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}












