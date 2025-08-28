'use client';

import { useState } from 'react';
import Image from 'next/image';

interface PlaceholderImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  fallbackText?: string;
  isDark?: boolean;
}

const PlaceholderImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  fallbackText = 'Image',
  isDark = false,
}: PlaceholderImageProps) => {
  const [imageError, setImageError] = useState(false);

  const handleError = () => {
    setImageError(true);
  };

  if (imageError) {
    return (
      <div
        className={`flex items-center justify-center ${
          isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-500'
        } ${className}`}
        style={{ width, height }}
        role="img"
        aria-label={alt}
      >
        <div className="text-center">
          <svg
            className={`mx-auto h-12 w-12 ${
              isDark ? 'text-gray-400' : 'text-gray-400'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          <p className="mt-2 text-sm">{fallbackText}</p>
        </div>
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      onLoad={() => setImageError(false)}
    />
  );
};

export default PlaceholderImage;
