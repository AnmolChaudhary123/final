'use client';

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { getSafeImageUrl } from '@/utils';

interface BlogImageProps {
  src?: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export default function BlogImage({ src, alt, className = "", priority = false }: BlogImageProps) {
  const [imageSrc, setImageSrc] = useState(getSafeImageUrl(src));

  // Update image after hydration to avoid mismatch
  useEffect(() => {
    if (!src || src.includes('via.placeholder.com') || src.includes('placeholder.com')) {
      const randomId = Math.floor(Math.random() * 1000);
      setImageSrc(`https://picsum.photos/800/400?random=${randomId}`);
    }
  }, [src]);

  return (
    <div className={className}>
      <Image
        src={imageSrc}
        alt={alt}
        fill
        className="object-cover rounded-lg"
        sizes="(max-width: 768px) 100vw, 800px"
        priority={priority}
      />
    </div>
  );
} 