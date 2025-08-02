'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search, Filter, X } from 'lucide-react';

interface SearchFiltersProps {
  search: string;
  category: string;
  sort: string;
  categories: Array<{ _id: string; count: number }>;
}

export default function SearchFilters({ search, category, sort, categories }: SearchFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [localSearch, setLocalSearch] = useState(search);
  const [localCategory, setLocalCategory] = useState(category);
  const [localSort, setLocalSort] = useState(sort);

  const updateFilters = () => {
    const params = new URLSearchParams(searchParams);
    
    if (localSearch) {
      params.set('search', localSearch);
    } else {
      params.delete('search');
    }
    
    if (localCategory) {
      params.set('category', localCategory);
    } else {
      params.delete('category');
    }
    
    if (localSort && localSort !== 'latest') {
      params.set('sort', localSort);
    } else {
      params.delete('sort');
    }
    
    params.delete('page'); // Reset to first page when filters change
    
    router.push(`/blog?${params.toString()}`);
  };

  const clearFilters = () => {
    setLocalSearch('');
    setLocalCategory('');
    setLocalSort('latest');
    router.push('/blog');
  };

  const hasActiveFilters = search || category || (sort && sort !== 'latest');

  return (
    <div className="mb-8 space-y-4">
      {/* Search Bar */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500 dark:text-gray-400" />
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && updateFilters()}
            placeholder="Search posts..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
          />
        </div>
        <button
          onClick={updateFilters}
          className="btn btn-primary"
        >
          Search
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 items-center">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-gray-500 dark:text-gray-400" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Filters:</span>
        </div>

        {/* Category Filter */}
        <select
          value={localCategory}
          onChange={(e) => setLocalCategory(e.target.value)}
          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat._id} ({cat.count})
            </option>
          ))}
        </select>

        {/* Sort Filter */}
        <select
          value={localSort}
          onChange={(e) => setLocalSort(e.target.value)}
          className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          <option value="latest">Latest</option>
          <option value="oldest">Oldest</option>
          <option value="popular">Most Popular</option>
        </select>

        {/* Apply Filters */}
        <button
          onClick={updateFilters}
          className="btn btn-outline btn-sm"
        >
          Apply Filters
        </button>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="btn btn-ghost btn-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <X className="h-4 w-4 mr-1" />
            Clear All
          </button>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {search && (
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-800">
              Search: &quot;{search}&quot;
            </span>
          )}
          {category && (
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border-green-200 dark:border-green-800">
              Category: {category}
            </span>
          )}
          {sort && sort !== 'latest' && (
            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 border-purple-200 dark:border-purple-800">
              Sort: {sort}
            </span>
          )}
        </div>
      )}
    </div>
  );
} 