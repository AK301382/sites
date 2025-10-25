import React from 'react';
import { Phone, Mail, MapPin, Clock, Instagram, Facebook } from 'lucide-react';
import { businessInfo } from '../mock';
import { Card, CardContent } from '../components/ui/card';

const Contact = () => {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Kontakt
          </h1>
          <p className="text-xl text-gray-600">
            Wir freuen uns auf Ihren Besuch
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
              <Card className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <Phone className="w-6 h-6 text-gray-900" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Telefon
                      </h3>
                      <a
                        href={`tel:${businessInfo.phone}`}
                        className="text-lg text-gray-700 hover:text-gray-900 hover:underline"
                      >
                        {businessInfo.phone}
                      </a>
                      <p className="text-sm text-gray-600 mt-1">
                        Rufen Sie uns für einen Termin an
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Email */}
              <Card className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <Mail className="w-6 h-6 text-gray-900" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        E-Mail
                      </h3>
                      <a
                        href={`mailto:${businessInfo.email}`}
                        className="text-lg text-gray-700 hover:text-gray-900 hover:underline break-all"
                      >
                        {businessInfo.email}
                      </a>
                      <p className="text-sm text-gray-600 mt-1">
                        Schreiben Sie uns eine Nachricht
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Address */}
              <Card className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <MapPin className="w-6 h-6 text-gray-900" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Adresse
                      </h3>
                      <p className="text-lg text-gray-700 mb-2">
                        {businessInfo.address}
                      </p>
                      <a
                        href={`https://maps.google.com/?q=${encodeURIComponent(businessInfo.address)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-gray-900 font-medium hover:underline"
                      >
                        In Google Maps öffnen →
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Opening Hours */}
              <Card className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      <Clock className="w-6 h-6 text-gray-900" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-4">
                        Öffnungszeiten
                      </h3>
                      <div className="space-y-2">
                        {businessInfo.hours.map((hour, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-gray-700 font-medium">{hour.day}</span>
                            <span className={`text-gray-600 ${
                              hour.hours === 'Geschlossen' ? 'text-gray-400' : ''
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
              <Card className="border-gray-200 hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Folgen Sie uns
                  </h3>
                  <div className="flex space-x-4">
                    <a
                      href={businessInfo.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-900 hover:text-white rounded-lg transition-colors"
                    >
                      <Instagram size={20} />
                      <span className="font-medium">Instagram</span>
                    </a>
                    <a
                      href={businessInfo.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-900 hover:text-white rounded-lg transition-colors"
                    >
                      <Facebook size={20} />
                      <span className="font-medium">Facebook</span>
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Map */}
            <div className="h-full min-h-[600px]">
              <div className="sticky top-24 h-full rounded-xl overflow-hidden shadow-lg">
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
      <section className="py-20 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Besuchen Sie uns
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Wir freuen uns darauf, Sie zu verwöhnen
          </p>
          <a
            href={`tel:${businessInfo.phone}`}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-gray-900 rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg text-lg font-medium"
          >
            <Phone size={20} />
            <span>Jetzt anrufen</span>
          </a>
        </div>
      </section>
    </div>
  );
};

export default Contact;