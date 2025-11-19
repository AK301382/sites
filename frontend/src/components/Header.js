import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Globe } from 'lucide-react';
import { businessInfo } from '../data/businessData';
import { useLanguage } from '../context/LanguageContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const { t, language, changeLanguage } = useLanguage();
  const location = useLocation();

  const navItems = [
    { path: '/', label: t('nav.home') },
    { path: '/services', label: t('nav.services') },
    { path: '/gallery', label: t('nav.gallery') },
    { path: '/contact', label: t('nav.contact') }
  ];

  const languages = [
    { code: 'de', label: 'Deutsch' },
    { code: 'fr', label: 'Français' },
    { code: 'en', label: 'English' }
  ];

  const isActive = (path) => location.pathname === path;
  const isHomePage = location.pathname === '/';

  // Hide header on home page
  if (isHomePage) {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm rounded-b-3xl">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 md:space-x-3 group">
            <img
              src="/logo.png"
              alt="Le Nails Logo"
              className="h-10 w-10 md:h-12 md:w-12 object-contain transition-transform group-hover:scale-110"
            />
            <span className="text-xl md:text-2xl font-bold bg-gradient-to-r from-rose-600 to-rose-500 bg-clip-text text-transparent">
              {businessInfo.name}
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'text-rose-600'
                    : 'text-gray-700 hover:text-rose-600'
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setIsLangOpen(!isLangOpen)}
                className="flex items-center space-x-1 text-sm font-medium text-gray-700 hover:text-rose-600 transition-colors"
                aria-label="Change language"
              >
                <Globe className="w-4 h-4" />
                <span className="uppercase">{language}</span>
              </button>
              {isLangOpen && (
                <div className="absolute right-0 mt-2 py-2 w-32 bg-white rounded-lg shadow-xl border border-gray-100">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        changeLanguage(lang.code);
                        setIsLangOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm hover:bg-rose-50 transition-colors ${
                        language === lang.code ? 'text-rose-600 font-medium' : 'text-gray-700'
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Call Button */}
            <a
              href={`tel:${businessInfo.phone}`}
              className="inline-flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-rose-600 to-rose-500 text-white rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
              data-testid="header-call-button"
            >
              <Phone className="w-4 h-4" />
              <span className="text-sm font-medium">{t('nav.call')}</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-3">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-rose-50 text-rose-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </Link>
              ))}

              {/* Mobile Language Switcher */}
              <div className="px-4 py-2">
                <div className="text-xs font-medium text-gray-500 mb-2">Language</div>
                <div className="flex space-x-2">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => changeLanguage(lang.code)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        language === lang.code
                          ? 'bg-rose-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {lang.code.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Call Button */}
              <a
                href={`tel:${businessInfo.phone}`}
                className="mx-4 inline-flex items-center justify-center space-x-2 px-5 py-3 bg-gradient-to-r from-rose-600 to-rose-500 text-white rounded-full hover:shadow-lg transition-all"
                onClick={() => setIsMenuOpen(false)}
              >
                <Phone className="w-4 h-4" />
                <span className="text-sm font-medium">{t('nav.call')}</span>
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
