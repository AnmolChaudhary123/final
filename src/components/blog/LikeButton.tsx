"use client";

import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface LikeButtonProps {
  blogId: string;
  initialLikes: string[];
  className?: string;
}

export function LikeButton({ blogId, initialLikes, className = '' }: LikeButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(initialLikes.length);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      setIsLiked(initialLikes.includes(session.user.id));
    }
  }, [session, initialLikes]);

  const handleLike = async () => {
    if (!session) {
      // Redirect to login if not authenticated
      router.push('/auth/signin');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/blogs/${blogId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setIsLiked(data.isLiked);
        setLikeCount(data.likeCount);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    } finally {
      setIsLoading(false);
      // Refresh the page to update the UI
      router.refresh();
    }
  };

  return (
    <button
      onClick={handleLike}
      disabled={isLoading}
      className={`flex items-center gap-1 text-sm ${className} ${
        isLiked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
      }`}
      aria-label={isLiked ? 'Unlike this post' : 'Like this post'}
    >
      <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
      <span>{likeCount}</span>
    </button>
  );
}
