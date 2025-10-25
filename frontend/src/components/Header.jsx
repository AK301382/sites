import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Instagram, Facebook, Globe } from 'lucide-react';
import { businessInfo } from '../mock';
import { useLanguage } from '../context/LanguageContext';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const location = useLocation();
  const { language, changeLanguage, t } = useLanguage();

  const navLinks = [
    { path: '/', label: t('nav.home') },
    { path: '/services', label: t('nav.services') },
    { path: '/gallery', label: t('nav.gallery') },
    { path: '/contact', label: t('nav.contact') }
  ];

  const languages = [
    { code: 'de', name: 'Deutsch' },
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'English' }
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-rose-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 flex items-center justify-center">
              <img 
                src="/logo-original.jpg" 
                alt="Le Nails Logo" 
                className="w-full h-full object-contain filter brightness-0 saturate-100"
                style={{ filter: 'brightness(0) saturate(100%) invert(46%) sepia(87%) saturate(2076%) hue-rotate(332deg) brightness(99%) contrast(91%)' }}
              />
            </div>
            <div className="text-2xl font-bold bg-gradient-to-r from-rose-600 to-rose-500 bg-clip-text text-transparent">
              {businessInfo.name}
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors hover:text-rose-600 ${
                  isActive(link.path) ? 'text-rose-600' : 'text-gray-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center space-x-2 px-3 py-2 text-gray-700 hover:text-rose-600 transition-colors rounded-lg hover:bg-rose-50"
              >
                <Globe size={18} />
                <span className="text-sm font-medium uppercase">{language}</span>
              </button>
              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-rose-100 py-2 z-50">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        changeLanguage(lang.code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-rose-50 transition-colors ${
                        language === lang.code ? 'text-rose-600 font-semibold' : 'text-gray-700'
                      }`}
                    >
                      {lang.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <a
              href={`tel:${businessInfo.phone}`}
              className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-rose-600 to-rose-500 text-white rounded-full hover:from-rose-700 hover:to-rose-600 transition-all transform hover:scale-105 shadow-md"
            >
              <Phone size={16} />
              <span className="text-sm font-medium">{t('nav.call')}</span>
            </a>
            <a
              href={businessInfo.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-rose-600 transition-colors"
            >
              <Instagram size={20} />
            </a>
            <a
              href={businessInfo.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-rose-600 transition-colors"
            >
              <Facebook size={20} />
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-gray-600 hover:text-rose-600"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-rose-100 bg-white">
          <nav className="px-4 py-4 space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 text-base font-medium ${
                  isActive(link.path) ? 'text-rose-600' : 'text-gray-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-rose-100">
              <p className="text-sm font-semibold text-gray-700 mb-2">Language / Langue / Sprache</p>
              <div className="flex flex-wrap gap-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      changeLanguage(lang.code);
                      setMobileMenuOpen(false);
                    }}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      language === lang.code
                        ? 'bg-rose-600 text-white'
                        : 'bg-rose-50 text-gray-700 hover:bg-rose-100'
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            </div>
            <a
              href={`tel:${businessInfo.phone}`}
              className="flex items-center space-x-2 py-2 text-base font-medium text-rose-600"
            >
              <Phone size={18} />
              <span>{t('nav.call')}</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;