import React, { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Card } from '../components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Memoized Loading Component
const LoadingSpinner = memo(() => (
  <div className="min-h-screen flex items-center justify-center pt-20">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-[#F4C2C2] border-t-[#D4AF76] rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-[#3E3E3E]">Loading...</p>
    </div>
  </div>
));
LoadingSpinner.displayName = 'LoadingSpinner';

// Memoized Gallery Card
const GalleryCard = memo(({ item, getLocalizedText, onClick, index }) => (
  <Card
    className="overflow-hidden cursor-pointer group hover:shadow-xl transition-shadow"
    onClick={onClick}
    data-testid={`gallery-item-${index}`}
  >
    <div className="aspect-square relative overflow-hidden">
      <img 
        src={item.image_url} 
        alt={getLocalizedText(item, 'title')} 
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" 
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
        <div className="text-white">
          <p className="font-semibold text-sm">{getLocalizedText(item, 'title')}</p>
          <p className="text-xs">{item.artist_name}</p>
        </div>
      </div>
    </div>
  </Card>
));
GalleryCard.displayName = 'GalleryCard';

const GalleryPage = () => {
  const { t, i18n } = useTranslation();
  const [galleryItems, setGalleryItems] = useState([]);
  const [selectedStyle, setSelectedStyle] = useState('all');
  const [selectedColor, setSelectedColor] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [styles, setStyles] = useState([]);
  const [colors, setColors] = useState([]);

  // Memoized default gallery data
  const defaultGallery = useMemo(() => [
    {
      id: '1', image_url: 'https://images.unsplash.com/photo-1611821828952-3453ba0f9408',
      title_en: 'Elegant Minimalist', title_de: 'Eleganter Minimalist', title_fr: 'Minimaliste Élégant',
      artist_name: 'Artist', style: 'Minimalist', colors: ['Nude', 'White'],
    },
    {
      id: '2', image_url: 'https://images.unsplash.com/photo-1698308233758-d55c98fd7444',
      title_en: 'Black & Silver Art', title_de: 'Schwarz & Silber Kunst', title_fr: 'Art Noir & Argent',
      artist_name: 'Artist', style: 'Modern', colors: ['Black', 'Silver'],
    },
    {
      id: '3', image_url: 'https://images.unsplash.com/photo-1617472556169-c5547fde3282',
      title_en: 'Clean Design', title_de: 'Sauberes Design', title_fr: 'Design Épuré',
      artist_name: 'Artist', style: 'Minimalist', colors: ['Nude', 'Pink'],
    },
    {
      id: '4', image_url: 'https://images.unsplash.com/photo-1571290274554-6a2eaa771e5f',
      title_en: 'Colorful Geometric', title_de: 'Buntes Geometrisch', title_fr: 'Géométrique Coloré',
      artist_name: 'Artist', style: 'Modern', colors: ['Red', 'Orange', 'Yellow'],
    },
    {
      id: '5', image_url: 'https://images.pexels.com/photos/6429663/pexels-photo-6429663.jpeg',
      title_en: 'Professional Colorful', title_de: 'Professionell Bunt', title_fr: 'Coloré Professionnel',
      artist_name: 'Artist', style: 'Artistic', colors: ['Pink', 'Purple', 'Blue'],
    },
    {
      id: '6', image_url: 'https://images.unsplash.com/photo-1648844421638-0655d00dd5ba',
      title_en: 'Glitter Glamour', title_de: 'Glitzer Glamour', title_fr: 'Glamour Pailletté',
      artist_name: 'Artist', style: 'Glitter', colors: ['Gold', 'Silver'],
    },
    {
      id: '7', image_url: 'https://images.unsplash.com/photo-1648844421727-cde6c4246b13',
      title_en: 'Elegant Glitter', title_de: 'Eleganter Glitzer', title_fr: 'Paillettes Élégantes',
      artist_name: 'Artist', style: 'Glitter', colors: ['Gold', 'Nude'],
    },
    {
      id: '8', image_url: 'https://images.unsplash.com/photo-1648844421753-351afd50486a',
      title_en: 'Professional Glitter', title_de: 'Professioneller Glitzer', title_fr: 'Paillettes Professionnelles',
      artist_name: 'Artist', style: 'Glitter', colors: ['Silver', 'White'],
    },
    {
      id: '9', image_url: 'https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg',
      title_en: 'Colorful Display', title_de: 'Bunte Anzeige', title_fr: 'Affichage Coloré',
      artist_name: 'Artist', style: 'Artistic', colors: ['Red', 'Blue', 'Green', 'Yellow'],
    },
    {
      id: '10', image_url: 'https://images.pexels.com/photos/6830805/pexels-photo-6830805.jpeg',
      title_en: 'Professional Art', title_de: 'Professionelle Kunst', title_fr: 'Art Professionnel',
      artist_name: 'Artist', style: 'French', colors: ['Nude', 'White'],
    },
  ], []);

  // Memoized data fetching
  const fetchGalleryData = useCallback(async () => {
    try {
      const [galleryRes, stylesRes, colorsRes] = await Promise.all([
        axios.get(`${API}/gallery`),
        axios.get(`${API}/gallery-styles`),
        axios.get(`${API}/gallery-colors`)
      ]);
      
      const items = galleryRes.data && galleryRes.data.length > 0 ? galleryRes.data : defaultGallery;
      setGalleryItems(items);
      
      // Get unique styles from actual gallery items
      const usedStylesEn = [...new Set(items.map(item => item.style))];
      const filteredStyles = stylesRes.data.filter(style => usedStylesEn.includes(style.name_en));
      setStyles(filteredStyles);
      
      // Get unique colors from actual gallery items
      const usedColorsEn = [...new Set(items.flatMap(item => item.colors || []))];
      const filteredColors = colorsRes.data.filter(color => usedColorsEn.includes(color.name_en));
      setColors(filteredColors);
      
      setLoading(false);
    } catch (error) {
      console.error('Error fetching gallery data:', error);
      setGalleryItems(defaultGallery);
      setLoading(false);
    }
  }, [defaultGallery]);

  useEffect(() => {
    fetchGalleryData();
  }, [fetchGalleryData]);

  // Memoized localization function
  const getLocalizedText = useCallback((item, field) => {
    const lang = i18n.language;
    return item[`${field}_${lang}`] || item[`${field}_en`];
  }, [i18n.language]);

  // Memoized filtered items
  const filteredItems = useMemo(() => {
    let filtered = [...galleryItems];

    if (selectedStyle !== 'all') {
      filtered = filtered.filter((item) => item.style === selectedStyle);
    }

    if (selectedColor !== 'all') {
      filtered = filtered.filter((item) => item.colors && item.colors.includes(selectedColor));
    }

    return filtered;
  }, [galleryItems, selectedStyle, selectedColor]);

  // Memoized handlers
  const handleStyleChange = useCallback((value) => {
    setSelectedStyle(value);
  }, []);

  const handleColorChange = useCallback((value) => {
    setSelectedColor(value);
  }, []);

  const handleImageClick = useCallback((item) => {
    setSelectedImage(item);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setSelectedImage(null);
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-[#F8E6E9] to-white" data-testid="gallery-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-[#8B6F8E]" style={{ fontFamily: 'Playfair Display, serif' }}>
            {t('gallery.title')}
          </h1>
          <p className="text-base sm:text-lg text-[#3E3E3E]/70 max-w-2xl mx-auto">Discover our stunning nail art creations</p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white border-b border-[#F8E6E9]" data-testid="gallery-filters">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-2 text-[#3E3E3E]">{t('gallery.filter')} Style</label>
              <Select value={selectedStyle} onValueChange={handleStyleChange}>
                <SelectTrigger className="w-full" data-testid="style-filter">
                  <SelectValue placeholder="All Styles" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all" data-testid="style-all">
                    {t('gallery.allStyles')}
                  </SelectItem>
                  {styles.map((style) => (
                    <SelectItem key={style.id} value={style.name_en} data-testid={`style-${style.id}`}>
                      {getLocalizedText(style, 'name')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-2 text-[#3E3E3E]">{t('gallery.filter')} Color</label>
              <Select value={selectedColor} onValueChange={handleColorChange}>
                <SelectTrigger className="w-full" data-testid="color-filter">
                  <SelectValue placeholder="All Colors" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  <SelectItem value="all" data-testid="color-all">
                    {t('gallery.allColors')}
                  </SelectItem>
                  {colors.map((color) => (
                    <SelectItem key={color.id} value={color.name_en} data-testid={`color-${color.id}`}>
                      {getLocalizedText(color, 'name')}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 bg-white" data-testid="gallery-grid">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filteredItems.map((item, index) => (
                <GalleryCard
                  key={item.id}
                  item={item}
                  getLocalizedText={getLocalizedText}
                  onClick={() => handleImageClick(item)}
                  index={index}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-[#3E3E3E]/70">No items match your filters</p>
            </div>
          )}
        </div>
      </section>

      {/* Image Dialog */}
      <Dialog open={selectedImage !== null} onOpenChange={handleCloseDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-[90vw] md:w-auto" data-testid="gallery-dialog" aria-describedby="gallery-dialog-description">
          {selectedImage && (
            <>
              <DialogHeader>
                <DialogTitle className="text-xl sm:text-2xl font-bold text-[#8B6F8E]" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {getLocalizedText(selectedImage, 'title')}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4" id="gallery-dialog-description">
                <img src={selectedImage.image_url} alt={getLocalizedText(selectedImage, 'title')} className="w-full rounded-lg max-h-[60vh] object-contain" />
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[#3E3E3E]/70">Artist</p>
                    <p className="font-semibold text-[#3E3E3E]">{selectedImage.artist_name}</p>
                  </div>
                  <div>
                    <p className="text-[#3E3E3E]/70">Style</p>
                    <p className="font-semibold text-[#3E3E3E]">{selectedImage.style}</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default memo(GalleryPage);