import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Star, Heart, Award, ShieldCheck, Leaf, Crown, Smile, Clock } from 'lucide-react';
import { services, galleryImages, testimonials, whyChooseUs, businessInfo } from '../mock';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';

const iconMap = {
  sparkles: Sparkles,
  star: Star,
  heart: Heart,
  gem: Sparkles,
  flower: Heart,
  eye: Star,
  sparkle: Sparkles,
  award: Award,
  'shield-check': ShieldCheck,
  leaf: Leaf,
  crown: Crown,
  smile: Smile,
  clock: Clock
};

const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1920&q=80')] bg-cover bg-center opacity-20"></div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <h1 className="text-6xl md:text-8xl font-bold text-gray-900 mb-6">
            {businessInfo.name}
          </h1>
          <p className="text-2xl md:text-3xl text-gray-700 mb-8 font-light">
            {businessInfo.tagline}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={`tel:${businessInfo.phone}`}
              className="px-8 py-4 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-all transform hover:scale-105 shadow-lg text-lg font-medium inline-flex items-center justify-center space-x-2"
            >
              <span>Termin vereinbaren</span>
              <ArrowRight size={20} />
            </a>
            <Link
              to="/gallery"
              className="px-8 py-4 bg-white text-gray-900 rounded-full hover:bg-gray-50 transition-all transform hover:scale-105 shadow-lg text-lg font-medium inline-flex items-center justify-center space-x-2"
            >
              <span>Unsere Arbeiten</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Services */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Unsere Dienstleistungen
            </h2>
            <p className="text-xl text-gray-600">
              Verwöhnung für Ihre Nägel
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.slice(0, 6).map((service) => {
              const IconComponent = iconMap[service.icon] || Sparkles;
              return (
                <Card key={service.id} className="group hover:shadow-xl transition-all duration-300 border-gray-200">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="p-3 bg-gray-100 rounded-lg group-hover:bg-gray-900 transition-colors">
                        <IconComponent className="w-6 h-6 text-gray-900 group-hover:text-white transition-colors" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          {service.name}
                        </h3>
                        <p className="text-gray-600 text-sm mb-3">
                          {service.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-gray-900">
                            {service.price}
                          </span>
                          <Badge variant="secondary" className="text-xs">
                            {service.duration}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="text-center mt-12">
            <Link
              to="/services"
              className="inline-flex items-center space-x-2 text-gray-900 font-semibold hover:underline"
            >
              <span>Alle Dienstleistungen ansehen</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Gallery */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Unsere Arbeiten
            </h2>
            <p className="text-xl text-gray-600">
              Nagelkunst, die begeistert
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {galleryImages.slice(0, 8).map((image) => (
              <div
                key={image.id}
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
          <div className="text-center mt-12">
            <Link
              to="/gallery"
              className="inline-flex items-center space-x-2 text-gray-900 font-semibold hover:underline"
            >
              <span>Zur Galerie</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Warum Le Nails?
            </h2>
            <p className="text-xl text-gray-600">
              Qualität und Professionalität
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.map((item, index) => {
              const IconComponent = iconMap[item.icon] || Award;
              return (
                <div key={index} className="text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <IconComponent className="w-8 h-8 text-gray-900" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Was unsere Kunden sagen
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial) => (
              <Card key={testimonial.id} className="border-gray-200">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-gray-900 text-gray-900" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.date}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Bereit für perfekte Nägel?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Rufen Sie uns an und vereinbaren Sie Ihren Termin
          </p>
          <a
            href={`tel:${businessInfo.phone}`}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-gray-900 rounded-full hover:bg-gray-100 transition-all transform hover:scale-105 shadow-lg text-lg font-medium"
          >
            <span>Jetzt anrufen: {businessInfo.phone}</span>
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;