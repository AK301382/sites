import React from 'react';
import { Phone, Clock, Sparkles, Star, Heart, Eye } from 'lucide-react';
import { services, businessInfo } from '../mock';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

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
  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="py-20 px-4 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Unsere Dienstleistungen
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Professionelle Nagelpflege und Schönheitsbehandlungen
          </p>
          <a
            href={`tel:${businessInfo.phone}`}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all transform hover:scale-105 shadow-lg text-lg font-medium"
          >
            <Phone size={20} />
            <span>Termin vereinbaren</span>
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
                <Card key={service.id} className="group hover:shadow-2xl transition-all duration-300 border-gray-200">
                  <CardContent className="p-8">
                    <div className="flex items-start space-x-6">
                      <div className="flex-shrink-0">
                        <div className="p-4 bg-gray-100 rounded-xl group-hover:bg-gray-900 transition-colors">
                          <IconComponent className="w-8 h-8 text-gray-900 group-hover:text-white transition-colors" />
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
                            <span className="text-2xl font-bold text-gray-900">
                              {service.price}
                            </span>
                          </div>
                          <Badge variant="secondary" className="flex items-center space-x-1">
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
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
              Wichtige Informationen
            </h2>
            <div className="space-y-4 text-gray-700">
              <p className="leading-relaxed">
                <strong className="text-gray-900">Terminvereinbarung:</strong> Rufen Sie uns an unter {businessInfo.phone}, um Ihren Termin zu vereinbaren.
              </p>
              <p className="leading-relaxed">
                <strong className="text-gray-900">Hygiene:</strong> Wir verwenden medizinische Sterilisationsmethoden und Einwegwerkzeuge für Ihre Sicherheit.
              </p>
              <p className="leading-relaxed">
                <strong className="text-gray-900">Produkte:</strong> Wir arbeiten ausschließlich mit hochwertigen und veganen Produkten.
              </p>
              <p className="leading-relaxed">
                <strong className="text-gray-900">Beratung:</strong> Unsere erfahrenen Nageldesigner beraten Sie gerne zu allen Behandlungen.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Lassen Sie sich verwöhnen
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Vereinbaren Sie jetzt Ihren Termin
          </p>
          <a
            href={`tel:${businessInfo.phone}`}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-gray-900 rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg text-lg font-medium"
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