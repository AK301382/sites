import React, { useState } from 'react';
import { X } from 'lucide-react';
import { galleryImages, businessInfo } from '../mock';
import { Badge } from '../components/ui/badge';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState('Alle');

  const styles = ['Alle', ...new Set(galleryImages.map(img => img.style))];
  const filteredImages = filter === 'Alle' 
    ? galleryImages 
    : galleryImages.filter(img => img.style === filter);

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Unsere Nagelkunst
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Lassen Sie sich von unseren Arbeiten inspirieren
          </p>
          <p className="text-lg text-gray-700">
            Folgen Sie uns auf Instagram: <a href={businessInfo.instagram} target="_blank" rel="noopener noreferrer" className="font-semibold underline">{businessInfo.instagramHandle}</a>
          </p>
        </div>
      </section>

      {/* Filter */}
      <section className="py-8 px-4 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap gap-3 justify-center">
            {styles.map((style) => (
              <button
                key={style}
                onClick={() => setFilter(style)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  filter === style
                    ? 'bg-gray-900 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredImages.map((image) => (
              <div
                key={image.id}
                onClick={() => setSelectedImage(image)}
                className="relative aspect-square overflow-hidden rounded-lg group cursor-pointer"
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <Badge className="bg-white text-gray-900">
                      {image.style}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Instagram CTA */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Mehr auf Instagram
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Folgen Sie uns für tägliche Nagelkunst-Inspiration
          </p>
          <a
            href={businessInfo.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all transform hover:scale-105 shadow-lg text-lg font-medium"
          >
            <span>@le_nails_bern folgen</span>
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
              <Badge className="bg-white text-gray-900">
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