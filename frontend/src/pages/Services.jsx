import React from 'react';
import { Phone, Clock, Sparkles, Star, Heart, Eye } from 'lucide-react';
import { services, businessInfo } from '../mock';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useLanguage } from '../context/LanguageContext';

const iconMap = {
  sparkles: Sparkles,
  star: Star,
  heart: Heart,
  gem: Sparkles,
  flower: Heart,
  eye: Eye,
  sparkle: Sparkles
};

const Services = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="py-20 px-4 bg-gradient-to-br from-rose-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-rose-600 to-rose-500 bg-clip-text text-transparent mb-6">
            {t('services.title')}
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            {t('services.subtitle')}
          </p>
          <a
            href={`tel:${businessInfo.phone}`}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gradient-to-r from-rose-600 to-rose-500 text-white rounded-full hover:from-rose-700 hover:to-rose-600 transition-all transform hover:scale-105 shadow-lg text-lg font-medium"
          >
            <Phone size={20} />
            <span>{t('home.bookAppointment')}</span>
          </a>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service) => {
              const IconComponent = iconMap[service.icon] || Sparkles;
              return (
                <Card key={service.id} className="group hover:shadow-2xl transition-all duration-300 border-rose-100 hover:border-rose-300">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-6">
                      <div className="flex-shrink-0">
                        <div className="p-4 bg-rose-50 rounded-xl group-hover:bg-gradient-to-r group-hover:from-rose-600 group-hover:to-rose-500 transition-all">
                          <IconComponent className="w-8 h-8 text-rose-600 group-hover:text-white transition-colors" />
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                          {service.name}
                        </h3>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                          {service.description}
                        </p>
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-rose-500 bg-clip-text text-transparent">
                              {service.price}
                            </span>
                          </div>
                          <Badge variant="secondary" className="flex items-center space-x-1 bg-rose-50 text-rose-700">
                            <Clock size={14} />
                            <span>{service.duration}</span>
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Additional Info */}
      <section className="py-20 px-4 bg-gradient-to-br from-rose-50 to-white">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 border border-rose-100">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-rose-600 to-rose-500 bg-clip-text text-transparent mb-6 text-center">
              {t('services.infoTitle')}
            </h2>
            <div className="space-y-4 text-gray-700">
              <p className="leading-relaxed">
                <strong className="text-gray-900">{t('services.bookingInfo')}</strong> {t('services.bookingText').replace('{phone}', businessInfo.phone)}
              </p>
              <p className="leading-relaxed">
                <strong className="text-gray-900">{t('services.hygieneInfo')}</strong> {t('services.hygieneText')}
              </p>
              <p className="leading-relaxed">
                <strong className="text-gray-900">{t('services.productsInfo')}</strong> {t('services.productsText')}
              </p>
              <p className="leading-relaxed">
                <strong className="text-gray-900">{t('services.consultationInfo')}</strong> {t('services.consultationText')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-rose-900 to-rose-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t('services.ctaTitle')}
          </h2>
          <p className="text-xl text-rose-100 mb-8">
            {t('services.ctaSubtitle')}
          </p>
          <a
            href={`tel:${businessInfo.phone}`}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-rose-600 rounded-full hover:bg-rose-50 transition-all transform hover:scale-105 shadow-lg text-lg font-medium"
          >
            <Phone size={20} />
            <span>{businessInfo.phone}</span>
          </a>
        </div>
      </section>
    </div>
  );
};

export default Services;
