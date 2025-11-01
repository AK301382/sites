import React, { useState, useEffect, useMemo, useCallback, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { toast } from 'sonner';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Instagram, 
  Facebook, 
  Send,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8001';

// Memoized Success Component
const SuccessMessage = memo(({ t }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <CheckCircle2 className="w-20 h-20 text-green-500 mb-4 animate-bounce" />
    <h3 className="text-2xl font-bold text-gray-900 mb-2">
      {t('contact.successTitle')}
    </h3>
    <p className="text-gray-600">
      {t('contact.successMessage')}
    </p>
  </div>
));
SuccessMessage.displayName = 'SuccessMessage';

// Memoized Contact Info Card
const ContactInfoCard = memo(({ icon: Icon, title, content, href, isLink }) => (
  <div className="flex items-center gap-4">
    <div className="bg-gradient-to-br from-rose-100 to-pink-100 p-3 rounded-2xl">
      <Icon className="w-6 h-6 text-rose-600" />
    </div>
    <div>
      <p className="font-semibold text-gray-900">{title}</p>
      {isLink ? (
        <a 
          href={href}
          className="text-rose-600 hover:text-rose-700 transition-colors break-all"
        >
          {content}
        </a>
      ) : (
        <span className="text-gray-600">{content}</span>
      )}
    </div>
  </div>
));
ContactInfoCard.displayName = 'ContactInfoCard';

const ContactPage = () => {
  const { t, i18n } = useTranslation();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [settings, setSettings] = useState(null);

  // Memoized fetch settings
  const fetchSettings = useCallback(async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/settings`);
      setSettings(response.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  // Memoized form validation
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t('contact.required');
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t('contact.required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('contact.invalidEmail');
    }
    
    if (!formData.message.trim()) {
      newErrors.message = t('contact.required');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, t]);

  // Memoized form submit handler
  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      await axios.post(`${BACKEND_URL}/api/contact`, formData);
      
      setSubmitted(true);
      toast.success(t('contact.successTitle'), {
        description: t('contact.successMessage'),
      });
      
      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({ name: '', email: '', phone: '', message: '' });
        setSubmitted(false);
      }, 3000);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(t('contact.errorMessage'));
    } finally {
      setLoading(false);
    }
  }, [formData, validateForm, t]);

  // Memoized input change handler
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);

  // Memoized settings values
  const contactInfo = useMemo(() => ({
    address: settings ? [
      settings.address_line1,
      settings.address_line2,
      `${settings.postal_code} ${settings.city}`,
      settings.country
    ].filter(Boolean).join(', ') : '',
    phone: settings?.phone || '',
    email: settings?.email || '',
    hours: settings ? {
      weekday: settings.hours_weekday,
      saturday: settings.hours_saturday,
      sunday: settings.hours_sunday
    } : null,
    social: {
      instagram: settings?.instagram_url || '',
      facebook: settings?.facebook_url || ''
    }
  }), [settings]);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-[#F8E6E9] to-white" data-testid="contact-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-[#8B6F8E]" style={{ fontFamily: 'Playfair Display, serif' }}>
            {t('contact.title')}
          </h1>
          <p className="text-base sm:text-lg text-[#3E3E3E]/70 max-w-2xl mx-auto">
            {t('contact.subtitle')}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          
          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-xl p-6 sm:p-8 lg:p-10 border border-rose-100">
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Send className="w-7 h-7 text-rose-500" />
                {t('contact.formTitle')}
              </h2>
              
              {submitted ? (
                <SuccessMessage t={t} />
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('contact.name')} *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t('contact.namePlaceholder')}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all ${
                        errors.name ? 'border-red-500' : 'border-gray-200'
                      }`}
                      data-testid="contact-name-input"
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('contact.email')} *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t('contact.emailPlaceholder')}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all ${
                        errors.email ? 'border-red-500' : 'border-gray-200'
                      }`}
                      data-testid="contact-email-input"
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('contact.phone')}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder={t('contact.phonePlaceholder')}
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
                      data-testid="contact-phone-input"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                      {t('contact.message')} *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="6"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={t('contact.messagePlaceholder')}
                      className={`w-full px-4 py-3 border-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all resize-none ${
                        errors.message ? 'border-red-500' : 'border-gray-200'
                      }`}
                      data-testid="contact-message-input"
                    ></textarea>
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-500">{errors.message}</p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:from-rose-600 hover:to-pink-600 focus:outline-none focus:ring-4 focus:ring-rose-300 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    data-testid="contact-submit-button"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {t('contact.sending')}
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        {t('contact.sendButton')}
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-6">
            
            {/* Location */}
            {settings && (
              <div className="bg-white rounded-3xl shadow-xl p-6 border border-rose-100 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-rose-100 to-pink-100 p-3 rounded-2xl">
                    <MapPin className="w-6 h-6 text-rose-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">
                      {t('contact.locationTitle')}
                    </h3>
                    <div className="text-gray-600 space-y-1">
                      <p>{settings.address_line1}</p>
                      {settings.address_line2 && <p>{settings.address_line2}</p>}
                      <p>{settings.postal_code} {settings.city}</p>
                      <p>{settings.country}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Contact Details */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-rose-100 hover:shadow-2xl transition-shadow duration-300 space-y-4">
              {settings && (
                <>
                  <ContactInfoCard
                    icon={Phone}
                    title={t('contact.callUs')}
                    content={settings.phone}
                    href={`tel:${settings.phone}`}
                    isLink
                  />
                  <ContactInfoCard
                    icon={Mail}
                    title={t('contact.emailUs')}
                    content={settings.email}
                    href={`mailto:${settings.email}`}
                    isLink
                  />
                </>
              )}
            </div>

            {/* Opening Hours */}
            {contactInfo.hours && (
              <div className="bg-white rounded-3xl shadow-xl p-6 border border-rose-100 hover:shadow-2xl transition-shadow duration-300">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-rose-100 to-pink-100 p-3 rounded-2xl">
                    <Clock className="w-6 h-6 text-rose-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900 text-lg mb-3">
                      {t('contact.hoursTitle')}
                    </h3>
                    <div className="space-y-2 text-gray-600">
                      <div className="flex justify-between">
                        <span className="font-medium">Mon-Fri:</span>
                        <span>{contactInfo.hours.weekday}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Saturday:</span>
                        <span>{contactInfo.hours.saturday}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="font-medium">Sunday:</span>
                        <span>{contactInfo.hours.sunday}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Social Media */}
            <div className="bg-gradient-to-br from-rose-400 via-pink-400 to-purple-400 rounded-3xl shadow-xl p-6 text-white">
              <h3 className="font-bold text-lg mb-4">
                {t('contact.followTitle')}
              </h3>
              <div className="flex gap-4">
                {contactInfo.social.instagram && (
                  <a
                    href={contactInfo.social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-2xl transition-all duration-300 hover:scale-110"
                    aria-label="Instagram"
                  >
                    <Instagram className="w-6 h-6" />
                  </a>
                )}
                {contactInfo.social.facebook && (
                  <a
                    href={contactInfo.social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-2xl transition-all duration-300 hover:scale-110"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-6 h-6" />
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>
        </div>
      </section>
      {/* Google Maps Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-b from-white to-[#F8E6E9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#8B6F8E] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              {t('contact.locationTitle')}
            </h2>
            <p className="text-gray-600">
              {t('contact.subtitle')}
            </p>
          </div>
          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-rose-100">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2701.234567890123!2d8.5302055!3d47.3739153!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47900a0e0e0e0e0f%3A0x1234567890abcdef!2sWerdstrasse%2034%2C%208004%20Z%C3%BCrich%2C%20Switzerland!5e0!3m2!1sen!2s!4v1234567890123!5m2!1sen!2s"
              width="100%"
              height="450"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Fabulous Nails & Spa Location"
              className="w-full"
            ></iframe>
          </div>
        </div>
      </section>
    </div>
  );
};

export default memo(ContactPage);