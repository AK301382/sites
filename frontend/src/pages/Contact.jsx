import React from 'react';
import { Phone, Mail, MapPin, Clock, Instagram, Facebook } from 'lucide-react';
import { businessInfo } from '../mock';
import { Card, CardContent } from '../components/ui/card';
import { useLanguage } from '../context/LanguageContext';

const Contact = () => {
  const { t } = useLanguage();

  const hours = [
    { day: t('contact.days.sunday'), hours: t('contact.closed') },
    { day: t('contact.days.monday'), hours: '9:00 - 18:30' },
    { day: t('contact.days.tuesday'), hours: '9:00 - 18:30' },
    { day: t('contact.days.wednesday'), hours: '9:00 - 18:30' },
    { day: t('contact.days.thursday'), hours: '9:00 - 18:30' },
    { day: t('contact.days.friday'), hours: '9:00 - 18:30' },
    { day: t('contact.days.saturday'), hours: '9:00 - 17:00' }
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="py-20 px-4 bg-gradient-to-br from-rose-50 to-white">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-rose-600 to-rose-500 bg-clip-text text-transparent mb-6">
            {t('contact.title')}
          </h1>
          <p className="text-xl text-gray-600">
            {t('contact.subtitle')}
          </p>
        </div>
      </section>

      {/* Contact Info */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Left Column - Contact Cards */}
            <div className="space-y-6">
              {/* Phone */}
              <Card className="border-rose-100 hover:shadow-lg hover:border-rose-300 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-rose-50 rounded-lg">
                      <Phone className="w-6 h-6 text-rose-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {t('contact.phone')}
                      </h3>
                      <a
                        href={`tel:${businessInfo.phone}`}
                        className="text-lg text-gray-700 hover:text-rose-600 hover:underline"
                      >
                        {businessInfo.phone}
                      </a>
                      <p className="text-sm text-gray-600 mt-1">
                        {t('contact.phoneText')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Email */}
              <Card className="border-rose-100 hover:shadow-lg hover:border-rose-300 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-rose-50 rounded-lg">
                      <Mail className="w-6 h-6 text-rose-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {t('contact.email')}
                      </h3>
                      <a
                        href={`mailto:${businessInfo.email}`}
                        className="text-lg text-gray-700 hover:text-rose-600 hover:underline break-all"
                      >
                        {businessInfo.email}
                      </a>
                      <p className="text-sm text-gray-600 mt-1">
                        {t('contact.emailText')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Address */}
              <Card className="border-rose-100 hover:shadow-lg hover:border-rose-300 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-rose-50 rounded-lg">
                      <MapPin className="w-6 h-6 text-rose-600" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {t('contact.address')}
                      </h3>
                      <p className="text-lg text-gray-700 mb-2">
                        {businessInfo.address}
                      </p>
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(businessInfo.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-rose-600 font-medium hover:text-rose-700 hover:underline"
                      >
                        {t('contact.openMap')}
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Opening Hours */}
              <Card className="border-rose-100 hover:shadow-lg hover:border-rose-300 transition-all">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-rose-50 rounded-lg">
                      <Clock className="w-6 h-6 text-rose-600" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        {t('contact.hours')}
                      </h3>
                      <div className="space-y-2">
                        {hours.map((hour, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">{hour.day}</span>
                            <span className={`text-gray-600 ${
                              hour.hours === t('contact.closed') ? 'text-gray-400' : ''
                            }`}>
                              {hour.hours}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Social Media */}
              <Card className="border-rose-100 hover:shadow-lg hover:border-rose-300 transition-all">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    {t('contact.followUs')}
                  </h3>
                  <div className="flex space-x-4">
                    <a
                      href={businessInfo.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-4 py-2 bg-rose-50 hover:bg-gradient-to-r hover:from-rose-600 hover:to-rose-500 hover:text-white rounded-lg transition-all group"
                    >
                      <Instagram size={20} className="text-rose-600 group-hover:text-white" />
                      <span className="font-medium text-gray-700 group-hover:text-white">Instagram</span>
                    </a>
                    <a
                      href={businessInfo.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-4 py-2 bg-rose-50 hover:bg-gradient-to-r hover:from-rose-600 hover:to-rose-500 hover:text-white rounded-lg transition-all group"
                    >
                      <Facebook size={20} className="text-rose-600 group-hover:text-white" />
                      <span className="font-medium text-gray-700 group-hover:text-white">Facebook</span>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Map */}
            <div className="h-full min-h-[600px]">
              <div className="sticky top-24 h-full rounded-xl overflow-hidden shadow-lg border-2 border-rose-100">
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${encodeURIComponent(businessInfo.address)}`}
                  width="100%"
                  height="600"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Le Nails Location"
                ></iframe>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-rose-900 to-rose-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t('contact.ctaTitle')}
          </h2>
          <p className="text-xl text-rose-100 mb-8">
            {t('contact.ctaSubtitle')}
          </p>
          <a
            href={`tel:${businessInfo.phone}`}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-rose-600 rounded-full hover:bg-rose-50 transition-all transform hover:scale-105 shadow-lg text-lg font-medium"
          >
            <Phone size={20} />
            <span>{t('contact.callNow')}</span>
          </a>
        </div>
      </section>
    </div>
  );
};

export default Contact;
