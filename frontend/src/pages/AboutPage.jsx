import React, { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Card, CardContent } from '../components/ui/card';
import { Award, Heart, Sparkles, Shield, Star, Users, TrendingUp, Calendar } from 'lucide-react';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Memoized Value Card Component
const ValueCard = memo(({ icon: Icon, title, text, index }) => (
  <Card 
    className="text-center p-8 border-2 border-[#F8E6E9] hover:shadow-2xl hover:scale-105 transition-all duration-300"
    data-testid={`value-card-${index}`}
  >
    <div className="w-20 h-20 rounded-full bg-gradient-to-r from-[#F4C2C2] via-[#D4AF76] to-[#8B6F8E] flex items-center justify-center mx-auto mb-6 shadow-lg">
      <Icon className="w-10 h-10 text-white" />
    </div>
    <h3 className="text-2xl font-bold mb-4 text-[#8B6F8E]" style={{ fontFamily: 'Playfair Display, serif' }}>{title}</h3>
    <p className="text-base text-[#3E3E3E]/80 leading-relaxed">{text}</p>
  </Card>
));
ValueCard.displayName = 'ValueCard';

// Memoized Artist Card Component
const ArtistCard = memo(({ artist, getLocalizedText, t, index }) => (
  <Card 
    className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-2 border-[#F8E6E9] group hover:scale-105"
    data-testid={`team-artist-card-${index}`}
  >
    <div className="relative overflow-hidden">
      <img 
        src={artist.image_url} 
        alt={artist.name} 
        className="w-full h-96 object-cover group-hover:scale-110 transition-transform duration-500" 
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
    <CardContent className="p-8">
      <h3 className="text-2xl font-bold mb-3 text-[#8B6F8E]" style={{ fontFamily: 'Playfair Display, serif' }}>{artist.name}</h3>
      <div className="flex items-center gap-2 mb-4">
        <Star className="w-5 h-5 text-[#D4AF76]" />
        <p className="text-sm text-[#D4AF76] font-semibold">
          {artist.years_experience} {t('artists.yearsExp')}
        </p>
      </div>
      <p className="text-base text-[#3E3E3E]/80 mb-5 leading-relaxed">
        {getLocalizedText(artist, 'bio')}
      </p>
      <div className="bg-[#F8E6E9] rounded-lg p-4 mb-5">
        <p className="text-sm font-semibold text-[#8B6F8E] mb-2">{t('artists.title')}:</p>
        <p className="text-sm text-[#3E3E3E]">{getLocalizedText(artist, 'specialties')}</p>
      </div>
      {artist.instagram && (
        <p className="text-sm text-[#8B6F8E] flex items-center gap-2">
          <span className="text-lg">📸</span> {artist.instagram}
        </p>
      )}
    </CardContent>
  </Card>
));
ArtistCard.displayName = 'ArtistCard';

// Memoized Why Choose Us Item
const WhyChooseItem = memo(({ text, index }) => (
  <div 
    className="flex items-start gap-4 p-4 hover:bg-[#F8E6E9] rounded-lg transition-colors"
    data-testid={`why-choose-item-${index}`}
  >
    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-r from-[#F4C2C2] to-[#D4AF76] flex items-center justify-center">
      <span className="text-white font-bold text-sm">{index + 1}</span>
    </div>
    <p className="text-lg text-[#3E3E3E]">{text}</p>
  </div>
));
WhyChooseItem.displayName = 'WhyChooseItem';

const AboutPage = () => {
  const { t, i18n } = useTranslation();
  const [artists, setArtists] = useState([]);

  // Memoized data fetching
  const fetchArtists = useCallback(async () => {
    try {
      const response = await axios.get(`${API}/artists`);
      setArtists(response.data);
    } catch (error) {
      console.error('Error fetching artists:', error);
    }
  }, []);

  useEffect(() => {
    fetchArtists();
  }, [fetchArtists]);

  // Memoized localization function
  const getLocalizedText = useCallback((item, field) => {
    const lang = i18n.language;
    return item[`${field}_${lang}`] || item[`${field}_en`];
  }, [i18n.language]);

  // Memoized values array
  const values = useMemo(() => [
    {
      icon: Award,
      title: t('about.value1Title'),
      text: t('about.value1Text'),
    },
    {
      icon: Shield,
      title: t('about.value2Title'),
      text: t('about.value2Text'),
    },
    {
      icon: Sparkles,
      title: t('about.value3Title'),
      text: t('about.value3Text'),
    },
    {
      icon: Heart,
      title: t('about.value4Title'),
      text: t('about.value4Text'),
    },
  ], [t]);

  // Memoized why choose us reasons
  const whyReasons = useMemo(() => [
    t('about.whyReason1'),
    t('about.whyReason2'),
    t('about.whyReason3'),
    t('about.whyReason4'),
    t('about.whyReason5'),
    t('about.whyReason6'),
    t('about.whyReason7'),
    t('about.whyReason8'),
  ], [t]);

  // Memoized statistics
  const stats = useMemo(() => [
    { icon: TrendingUp, value: '15+', label: t('about.stat1') },
    { icon: Users, value: '10K+', label: t('about.stat2') },
    { icon: Star, value: '5.0', label: t('about.stat3') },
    { icon: Calendar, value: '50K+', label: t('about.stat4') },
  ], [t]);

  return (
    <div className="min-h-screen">
      {/* Hero Section - Enhanced */}
      <section className="relative pt-32 pb-24 bg-gradient-to-br from-[#F8E6E9] via-[#FAF9F6] to-white overflow-hidden" data-testid="about-hero-section">
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#F4C2C2]/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#D4AF76]/20 rounded-full blur-3xl"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <div className="inline-block mb-6">
            <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg">
              <Sparkles className="w-5 h-5 text-[#D4AF76]" />
              <span className="text-sm font-semibold text-[#8B6F8E]">{t('about.subtitle')}</span>
            </div>
          </div>
          <h1 
            className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#8B6F8E] mb-6 leading-tight" 
            style={{ fontFamily: 'Playfair Display, serif' }}
            data-testid="about-title"
          >
            {t('about.title')}
          </h1>
          <p className="text-xl sm:text-2xl text-[#3E3E3E]/70 max-w-3xl mx-auto leading-relaxed" data-testid="about-subtitle">
            {t('about.heroDescription')}
          </p>
        </div>
      </section>

      {/* Statistics Section - New */}
      <section className="py-16 bg-white border-y-2 border-[#F8E6E9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#F4C2C2] to-[#D4AF76] flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <stat.icon className="w-8 h-8 text-white" />
                </div>
                <div className="text-4xl font-bold text-[#8B6F8E] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                  {stat.value}
                </div>
                <div className="text-sm text-[#3E3E3E]/70 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story Section - Enhanced */}
      <section className="py-24 bg-gradient-to-b from-white to-[#FAF9F6]" data-testid="our-story-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div data-testid="story-content">
              <h2 
                className="text-5xl font-bold text-[#8B6F8E] mb-8 leading-tight" 
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {t('about.storyTitle')}
              </h2>
              <p className="text-lg text-[#3E3E3E]/80 mb-8 leading-relaxed">
                {t('about.storyText')}
              </p>
              <h3 
                className="text-4xl font-bold text-[#8B6F8E] mb-6 mt-12" 
                style={{ fontFamily: 'Playfair Display, serif' }}
              >
                {t('about.missionTitle')}
              </h3>
              <p className="text-lg text-[#3E3E3E]/80 leading-relaxed">
                {t('about.missionText')}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4" data-testid="story-images">
              <div className="space-y-4">
                <img
                  src="https://images.unsplash.com/photo-1595944024804-733665a112db"
                  alt="Salon interior"
                  className="rounded-2xl shadow-2xl w-full h-72 object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <img
                  src="https://images.pexels.com/photos/3997379/pexels-photo-3997379.jpeg"
                  alt="Manicure service"
                  className="rounded-2xl shadow-2xl w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
              <div className="space-y-4 mt-8">
                <img
                  src="https://images.unsplash.com/photo-1611821828952-3453ba0f9408"
                  alt="Nail art work"
                  className="rounded-2xl shadow-2xl w-full h-64 object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
                <img
                  src="https://images.unsplash.com/photo-1648844421638-0655d00dd5ba"
                  alt="Nail designs"
                  className="rounded-2xl shadow-2xl w-full h-72 object-cover hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values Section - Enhanced */}
      <section className="py-24 bg-white" data-testid="values-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-[#D4AF76] uppercase tracking-wider mb-4 block">{t('about.valuesSubheading')}</span>
            <h2 
              className="text-5xl font-bold text-[#8B6F8E] mb-6" 
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {t('about.valuesTitle')}
            </h2>
            <p className="text-lg text-[#3E3E3E]/70 max-w-2xl mx-auto">
              {t('about.valuesPrinciple')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <ValueCard key={index} icon={value.icon} title={value.title} text={value.text} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section - New */}
      <section className="py-24 bg-gradient-to-b from-[#FAF9F6] to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-[#D4AF76] uppercase tracking-wider mb-4 block">{t('about.whyChooseSubheading')}</span>
            <h2 
              className="text-5xl font-bold text-[#8B6F8E] mb-6" 
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {t('about.whyChooseTitle')}
            </h2>
          </div>
          <Card className="border-2 border-[#F8E6E9] shadow-2xl">
            <CardContent className="p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {whyReasons.map((reason, index) => (
                  <WhyChooseItem key={index} text={reason} index={index} />
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Our Team Section - Enhanced */}
      <section className="py-24 bg-white" data-testid="team-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 
              className="text-5xl font-bold text-[#8B6F8E] mb-6" 
              style={{ fontFamily: 'Playfair Display, serif' }}
            >
              {t('about.teamTitle')}
            </h2>
            <p className="text-lg text-[#3E3E3E]/70 max-w-3xl mx-auto">
              {t('about.teamText')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {artists.map((artist, index) => (
              <ArtistCard
                key={artist.id}
                artist={artist}
                getLocalizedText={getLocalizedText}
                t={t}
                index={index}
              />
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default memo(AboutPage);
