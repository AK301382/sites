import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { galleryImages, businessInfo } from '../mock';
import { Badge } from '../components/ui/badge';
import { useLanguage } from '../context/LanguageContext';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState('All');
  const [currentMobileIndex, setCurrentMobileIndex] = useState(0);
  const { t } = useLanguage();

  const allLabel = t('gallery.all');
  const styles = [allLabel, ...new Set(galleryImages.map(img => img.style))];
  const filteredImages = filter === allLabel
    ? galleryImages 
    : galleryImages.filter(img => img.style === filter);

  const handlePrevious = () => {
    setCurrentMobileIndex((prev) => 
      prev === 0 ? filteredImages.length - 1 : prev - 1
    );
  };

  const handleNext = () => {
    setCurrentMobileIndex((prev) => 
      prev === filteredImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="py-20 px-4 bg-gradient-to-br from-rose-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-rose-600 to-rose-500 bg-clip-text text-transparent mb-6">
            {t('gallery.title')}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {t('gallery.subtitle')}
          </p>
          <p className="text-lg text-gray-700">
            {t('gallery.followText')} <a href={businessInfo.instagram} target="_blank" rel="noopener noreferrer" className="font-semibold text-rose-600 hover:text-rose-700 underline">{businessInfo.instagramHandle}</a>
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 px-4 bg-white border-b border-rose-100">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {styles.map((style) => (
              <button
                key={style}
                onClick={() => {
                  setFilter(style);
                  setCurrentMobileIndex(0);
                }}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  filter === style
                    ? 'bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-md'
                    : 'bg-rose-50 text-gray-700 hover:bg-rose-100'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Desktop Gallery Grid */}
      <section className="hidden md:block py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                onClick={() => setSelectedImage(image)}
                className="relative aspect-square overflow-hidden rounded-xl group cursor-pointer shadow-md hover:shadow-xl transition-shadow"
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-rose-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <Badge className="bg-white text-rose-600 hover:bg-white">
                      {image.style}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mobile Gallery Carousel */}
      <section className="md:hidden py-12 px-4 bg-white">
        <div className="max-w-lg mx-auto">
          <div className="relative">
            {/* Main Image */}
            <div className="relative aspect-square overflow-hidden rounded-xl shadow-xl">
              <img
                src={filteredImages[currentMobileIndex]?.url}
                alt={filteredImages[currentMobileIndex]?.alt}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-rose-900/80 to-transparent">
                <Badge className="bg-white text-rose-600">
                  {filteredImages[currentMobileIndex]?.style}
                </Badge>
              </div>
            </div>

            {/* Navigation Arrows */}
            <button
              onClick={handlePrevious}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors z-10"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} className="text-rose-600" />
            </button>
            <button
              onClick={handleNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors z-10"
              aria-label="Next image"
            >
              <ChevronRight size={24} className="text-rose-600" />
            </button>

            {/* Dots Indicator */}
            <div className="flex justify-center mt-4 space-x-2">
              {filteredImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentMobileIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    index === currentMobileIndex
                      ? 'bg-rose-600 w-6'
                      : 'bg-rose-200'
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>

            {/* Counter */}
            <div className="text-center mt-4">
              <p className="text-sm text-gray-600">
                {currentMobileIndex + 1} / {filteredImages.length}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Instagram CTA */}
      <section className="py-20 px-4 bg-gradient-to-br from-rose-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-rose-500 bg-clip-text text-transparent mb-6">
            {t('gallery.instagramTitle')}
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            {t('gallery.instagramSubtitle')}
          </p>
          <a
            href={businessInfo.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-rose-600 to-rose-500 text-white rounded-full hover:from-rose-700 hover:to-rose-600 transition-all transform hover:scale-105 shadow-lg text-lg font-medium"
          >
            <span>{t('gallery.followButton')}</span>
          </a>
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-white" />
          </button>
          <div className="max-w-4xl w-full" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage.url}
              alt={selectedImage.alt}
              className="w-full h-auto rounded-lg"
            />
            <div className="mt-4 text-center">
              <Badge className="bg-white text-rose-600">
                {selectedImage.style}
              </Badge>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;