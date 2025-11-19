import React from 'react';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook, ExternalLink } from 'lucide-react';
import { businessInfo } from '../data/businessData';
import { Card, CardContent } from '../components/Card';
import { useLanguage } from '../context/LanguageContext';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

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

const Contact = () => {
  const { t } = useLanguage();

  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(businessInfo.address)}`;

  return (
    <div className="min-h-screen pt-16 md:pt-20">
      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-gradient-to-br from-red-50 via-rose-50 to-white overflow-hidden">
        <div className="absolute top-10 right-10 w-40 h-40 bg-rose-200 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-10 left-10 w-32 h-32 bg-red-200 rounded-full blur-3xl opacity-20"></div>
        
        <div className="relative max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-rose-600 to-rose-500 bg-clip-text text-transparent mb-6">
            {t('contact.title')}
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <AnimatedSection>
        <section className="py-16 px-4 bg-white">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Phone */}
              <Card hover className="border-red-100 hover:border-rose-300">
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-100 to-rose-200 rounded-full mb-4">
                    <Phone className="w-8 h-8 text-rose-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {t('contact.phone')}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {t('contact.phoneText')}
                  </p>
                  <a
                    href={`tel:${businessInfo.phone}`}
                    className="inline-block text-lg font-semibold text-rose-600 hover:text-rose-700 transition-colors"
                    data-testid="contact-phone-link"
                  >
                    {businessInfo.phone}
                  </a>
                </CardContent>
              </Card>

              {/* Email */}
              <Card hover className="border-red-100 hover:border-rose-300">
                <CardContent className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-100 to-rose-200 rounded-full mb-4">
                    <Mail className="w-8 h-8 text-rose-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">
                    {t('contact.email')}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {t('contact.emailText')}
                  </p>
                  <a
                    href={`mailto:${businessInfo.email}`}
                    className="inline-block text-lg font-semibold text-rose-600 hover:text-rose-700 transition-colors break-all"
                    data-testid="contact-email-link"
                  >
                    {businessInfo.email}
                  </a>
                </CardContent>
              </Card>
            </div>

            {/* Address & Map */}
            <Card className="border-red-100">
              <CardContent className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div>
                    <div className="flex items-start space-x-4 mb-6">
                      <div className="p-3 bg-gradient-to-br from-rose-100 to-rose-200 rounded-lg">
                        <MapPin className="w-6 h-6 text-rose-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {t('contact.address')}
                        </h3>
                        <p className="text-gray-700 mb-4">
                          {businessInfo.address}
                        </p>
                        <a
                          href={mapUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-2 text-rose-600 hover:text-rose-700 font-medium transition-colors"
                          data-testid="google-maps-link"
                        >
                          <span>{t('contact.openMap')}</span>
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="h-64 lg:h-auto bg-gray-100 rounded-lg overflow-hidden">
                    <iframe
                      src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(businessInfo.address)}`}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Le Nails Location"
                    ></iframe>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </AnimatedSection>

      {/* Opening Hours */}
      <AnimatedSection>
        <section className="py-16 px-4 bg-gradient-to-br from-red-50 via-rose-50 to-white">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-100 to-rose-200 rounded-full mb-4">
                <Clock className="w-8 h-8 text-rose-600" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {t('contact.hours')}
              </h2>
            </div>

            <Card className="border-red-100">
              <CardContent className="p-8">
                <div className="space-y-4">
                  {businessInfo.hours.map((schedule, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-red-50 transition-colors"
                    >
                      <span className="font-medium text-gray-900">
                        {t(`contact.days.${schedule.day}`)}
                      </span>
                      <span className={`font-semibold ${
                        schedule.hours === 'Geschlossen'
                          ? 'text-red-500'
                          : 'text-rose-600'
                      }`}>
                        {schedule.hours === 'Geschlossen' ? t('contact.closed') : schedule.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </AnimatedSection>

      {/* Social Media */}
      <AnimatedSection>
        <section className="py-16 px-4 bg-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              {t('contact.followUs')}
            </h2>
            <div className="flex justify-center space-x-6">
              <a
                href={businessInfo.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
                aria-label="Facebook"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full group-hover:shadow-2xl group-hover:scale-110 transition-all">
                  <Facebook className="w-8 h-8 text-white" />
                </div>
              </a>
              <a
                href={businessInfo.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="group"
                aria-label="Instagram"
              >
                <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-rose-500 to-pink-600 rounded-full group-hover:shadow-2xl group-hover:scale-110 transition-all">
                  <Instagram className="w-8 h-8 text-white" />
                </div>
              </a>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-rose-600 to-rose-500 text-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            {t('contact.ctaTitle')}
          </h2>
          <p className="text-xl text-rose-100 mb-8">
            {t('contact.ctaSubtitle')}
          </p>
          <a
            href={`tel:${businessInfo.phone}`}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-rose-600 rounded-full hover:bg-red-50 hover:shadow-2xl transition-all transform hover:scale-105 shadow-lg text-lg font-medium"
            data-testid="contact-cta-button"
          >
            <Phone className="w-5 h-5" />
            <span>{t('contact.callNow')}</span>
          </a>
        </div>
      </section>
    </div>
  );
};

export default Contact;
