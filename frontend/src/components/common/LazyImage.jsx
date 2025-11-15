import React, { useState, useEffect, useRef } from 'react';

/**
 * LazyImage Component - Optimized image loading with lazy loading
 * Features:
 * - Intersection Observer for lazy loading
 * - Blur-up placeholder effect
 * - Error handling with fallback
 * - Performance optimized
 */
const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholderClassName = '',
  fallbackSrc = 'https://images.unsplash.com/photo-1557821552-17105176677c?w=400',
  threshold = 0.1
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    if (!imgRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold, rootMargin: '50px' }
    );

    observer.observe(imgRef.current);

    return () => observer.disconnect();
  }, [threshold]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setError(true);
    setIsLoaded(true);
  };

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
      {/* Placeholder */}
      {!isLoaded && (
        <div 
          className={`absolute inset-0 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 animate-pulse ${placeholderClassName}`}
        />
      )}
      
      {/* Actual Image */}
      {isInView && (
        <img
          src={error ? fallbackSrc : src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={`${className} transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="lazy"
        />
      )}
    </div>
  );
};

export default LazyImage;
