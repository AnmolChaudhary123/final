'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Save, ArrowLeft } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import RichTextEditor from '@/components/RichTextEditor';

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

      if (response.ok) {
        const data = await response.json();
        router.push(`/blog/${data.slug}`);
      } else {
        const error = await response.json();
        alert(error.message || 'Something went wrong');
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
        <h1 className="text-3xl font-bold">Create New Post</h1>
        <p className="text-muted-foreground mt-2">
          Share your thoughts and ideas with the world
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
            Excerpt *
          </label>
          <textarea
            value={formData.excerpt}
            onChange={(e) => handleChange('excerpt', e.target.value)}
            className="input w-full h-24"
            placeholder="Write a brief excerpt of your blog post..."
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Category *
          </label>
          <select
            value={formData.category}
            onChange={(e) => handleChange('category', e.target.value)}
            className="input w-full"
            required
          >
            <option value="">Select a category</option>
            <option value="Technology">Technology</option>
            <option value="Travel">Travel</option>
            <option value="Food">Food</option>
            <option value="Lifestyle">Lifestyle</option>
            <option value="Business">Business</option>
            <option value="Health">Health</option>
            <option value="Education">Education</option>
            <option value="Entertainment">Entertainment</option>
          </select>
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
          <label className="block text-sm font-medium mb-2">
            Featured Image URL
          </label>
          <div className="space-y-4">
            <input
              type="url"
              value={formData.featuredImage}
              onChange={(e) => handleChange('featuredImage', e.target.value)}
              className="input"
              placeholder="https://example.com/image.jpg"
            />
            {formData.featuredImage && (
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20">
                  <Image
                    src={formData.featuredImage}
                    alt="Featured"
                    fill
                    className="object-cover rounded-lg border"
                    sizes="80px"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                </div>
                <span className="text-sm text-muted-foreground">
                  Preview of featured image
                </span>
              </div>
            )}
          </div>
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
          </div>

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
        </div>

        {/* Submit Button */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="btn btn-primary"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Create Post
              </>
            )}
          </button>
          
          <Link href="/dashboard" className="btn btn-outline">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
} 