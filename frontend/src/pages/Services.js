import React, { useState, useMemo } from 'react';
import { Phone, Sparkles, Star, Heart, ShieldCheck, Leaf, Clock } from 'lucide-react';
import { services, businessInfo } from '../data/businessData';
import { Card, CardContent } from '../components/Card';
import Badge from '../components/Badge';
import { useLanguage } from '../context/LanguageContext';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const iconMap = {
  sparkles: Sparkles,
  star: Star,
  heart: Heart,
  gem: Sparkles,
  flower: Heart,
  eye: Star,
  sparkle: Sparkles
};

const AnimatedSection = ({ children, className = '' }) => {
  const { targetRef, hasIntersected } = useIntersectionObserver({ threshold: 0.1 });

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

const Services = () => {
  const { t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { value: 'all', label: t('services.categories.all') },
    { value: 'hands', label: t('services.categories.hands') },
    { value: 'feet', label: t('services.categories.feet') },
    { value: 'beauty', label: t('services.categories.beauty') }
  ];

  const filteredServices = useMemo(() => {
    if (selectedCategory === 'all') return services;
    return services.filter(s => s.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div className="min-h-screen pt-16 md:pt-20">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-red-50 via-rose-50 to-white overflow-hidden">
        <div className="absolute top-10 right-10 w-40 h-40 bg-rose-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-red-200 rounded-full blur-3xl opacity-20"></div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-rose-600 to-rose-500 bg-clip-text text-transparent mb-6">
            {t('services.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('services.subtitle')}
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <AnimatedSection>
        <section className="py-8 px-4 bg-white border-b border-gray-100 sticky top-16 md:top-20 z-40 backdrop-blur-sm bg-white/95">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-center space-x-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category.value}
                  onClick={() => setSelectedCategory(category.value)}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                    selectedCategory === category.value
                      ? 'bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  data-testid={`category-filter-${category.value}`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Services Grid with Prices */}
      <AnimatedSection>
        <section className="py-16 px-4 bg-white">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('services.priceListTitle')}
              </h2>
              <p className="text-lg text-gray-600">
                {t('services.priceListSubtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service, index) => {
                const IconComponent = iconMap[service.icon] || Sparkles;
                return (
                  <Card
                    key={service.id}
                    hover
                    className="border-2 border-red-100 hover:border-rose-300 hover:shadow-xl"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    data-testid={`service-card-${service.id}`}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4 mb-4">
                        <div className="p-3 bg-gradient-to-br from-red-50 to-rose-100 rounded-xl">
                          <IconComponent className="w-7 h-7 text-rose-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-1">
                            {t(`serviceNames.${service.nameKey}`) || service.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {t(`serviceNames.${service.nameKey}Desc`) || service.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div>
                          <div className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-rose-500 bg-clip-text text-transparent">
                            {service.price}
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            {service.duration}
                          </div>
                        </div>
                        <Badge variant="primary" className="text-sm px-4 py-2">
                          <Clock className="w-3 h-3 inline mr-1" />
                          {service.duration}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {filteredServices.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">Keine Dienstleistungen in dieser Kategorie gefunden.</p>
              </div>
            )}
          </div>
        </section>
      </AnimatedSection>

      {/* Important Information */}
      <AnimatedSection>
        <section className="py-16 px-4 bg-gradient-to-br from-red-50 via-rose-50 to-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
              {t('services.infoTitle')}
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Booking Info */}
              <Card className="border-red-100">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-rose-100 rounded-lg">
                      <Phone className="w-5 h-5 text-rose-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {t('services.bookingInfo')}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {t('services.bookingText').replace('{phone}', businessInfo.phone)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Hygiene Info */}
              <Card className="border-red-100">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-rose-100 rounded-lg">
                      <ShieldCheck className="w-5 h-5 text-rose-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {t('services.hygieneInfo')}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {t('services.hygieneText')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Products Info */}
              <Card className="border-red-100">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-rose-100 rounded-lg">
                      <Leaf className="w-5 h-5 text-rose-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {t('services.productsInfo')}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {t('services.productsText')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Consultation Info */}
              <Card className="border-red-100">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-rose-100 rounded-lg">
                      <Star className="w-5 h-5 text-rose-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">
                        {t('services.consultationInfo')}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {t('services.consultationText')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-rose-600 to-rose-500 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('services.ctaTitle')}
          </h2>
          <p className="text-xl text-rose-100 mb-8">
            {t('services.ctaSubtitle')}
          </p>
          <a
            href={`tel:${businessInfo.phone}`}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-rose-600 rounded-full hover:bg-red-50 hover:shadow-2xl transition-all transform hover:scale-105 shadow-lg text-lg font-medium"
            data-testid="services-cta-button"
          >
            <Phone className="w-5 h-5" />
            <span>{businessInfo.phone}</span>
          </a>
        </div>
      </section>
    </div>
  );
};

export default Services;
