import React, { useEffect, useState, useMemo, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { useCachedApi } from '@/hooks/useApi';
import { api } from '@/utils/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Clock, Sparkles, Shield, Heart, Award, Users, Trophy } from 'lucide-react';

// Memoized Hero Slider Component
const HeroSlider = memo(({ images, currentIndex }) => (
  <div className="absolute inset-0 z-0">
    {images.map((img, index) => (
      <div
        key={img}
        className="absolute inset-0 transition-opacity duration-1000"
        style={{
          opacity: currentIndex === index ? 1 : 0,
          backgroundImage: `url(${img})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/50" />
      </div>
    ))}
  </div>
));
HeroSlider.displayName = 'HeroSlider';

// Memoized Service Card
const ServiceCard = memo(({ service, getLocalizedText, t, index }) => (
  <Card className="hover:shadow-xl transition-shadow duration-300 border-2 border-[#F8E6E9] overflow-hidden" data-testid={`service-card-${index}`}>
    <CardContent className="p-6">
      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#F4C2C2] to-[#D4AF76] flex items-center justify-center mb-4">
        <Sparkles className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-bold mb-2 text-[#3E3E3E]">{getLocalizedText(service, 'name')}</h3>
      <p className="text-sm text-[#3E3E3E]/70 mb-4 line-clamp-2">{getLocalizedText(service, 'description')}</p>
      <div className="flex justify-between items-center mb-4">
        <span className="text-2xl font-bold text-[#D4AF76]">{service.price}</span>
        <span className="text-sm text-[#3E3E3E]/70 flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {service.duration}
        </span>
      </div>
      <Link to="/booking">
        <Button className="w-full bg-gradient-to-r from-[#F4C2C2] to-[#D4AF76] hover:opacity-90 text-white rounded-full" data-testid={`book-service-${index}`}>
          {t('services.bookService')}
        </Button>
      </Link>
    </CardContent>
  </Card>
));
ServiceCard.displayName = 'ServiceCard';

// Feature Card Component
const FeatureCard = memo(({ icon: Icon, title, desc, index }) => (
  <div 
    className="group relative bg-white rounded-2xl p-8 text-center border-2 border-[#F8E6E9] hover:border-[#F4C2C2] transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 cursor-pointer overflow-hidden" 
    data-testid={`feature-card-${index}`}
  >
    <div className="absolute inset-0 bg-gradient-to-br from-[#F4C2C2]/0 to-[#D4AF76]/0 group-hover:from-[#F4C2C2]/5 group-hover:to-[#D4AF76]/5 transition-all duration-500" />
    <div className="relative z-10">
      <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#F4C2C2] to-[#D4AF76] flex items-center justify-center mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg group-hover:shadow-2xl">
        <Icon className="w-10 h-10 text-white" />
      </div>
      <h3 className="text-xl font-bold mb-3 text-[#3E3E3E] group-hover:text-[#8B6F8E] transition-colors duration-300">{title}</h3>
      <p className="text-sm text-[#3E3E3E]/70 group-hover:text-[#3E3E3E] transition-colors duration-300">{desc}</p>
    </div>
    <div className="absolute -bottom-2 -right-2 w-20 h-20 bg-gradient-to-br from-[#F4C2C2]/20 to-[#D4AF76]/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
  </div>
));
FeatureCard.displayName = 'FeatureCard';

const HomePage = () => {
  const { t, i18n } = useTranslation();

  // Use cached API calls for better performance
  const { data: services, loading: servicesLoading } = useCachedApi('services', api.getServices);
  const { data: artists, loading: artistsLoading } = useCachedApi('artists', api.getArtists);

  const heroImages = useMemo(() => [
    'https://images.unsplash.com/photo-1595944024804-733665a112db',
    'https://images.unsplash.com/photo-1611821828952-3453ba0f9408',
    'https://images.unsplash.com/photo-1648844421638-0655d00dd5ba',
  ], []);

  const [currentHeroImage, setCurrentHeroImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroImage((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  const getLocalizedText = useMemo(() => (item, field) => {
    const lang = i18n.language;
    return item[`${field}_${lang}`] || item[`${field}_en`];
  }, [i18n.language]);

  // Memoize sliced data
  const displayServices = useMemo(() => services?.slice(0, 6) || [], [services]);
  const displayArtists = useMemo(() => artists?.slice(0, 3) || [], [artists]);

  const galleryImages = useMemo(() => [
    'https://images.unsplash.com/photo-1611821828952-3453ba0f9408',
    'https://images.unsplash.com/photo-1698308233758-d55c98fd7444',
    'https://images.unsplash.com/photo-1617472556169-c5547fde3282',
    'https://images.unsplash.com/photo-1571290274554-6a2eaa771e5f',
    'https://images.pexels.com/photos/6429663/pexels-photo-6429663.jpeg',
    'https://images.unsplash.com/photo-1648844421638-0655d00dd5ba',
    'https://images.unsplash.com/photo-1648844421727-cde6c4246b13',
    'https://images.unsplash.com/photo-1648844421753-351afd50486a',
  ], []);

  const features = useMemo(() => [
    { 
      icon: Award, 
      title: t('whyChooseUs.feature1.title'), 
      desc: t('whyChooseUs.feature1.desc')
    },
    
    { 
      icon: Heart, 
      title: t('whyChooseUs.feature2.title'), 
      desc: t('whyChooseUs.feature2.desc')
    },
    { 
      icon: Sparkles, 
      title: t('whyChooseUs.feature3.title'), 
      desc: t('whyChooseUs.feature3.desc')
    },
    { 
      icon: Users, 
      title: t('whyChooseUs.feature4.title'), 
      desc: t('whyChooseUs.feature4.desc')
    },
    { 
      icon: Clock, 
      title: t('whyChooseUs.feature5.title'), 
      desc: t('whyChooseUs.feature5.desc')
    },
    { 
      icon: Trophy, 
      title: t('whyChooseUs.feature6.title'), 
      desc: t('whyChooseUs.feature6.desc')
    },
  ], [t]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden" data-testid="hero-section">
        <HeroSlider images={heroImages} currentIndex={currentHeroImage} />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 drop-shadow-2xl"
            style={{ fontFamily: 'Playfair Display, serif' }}
            data-testid="hero-title"
          >
            {t('hero.title')}
          </h1>
          <p className="text-xl sm:text-2xl text-white/95 mb-8 drop-shadow-lg" data-testid="hero-subtitle">
            {t('hero.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/booking" data-testid="hero-book-button">
              <Button className="bg-gradient-to-r from-[#F4C2C2] to-[#D4AF76] hover:opacity-90 text-white rounded-full px-8 py-6 text-lg shadow-xl">
                {t('hero.bookButton')}
              </Button>
            </Link>
            <Link to="/gallery" data-testid="hero-view-work-button">
              <Button variant="outline" className="bg-white/90 hover:bg-white text-[#8B6F8E] rounded-full px-8 py-6 text-lg shadow-xl border-2 border-white">
                {t('hero.viewWork')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Booking Widget */}
      <section className="py-16 bg-white" data-testid="quick-booking-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="shadow-2xl border-2 border-[#F8E6E9] overflow-hidden">
            <CardContent className="p-8">
              <h2 className="text-3xl font-bold text-center mb-8 text-[#8B6F8E]" style={{ fontFamily: 'Playfair Display, serif' }}>
                {t('quickBooking.title')}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="text-center p-6 bg-[#FAF9F6] rounded-lg" data-testid={`quick-booking-step-${step}`}>
                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#F4C2C2] to-[#D4AF76] flex items-center justify-center mx-auto mb-4 text-white text-2xl font-bold">
                      {step}
                    </div>
                    <h3 className="font-semibold text-lg mb-2">
                      {step === 1 && t('quickBooking.selectService')}
                      {step === 2 && t('quickBooking.chooseDate')}
                      {step === 3 && t('quickBooking.bookNow')}
                    </h3>
                  </div>
                ))}
              </div>
              <div className="text-center mt-8">
                <Link to="/booking">
                  <Button className="bg-gradient-to-r from-[#F4C2C2] to-[#D4AF76] hover:opacity-90 text-white rounded-full px-8 py-4 text-lg" data-testid="quick-booking-cta">
                    {t('quickBooking.bookNow')}
                  </Button>
                </Link>
                <p className="mt-4 text-sm text-[#3E3E3E]">
                  {t('quickBooking.callUs')}: <span className="font-semibold">+41 44 123 45 67</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-20 bg-gradient-to-b from-[#FAF9F6] to-white" data-testid="services-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-12 text-[#8B6F8E]" style={{ fontFamily: 'Playfair Display, serif' }}>
            {t('services.title')}
          </h2>
          {servicesLoading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-400 mx-auto"></div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {displayServices.map((service, index) => (
                  <ServiceCard 
                    key={service.id} 
                    service={service} 
                    getLocalizedText={getLocalizedText} 
                    t={t} 
                    index={index} 
                  />
                ))}
              </div>
              <div className="text-center mt-12">
                <Link to="/services">
                  <Button variant="outline" className="border-2 border-[#8B6F8E] text-[#8B6F8E] hover:bg-[#8B6F8E] hover:text-white rounded-full px-8 py-4" data-testid="view-all-services">
                    {t('services.viewAll')}
                  </Button>
                </Link>
              </div>
            </>
          )}
        </div>
      </section>

      {/* Gallery Preview */}
      <section className="py-20 bg-white" data-testid="gallery-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-12 text-[#8B6F8E]" style={{ fontFamily: 'Playfair Display, serif' }}>
            {t('gallery.title')}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((img, index) => (
              <div key={index} className="aspect-square overflow-hidden rounded-lg shadow-lg group cursor-pointer" data-testid={`gallery-item-${index}`}>
                <img
                  src={img}
                  alt={`Nail art ${index + 1}`}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/gallery">
              <Button className="bg-gradient-to-r from-[#F4C2C2] to-[#D4AF76] hover:opacity-90 text-white rounded-full px-8 py-4" data-testid="view-more-gallery">
                {t('gallery.viewMore')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-gradient-to-b from-[#FAF9F6] to-[#F8E6E9]" data-testid="why-choose-us-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl sm:text-5xl font-bold text-center mb-12 text-[#8B6F8E]" style={{ fontFamily: 'Playfair Display, serif' }}>
            {t('whyChooseUs.title')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((item, index) => (
              <FeatureCard key={index} {...item} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Artists Preview */}
      {!artistsLoading && displayArtists.length > 0 && (
        <section className="py-20 bg-white" data-testid="artists-section">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl sm:text-5xl font-bold text-center mb-12 text-[#8B6F8E]" style={{ fontFamily: 'Playfair Display, serif' }}>
              {t('artists.title')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {displayArtists.map((artist, index) => (
                <Card key={artist.id} className="overflow-hidden hover:shadow-xl transition-shadow border-2 border-[#F8E6E9]" data-testid={`artist-card-${index}`}>
                  <img src={artist.image_url} alt={artist.name} className="w-full h-64 object-cover" loading="lazy" />
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2 text-[#3E3E3E]">{artist.name}</h3>
                    <p className="text-sm text-[#3E3E3E]/70 mb-2">
                      {artist.years_experience} {t('artists.yearsExp')}
                    </p>
                    <p className="text-sm text-[#3E3E3E] mb-4 line-clamp-2">{getLocalizedText(artist, 'specialties')}</p>
                    <Link to="/booking">
                      <Button className="w-full bg-gradient-to-r from-[#F4C2C2] to-[#D4AF76] hover:opacity-90 text-white rounded-full" data-testid={`book-artist-${index}`}>
                        {t('artists.bookWith')} {artist.name}
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
