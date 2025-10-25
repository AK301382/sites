import React, { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';
import { businessInfo } from '../mock';
import { useLanguage } from '../context/LanguageContext';

const FloatingCallButton = () => {
  const [isPulsing, setIsPulsing] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const interval = setInterval(() => {
      setIsPulsing(true);
      setTimeout(() => setIsPulsing(false), 2000);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <a
      href={`tel:${businessInfo.phone}`}
      className={`fixed bottom-8 right-8 z-50 group ${
        isPulsing ? 'animate-pulse' : ''
      }`}
      aria-label={t('floatingButton')}
    >
      <div className="relative">
        {/* Outer glow ring */}
        <div className="absolute inset-0 bg-gradient-to-r from-rose-600 to-rose-500 rounded-full blur-lg opacity-40 group-hover:opacity-60 transition-opacity"></div>
        
        {/* Button */}
        <div className="relative bg-gradient-to-r from-rose-600 to-rose-500 text-white rounded-full p-4 shadow-2xl group-hover:from-rose-700 group-hover:to-rose-600 transition-all transform group-hover:scale-105">
          <Phone size={24} className="animate-none" />
        </div>
        
        {/* Tooltip */}
        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          <div className="bg-gradient-to-r from-rose-600 to-rose-500 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium">
            {t('floatingButton')}
          </div>
        </div>
      </div>
    </a>
  );
};

export default FloatingCallButton;