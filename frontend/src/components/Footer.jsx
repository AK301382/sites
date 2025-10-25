import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react';
import { businessInfo } from '../mock';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-gradient-to-br from-rose-900 to-rose-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <img 
                src="/logo-original.jpg" 
                alt="Le Nails Logo" 
                className="w-10 h-10 object-contain filter brightness-0 invert"
              />
              <h3 className="text-2xl font-bold">{businessInfo.name}</h3>
            </div>
            <p className="text-rose-100 text-sm">
              {businessInfo.tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-rose-100 hover:text-white transition-colors text-sm">
                  {t('nav.home')}
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-rose-100 hover:text-white transition-colors text-sm">
                  {t('nav.services')}
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-rose-100 hover:text-white transition-colors text-sm">
                  {t('nav.gallery')}
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-rose-100 hover:text-white transition-colors text-sm">
                  {t('nav.contact')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.contact')}</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Phone size={16} className="mt-1 flex-shrink-0" />
                <a href={`tel:${businessInfo.phone}`} className="text-rose-100 hover:text-white transition-colors text-sm">
                  {businessInfo.phone}
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Mail size={16} className="mt-1 flex-shrink-0" />
                <a href={`mailto:${businessInfo.email}`} className="text-rose-100 hover:text-white transition-colors text-sm">
                  {businessInfo.email}
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span className="text-rose-100 text-sm">
                  {businessInfo.address}
                </span>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.hours')}</h4>
            <ul className="space-y-2">
              <li className="text-rose-100 text-sm">{t('contact.days.monday')} - {t('contact.days.friday')}: 9:00 - 18:30</li>
              <li className="text-rose-100 text-sm">{t('contact.days.saturday')}: 9:00 - 17:00</li>
              <li className="text-rose-100 text-sm">{t('contact.days.sunday')}: {t('contact.closed')}</li>
            </ul>
            <div className="flex space-x-4 mt-6">
              <a
                href={businessInfo.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-rose-100 hover:text-white transition-colors"
              >
                <Instagram size={24} />
              </a>
              <a
                href={businessInfo.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-rose-100 hover:text-white transition-colors"
              >
                <Facebook size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-rose-700 mt-8 pt-8 text-center">
          <p className="text-rose-100 text-sm">
            © {new Date().getFullYear()} {businessInfo.name}. {t('footer.rights')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;