import React, { useState, useEffect } from 'react';
import { Phone } from 'lucide-react';
import { businessInfo } from '../mock';

const FloatingCallButton = () => {
  const [isPulsing, setIsPulsing] = useState(false);

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
      aria-label="Termin vereinbaren"
    >
      <div className="relative">
        {/* Outer glow ring */}
        <div className="absolute inset-0 bg-gray-900 rounded-full blur-lg opacity-30 group-hover:opacity-50 transition-opacity"></div>
        
        {/* Button */}
        <div className="relative bg-gray-900 text-white rounded-full p-4 shadow-2xl group-hover:bg-gray-800 transition-all transform group-hover:scale-105">
          <Phone size={24} className="animate-none" />
        </div>
        
        {/* Tooltip */}
        <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
          <div className="bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg text-sm font-medium">
            Termin vereinbaren
          </div>
        </div>
      </div>
    </a>
  );
};

export default FloatingCallButton;