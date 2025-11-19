import { useEffect, useState } from 'react';

export const useLazyImage = (src, placeholder = '') => {
  const [imageSrc, setImageSrc] = useState(placeholder);
  const [imageLoading, setImageLoading] = useState(true);

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    img.src = src;

    img.onload = () => {
      setImageSrc(src);
      setImageLoading(false);
    };

    img.onerror = () => {
      setImageLoading(false);
    };
  }, [src]);

  return { imageSrc, imageLoading };
};
