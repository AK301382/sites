import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Instagram, Facebook } from 'lucide-react';
import { businessInfo } from '../mock';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { path: '/', label: 'Startseite' },
    { path: '/services', label: 'Dienstleistungen' },
    { path: '/gallery', label: 'Galerie' },
    { path: '/contact', label: 'Kontakt' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-gray-900">
              {businessInfo.name}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-gray-900 ${
                  isActive(link.path) ? 'text-gray-900' : 'text-gray-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Contact Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href={`tel:${businessInfo.phone}`}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-full hover:bg-gray-800 transition-colors"
            >
              <Phone size={16} />
              <span className="text-sm font-medium">Anrufen</span>
            </a>
            <a
              href={businessInfo.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Instagram size={20} />
            </a>
            <a
              href={businessInfo.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900 transition-colors"
            >
              <Facebook size={20} />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-200 bg-white">
          <nav className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 text-base font-medium ${
                  isActive(link.path) ? 'text-gray-900' : 'text-gray-600'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <a
              href={`tel:${businessInfo.phone}`}
              className="flex items-center space-x-2 py-2 text-base font-medium text-gray-900"
            >
              <Phone size={18} />
              <span>Anrufen</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;