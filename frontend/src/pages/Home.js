import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Star, Heart, Award, ShieldCheck, Leaf, Crown, Smile, Clock, Menu, Globe, Phone as PhoneIcon } from 'lucide-react';
import { services, galleryImages, testimonials, whyChooseUs, businessInfo } from '../data/businessData';
import { Card, CardContent } from '../components/Card';
import Badge from '../components/Badge';
import LazyImage from '../components/LazyImage';
import LoadingSpinner from '../components/LoadingSpinner';
import { useLanguage } from '../context/LanguageContext';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

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

const Home = () => {
  const { t, language, changeLanguage } = useLanguage();
  const [isNavVisible, setIsNavVisible] = React.useState(true);
  const [lastScrollY, setLastScrollY] = React.useState(0);

  // Hide/show navigation on scroll
  React.useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past 100px
        setIsNavVisible(false);
      } else {
        // Scrolling up
        setIsNavVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const navLinks = [
    { to: '/services', label: t('nav.services') },
    { to: '/gallery', label: t('nav.gallery') },
    { to: '/contact', label: t('nav.contact') }
  ];

  return (
    <div className="min-h-screen">
      {/* Floating Navigation Bar for Home Page */}
      <nav className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-white/95 backdrop-blur-md shadow-xl rounded-full px-4 md:px-6 py-3 flex items-center space-x-3 md:space-x-6 transition-all duration-300 ${
        isNavVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'
      }`}>
        {/* Mobile Menu Button - FIRST on mobile */}
        <Link
          to="/services"
          className="md:hidden p-2 text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
          aria-label="Menu"
        >
          <Menu className="w-5 h-5" />
        </Link>

        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src="/logo.png" alt="Le Nails" className="h-8 w-8 object-contain" />
          <span className="hidden sm:inline text-sm font-bold bg-gradient-to-r from-rose-600 to-rose-500 bg-clip-text text-transparent">
            {businessInfo.name}
          </span>
        </Link>
        
        {/* Nav Links - Hidden on small mobile */}
        <div className="hidden md:flex items-center space-x-4">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="text-sm font-medium text-gray-700 hover:text-rose-600 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Language Switcher */}
        <div className="flex items-center space-x-2 border-l border-gray-200 pl-3 md:pl-4">
          <button
            onClick={() => changeLanguage(language === 'de' ? 'fr' : language === 'fr' ? 'en' : 'de')}
            className="text-xs font-medium text-gray-700 hover:text-rose-600 transition-colors uppercase flex items-center space-x-1"
            aria-label="Change language"
          >
            <Globe className="w-3 h-3" />
            <span>{language}</span>
          </button>
        </div>

        {/* Call Button */}
        <a
          href={`tel:${businessInfo.phone}`}
          className="hidden sm:flex items-center space-x-1 px-4 py-2 bg-gradient-to-r from-rose-600 to-rose-500 text-white rounded-full hover:shadow-lg transition-all text-xs font-medium"
        >
          <PhoneIcon className="w-3 h-3" />
          <span className="hidden lg:inline">{t('nav.call')}</span>
        </a>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-gradient-to-br from-red-50/30 to-white/50 overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1604654894610-df63bc536371?w=1920&q=80')] bg-cover bg-center opacity-30"></div>
        
        {/* Decorative Elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-rose-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-red-200 rounded-full blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '1s' }}></div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          {/* Logo */}
          <div className="flex justify-center mb-8 animate-fade-in">
            <img 
              src="/logo.png" 
              alt="Le Nails Logo" 
              className="w-32 h-32 md:w-40 md:h-40 object-contain drop-shadow-2xl hover:scale-110 transition-transform duration-500"
            />
          </div>
          
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-rose-600 via-rose-500 to-red-600 bg-clip-text text-transparent mb-6 animate-fade-in-up">
            {businessInfo.name}
          </h1>
          
          <p className="text-2xl md:text-3xl text-gray-700 mb-8 font-light animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            {t('home.tagline')}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <a
              href={`tel:${businessInfo.phone}`}
              className="px-8 py-4 bg-gradient-to-r from-rose-600 to-rose-500 text-white rounded-full hover:shadow-2xl hover:shadow-rose-300 transition-all transform hover:scale-105 shadow-lg text-lg font-medium inline-flex items-center justify-center space-x-2"
              data-testid="hero-book-button"
            >
              <span>{t('home.bookAppointment')}</span>
              <ArrowRight size={20} />
            </a>
            <Link
              to="/gallery"
              className="px-8 py-4 bg-white text-rose-600 rounded-full hover:bg-red-50 transition-all transform hover:scale-105 shadow-lg text-lg font-medium inline-flex items-center justify-center space-x-2 border-2 border-rose-200"
              data-testid="hero-gallery-button"
            >
              <span>{t('home.viewWork')}</span>
              <ArrowRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Services */}
      <AnimatedSection>
        <section className="py-20 px-4 bg-white" data-testid="services-section">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-600 to-rose-500 bg-clip-text text-transparent mb-4">
                {t('home.servicesTitle')}
              </h2>
              <p className="text-xl text-gray-600">
                {t('home.servicesSubtitle')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.slice(0, 6).map((service, index) => {
                const IconComponent = iconMap[service.icon] || Sparkles;
                return (
                  <Card 
                    key={service.id} 
                    hover 
                    className="border-red-100 hover:border-rose-300"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-4">
                        <div className="p-3 bg-red-50 rounded-lg group-hover:bg-gradient-to-r group-hover:from-rose-600 group-hover:to-rose-500 transition-all">
                          <IconComponent className="w-6 h-6 text-rose-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {t(`serviceNames.${service.nameKey}`) || service.name}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3">
                            {t(`serviceNames.${service.nameKey}Desc`) || service.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold bg-gradient-to-r from-rose-600 to-rose-500 bg-clip-text text-transparent">
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
                className="inline-flex items-center space-x-2 text-rose-600 font-semibold hover:text-rose-700 hover:underline transition-colors"
                data-testid="view-all-services-link"
              >
                <span>{t('home.viewAllServices')}</span>
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Featured Gallery */}
      <AnimatedSection>
        <section className="py-20 px-4 bg-gradient-to-br from-red-50 via-rose-50 to-white" data-testid="gallery-section">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-600 to-rose-500 bg-clip-text text-transparent mb-4">
                {t('home.galleryTitle')}
              </h2>
              <p className="text-xl text-gray-600">
                {t('home.gallerySubtitle')}
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {galleryImages.slice(0, 8).map((image) => (
                <div
                  key={image.id}
                  className="relative aspect-square overflow-hidden rounded-xl group cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300"
                >
                  <Suspense fallback={<LoadingSpinner />}>
                    <LazyImage
                      src={image.url}
                      thumb={image.thumb}
                      alt={image.alt}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </Suspense>
                  <div className="absolute inset-0 bg-gradient-to-t from-rose-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-4">
                      <Badge className="bg-white text-rose-600 font-medium">
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
                className="inline-flex items-center space-x-2 text-rose-600 font-semibold hover:text-rose-700 hover:underline transition-colors"
                data-testid="view-gallery-link"
              >
                <span>{t('home.viewGallery')}</span>
                <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Why Choose Us */}
      <AnimatedSection>
        <section className="py-20 px-4 bg-white" data-testid="why-choose-us-section">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-600 to-rose-500 bg-clip-text text-transparent mb-4">
                {t('home.whyTitle')}
              </h2>
              <p className="text-xl text-gray-600">
                {t('home.whySubtitle')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {whyChooseUs.map((item, index) => {
                const IconComponent = iconMap[item.icon] || Award;
                return (
                  <div 
                    key={index} 
                    className="text-center group hover:transform hover:scale-105 transition-transform duration-300"
                  >
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-50 to-rose-100 rounded-full mb-4 group-hover:shadow-lg transition-shadow">
                      <IconComponent className="w-8 h-8 text-rose-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {t(`whyChooseUs.${item.titleKey}`) || item.title}
                    </h3>
                    <p className="text-gray-600">
                      {t(`whyChooseUs.${item.descKey}`) || item.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Testimonials */}
      <AnimatedSection>
        <section className="py-20 px-4 bg-gradient-to-br from-red-50 via-rose-50 to-white" data-testid="testimonials-section">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-rose-600 to-rose-500 bg-clip-text text-transparent mb-4">
                {t('home.testimonialsTitle')}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {testimonials.map((testimonial) => (
                <Card key={testimonial.id} className="border-red-100 hover:border-rose-300" hover>
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-rose-600 text-rose-600" />
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
      </AnimatedSection>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-rose-600 to-rose-500 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {t('home.ctaTitle')}
          </h2>
          <p className="text-xl text-rose-100 mb-8">
            {t('home.ctaSubtitle')}
          </p>
          <a
            href={`tel:${businessInfo.phone}`}
            className="inline-flex items-center space-x-2 px-8 py-4 bg-white text-rose-600 rounded-full hover:bg-red-50 hover:shadow-2xl transition-all transform hover:scale-105 shadow-lg text-lg font-medium"
            data-testid="cta-call-button"
          >
            <span>{t('home.callNow')}: {businessInfo.phone}</span>
          </a>
        </div>
      </section>
    </div>
  );
};

export default Home;
