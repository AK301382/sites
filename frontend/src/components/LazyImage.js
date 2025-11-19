import React, { memo } from 'react';
import { useLazyImage } from '../hooks/useLazyImage';

const LazyImage = memo(({ src, thumb, alt, className = '', ...props }) => {
  const { imageSrc, imageLoading } = useLazyImage(src, thumb);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={imageSrc}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          imageLoading ? 'opacity-50 blur-sm' : 'opacity-100'
        }`}
        loading="lazy"
        {...props}
      />
      {imageLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse" />
      )}
    </div>
  );
});

LazyImage.displayName = 'LazyImage';

export default LazyImage;
