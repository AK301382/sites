import React, { useState, useMemo, Suspense } from 'react';
import { Instagram } from 'lucide-react';
import { galleryImages, businessInfo } from '../data/businessData';
import LazyImage from '../components/LazyImage';
import LoadingSpinner from '../components/LoadingSpinner';
import { useLanguage } from '../context/LanguageContext';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const AnimatedSection = ({ children, className = '' }) => {
  const { targetRef, hasIntersected } = useIntersectionObserver({ threshold: 0.05 });

  return (
    <div
      ref={targetRef}
      className={`transition-all duration-700 ${
        hasIntersected ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      } ${className}`}
    >
      {children}
    </div>
  );
};

const Gallery = () => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);

  const categories = [
    { value: 'all', label: t('gallery.categories.all') },
    { value: 'minimalist', label: t('gallery.categories.minimalist') },
    { value: 'classic', label: t('gallery.categories.classic') },
    { value: 'artistic', label: t('gallery.categories.artistic') },
    { value: 'gel', label: t('gallery.categories.gel') },
    { value: 'modern', label: t('gallery.categories.modern') },
    { value: 'spa', label: t('gallery.categories.spa') },
    { value: 'acrylic', label: t('gallery.categories.acrylic') }
  ];

  const filteredImages = useMemo(() => {
    if (selectedCategory === 'all') return galleryImages;
    return galleryImages.filter(img => img.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen pt-16 md:pt-20">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-red-50 via-rose-50 to-white overflow-hidden">
        <div className="absolute top-10 right-10 w-40 h-40 bg-rose-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-red-200 rounded-full blur-3xl opacity-20"></div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-rose-600 to-rose-500 bg-clip-text text-transparent mb-6">
            {t('gallery.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
            {t('gallery.subtitle')}
          </p>
          <p className="text-gray-600 mb-4">{t('gallery.followText')}</p>
          <a
            href={businessInfo.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 text-rose-600 hover:text-rose-700 font-semibold transition-colors"
          >
            <Instagram className="w-5 h-5" />
            <span>{businessInfo.instagramHandle}</span>
          </a>
        </div>
      </section>

      {/* Category Filter */}
      <AnimatedSection>
        <section className="py-8 px-4 bg-white border-b border-gray-100 sticky top-16 md:top-20 z-40 backdrop-blur-sm bg-white/95">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                    selectedCategory === category.value
                      ? 'bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  data-testid={`gallery-category-${category.value}`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Gallery Grid */}
      <AnimatedSection>
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredImages.map((image, index) => (
                <div
                  key={image.id}
                  className="relative aspect-square overflow-hidden rounded-xl group cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300"
                  onClick={() => setSelectedImage(image)}
                  style={{ animationDelay: `${index * 0.05}s` }}
                  data-testid={`gallery-image-${image.id}`}
                >
                  <Suspense fallback={<LoadingSpinner />}>
                    <LazyImage
                      src={image.url}
                      thumb={image.thumb}
                      alt={image.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </Suspense>
                  <div className="absolute inset-0 bg-gradient-to-t from-rose-900/80 via-rose-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <span className="inline-block px-3 py-1 bg-white text-rose-600 rounded-full text-sm font-medium">
                        {image.style}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredImages.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Keine Bilder in dieser Kategorie gefunden.</p>
              </div>
            )}
          </div>
        </section>
      </AnimatedSection>

      {/* Instagram CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-rose-600 to-rose-500 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <Instagram className="w-16 h-16 mx-auto mb-6" />
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('gallery.instagramTitle')}
          </h2>
          <p className="text-xl text-rose-100 mb-8">
            {t('gallery.instagramSubtitle')}
          </p>
          <a
            href={businessInfo.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-rose-600 rounded-full hover:bg-red-50 hover:shadow-2xl transition-all transform hover:scale-105 shadow-lg text-lg font-medium"
            data-testid="instagram-follow-button"
          >
            <Instagram className="w-5 h-5" />
            <span>{t('gallery.followButton')}</span>
          </a>
        </div>
      </section>

      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-rose-300 transition-colors"
              aria-label="Close"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={selectedImage.url}
              alt={selectedImage.alt}
              className="w-full h-auto rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="mt-4 text-center text-white">
              <span className="inline-block px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                {selectedImage.style}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;
