import { formatDistanceToNow } from 'date-fns';

// Generate slug from title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Calculate read time based on content
export function calculateReadTime(content: string): number {
  const wordsPerMinute = 200;
  const wordCount = content.trim().split(/\s+/).length;
  return Math.ceil(wordCount / wordsPerMinute);
}

// Format date for display
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return formatDistanceToNow(dateObj, { addSuffix: true });
}

// Truncate text to specified length
export function truncateText(text: string, maxLength: number): string {
  if (!text || typeof text !== 'string') return '';
  if (text.length <= maxLength) return text;
  
  // Find the last complete word within the limit
  const truncated = text.slice(0, maxLength);
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  if (lastSpaceIndex > 0) {
    return truncated.slice(0, lastSpaceIndex) + '...';
  }
  
  return truncated + '...';
}

// Generate excerpt from content
export function generateExcerpt(content: string, maxLength: number = 150): string {
  try {
    if (!content || typeof content !== 'string') {
      return '';
    }
    
    // Remove HTML tags and get plain text
    const plainText = content.replace(/<[^>]*>/g, '').trim();
    return truncateText(plainText, maxLength);
  } catch (error) {
    console.error('Error generating excerpt:', error);
    return '';
  }
}

// Validate email format
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Capitalize first letter
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// Generate random string
export function generateRandomString(length: number = 8): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Get fallback image URL (deterministic)
export function getFallbackImage(width: number = 800, height: number = 400): string {
  // Use a static placeholder image that's consistent
  return `https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=${width}&h=${height}&fit=crop&crop=center`;
}

// Check if image URL is valid and provide fallback
export function getSafeImageUrl(imageUrl: string | undefined, width: number = 800, height: number = 400): string {
  if (!imageUrl || imageUrl.trim() === '') {
    return getFallbackImage(width, height);
  }
  
  // If it's a placeholder.com URL, replace with static image
  if (imageUrl.includes('via.placeholder.com') || imageUrl.includes('placeholder.com')) {
    return getFallbackImage(width, height);
  }
  
  return imageUrl;
}

// Client-side only function for random images (to avoid hydration issues)
export function getRandomImageUrl(width: number = 800, height: number = 400): string {
  if (typeof window === 'undefined') {
    // Server-side: return deterministic image
    return getFallbackImage(width, height);
  }
  
  // Client-side: return random image
  const randomId = Math.floor(Math.random() * 1000);
  return `https://picsum.photos/${width}/${height}?random=${randomId}`;
} 