import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Instagram, Facebook } from 'lucide-react';
import { businessInfo } from '../mock';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">{businessInfo.name}</h3>
            <p className="text-gray-400 text-sm">
              {businessInfo.tagline}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Schnelllinks</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Startseite
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Dienstleistungen
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Galerie
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Kontakt
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Kontakt</h4>
            <ul className="space-y-3">
              <li className="flex items-start space-x-3">
                <Phone size={16} className="mt-1 flex-shrink-0" />
                <a href={`tel:${businessInfo.phone}`} className="text-gray-400 hover:text-white transition-colors text-sm">
                  {businessInfo.phone}
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <Mail size={16} className="mt-1 flex-shrink-0" />
                <a href={`mailto:${businessInfo.email}`} className="text-gray-400 hover:text-white transition-colors text-sm">
                  {businessInfo.email}
                </a>
              </li>
              <li className="flex items-start space-x-3">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  {businessInfo.address}
                </span>
              </li>
            </ul>
          </div>

          {/* Opening Hours */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Öffnungszeiten</h4>
            <ul className="space-y-2">
              <li className="text-gray-400 text-sm">Mo - Fr: 9:00 - 18:30</li>
              <li className="text-gray-400 text-sm">Sa: 9:00 - 17:00</li>
              <li className="text-gray-400 text-sm">So: Geschlossen</li>
            </ul>
            <div className="flex space-x-4 mt-6">
              <a
                href={businessInfo.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Instagram size={24} />
              </a>
              <a
                href={businessInfo.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Facebook size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} {businessInfo.name}. Alle Rechte vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;