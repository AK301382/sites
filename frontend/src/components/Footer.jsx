import React, { useState, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { MapPin, Phone, Mail, Clock, Instagram, Facebook } from 'lucide-react';

const Footer = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/settings`);
        if (response.ok) {
          const data = await response.json();
          setSettings(data);
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };
    fetchSettings();
  }, []);

  // Memoize computed footer data to prevent unnecessary recalculations
  const { phone, email, addressLine1, addressLine2, city, postalCode, country, 
          hoursWeekday, hoursSaturday, hoursSunday, instagramUrl, facebookUrl } = useMemo(() => ({
    phone: settings?.phone || '+41 44 123 45 67',
    email: settings?.email || 'info@fabulousnails.ch',
    addressLine1: settings?.address_line1 || 'Bahnhofstrasse 123',
    addressLine2: settings?.address_line2 || '',
    city: settings?.city || 'Zürich',
    postalCode: settings?.postal_code || '8001',
    country: settings?.country || 'Switzerland',
    hoursWeekday: settings?.hours_weekday || 'Mon-Fri: 09:00 - 19:00',
    hoursSaturday: settings?.hours_saturday || 'Sat: 09:00 - 17:00',
    hoursSunday: settings?.hours_sunday || 'Sun: 10:00 - 16:00',
    instagramUrl: settings?.instagram_url || 'https://instagram.com',
    facebookUrl: settings?.facebook_url || 'https://facebook.com',
  }), [settings]);

  return (
    <footer className="bg-gradient-to-b from-[#FAF9F6] to-[#F8E6E9] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Contact Info */}
          <div data-testid="footer-contact">
            <h3 className="text-xl font-bold mb-4 text-[#8B6F8E]" style={{ fontFamily: 'Playfair Display, serif' }}>
              {t('footer.contact')}
            </h3>
            <div className="space-y-3 text-[#3E3E3E]">
              <div className="flex items-start gap-2">
                <MapPin className="w-5 h-5 mt-0.5 text-[#D4AF76]" />
                <span className="text-sm">
                  {addressLine1}
                  {addressLine2 && <><br />{addressLine2}</>}
                  <br />{postalCode} {city}, {country}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-5 h-5 text-[#D4AF76]" />
                <span className="text-sm">{phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-[#D4AF76]" />
                <span className="text-sm">{email}</span>
              </div>
            </div>
          </div>

          {/* Hours */}
          <div data-testid="footer-hours">
            <h3 className="text-xl font-bold mb-4 text-[#8B6F8E]" style={{ fontFamily: 'Playfair Display, serif' }}>
              {t('footer.hours')}
            </h3>
            <div className="space-y-2 text-[#3E3E3E] text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-[#D4AF76]" />
                <span>{hoursWeekday}</span>
              </div>
              <div className="pl-7">{hoursSaturday}</div>
              <div className="pl-7">{hoursSunday}</div>
            </div>
          </div>

          {/* Social */}
          <div data-testid="footer-social">
            <h3 className="text-xl font-bold mb-4 text-[#8B6F8E]" style={{ fontFamily: 'Playfair Display, serif' }}>
              {t('footer.follow')}
            </h3>
            <div className="flex gap-4">
              <a
                href={instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gradient-to-r from-[#F4C2C2] to-[#D4AF76] flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                data-testid="instagram-link"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href={facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-gradient-to-r from-[#F4C2C2] to-[#D4AF76] flex items-center justify-center text-white hover:opacity-80 transition-opacity"
                data-testid="facebook-link"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-[#D4AF76]/30 pt-8 text-center text-sm text-[#3E3E3E]">
          <p>© {new Date().getFullYear()} Fabulous Nails & Spa. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
