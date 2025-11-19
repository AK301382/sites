import React from 'react';
import { Phone } from 'lucide-react';
import { businessInfo } from '../data/businessData';
import { useLanguage } from '../context/LanguageContext';

const FloatingCallButton = () => {
  const { t } = useLanguage();

  return (
    <a
      href={`tel:${businessInfo.phone}`}
      className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 px-6 py-4 bg-gradient-to-r from-rose-600 to-rose-500 text-white rounded-full shadow-2xl hover:shadow-rose-300 hover:scale-105 transition-all duration-300 group"
      data-testid="floating-call-button"
      aria-label={t('floatingButton')}
    >
      <Phone className="w-5 h-5 group-hover:animate-pulse" />
      <span className="font-medium hidden sm:inline">{t('floatingButton')}</span>
    </a>
  );
};

export default FloatingCallButton;
