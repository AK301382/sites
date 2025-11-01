import React, { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Calendar } from '../components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../components/ui/popover';
import { toast } from 'sonner';
import { Calendar as CalendarIcon, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Memoized Success Message Component
const SuccessMessage = memo(({ t, onReset }) => (
  <div className="min-h-screen pt-20 flex items-center justify-center bg-gradient-to-b from-[#F8E6E9] to-white">
    <Card className="max-w-md w-full mx-4 border-2 border-[#F8E6E9] shadow-xl" data-testid="booking-success">
      <CardContent className="p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#F4C2C2] to-[#D4AF76] flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold mb-4 text-[#8B6F8E]" style={{ fontFamily: 'Playfair Display, serif' }}>
          {t('booking.bookingSuccess')}
        </h2>
        <p className="text-[#3E3E3E]/70 mb-6">{t('booking.bookingMessage')}</p>
        <Button 
          className="bg-gradient-to-r from-[#F4C2C2] to-[#D4AF76] hover:opacity-90 text-white rounded-full px-8" 
          onClick={onReset} 
          data-testid="book-another-button"
        >
          Book Another Appointment
        </Button>
      </CardContent>
    </Card>
  </div>
));
SuccessMessage.displayName = 'SuccessMessage';

// Memoized Loading Component
const LoadingSpinner = memo(() => (
  <div className="min-h-screen flex items-center justify-center pt-20">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-[#F4C2C2] border-t-[#D4AF76] rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-[#3E3E3E]">Loading...</p>
    </div>
  </div>
));
LoadingSpinner.displayName = 'LoadingSpinner';

const BookingPage = () => {
  const { t, i18n } = useTranslation();
  const [services, setServices] = useState([]);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    service_id: '',
    artist_id: '',
    appointment_date: null,
    appointment_time: '',
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    notes: '',
  });

  // Memoized callback for fetching data
  const fetchData = useCallback(async () => {
    try {
      const [servicesRes, artistsRes] = await Promise.all([
        axios.get(`${API}/services`), 
        axios.get(`${API}/artists`)
      ]);

      setServices(servicesRes.data);
      setArtists(artistsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Memoized localization function
  const getLocalizedText = useCallback((item, field) => {
    const lang = i18n.language;
    return item[`${field}_${lang}`] || item[`${field}_en`];
  }, [i18n.language]);

  // Memoized time slots
  const timeSlots = useMemo(() => [
    '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
    '12:00', '12:30', '13:00', '13:30', '14:00', '14:30',
    '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00',
  ], []);

  // Memoized form handlers
  const handleServiceChange = useCallback((value) => {
    setFormData(prev => ({ ...prev, service_id: value }));
  }, []);

  const handleArtistChange = useCallback((value) => {
    setFormData(prev => ({ ...prev, artist_id: value }));
  }, []);

  const handleDateChange = useCallback((date) => {
    setFormData(prev => ({ ...prev, appointment_date: date }));
  }, []);

  const handleTimeChange = useCallback((value) => {
    setFormData(prev => ({ ...prev, appointment_time: value }));
  }, []);

  const handleInputChange = useCallback((field) => (e) => {
    setFormData(prev => ({ ...prev, [field]: e.target.value }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();

    if (!formData.service_id || !formData.artist_id || !formData.appointment_date || 
        !formData.appointment_time || !formData.customer_name || !formData.customer_email || 
        !formData.customer_phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    setSubmitting(true);

    try {
      const appointmentData = {
        ...formData,
        appointment_date: format(formData.appointment_date, 'yyyy-MM-dd'),
      };

      await axios.post(`${API}/appointments`, appointmentData);

      setSuccess(true);
      toast.success(t('booking.bookingSuccess'));

      // Reset form
      setFormData({
        service_id: '',
        artist_id: '',
        appointment_date: null,
        appointment_time: '',
        customer_name: '',
        customer_email: '',
        customer_phone: '',
        notes: '',
      });
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error('Failed to book appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [formData, t]);

  const handleReset = useCallback(() => {
    setSuccess(false);
  }, []);

  // Memoized calendar date validator
  const isDateDisabled = useCallback((date) => date < new Date(), []);

  if (loading) return <LoadingSpinner />;
  if (success) return <SuccessMessage t={t} onReset={handleReset} />;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-[#F8E6E9] to-white" data-testid="booking-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-[#8B6F8E]" style={{ fontFamily: 'Playfair Display, serif' }}>
            {t('booking.title')}
          </h1>
          <p className="text-base sm:text-lg text-[#3E3E3E]/70 max-w-2xl mx-auto">Schedule your next nail appointment in just a few clicks</p>
        </div>
      </section>

      {/* Booking Form */}
      <section className="py-16 bg-white" data-testid="booking-form-section">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="border-2 border-[#F8E6E9] shadow-xl">
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Select Service */}
                <div data-testid="service-select-container">
                  <Label htmlFor="service" className="text-[#3E3E3E] font-semibold">
                    {t('booking.selectService')} *
                  </Label>
                  <Select value={formData.service_id} onValueChange={handleServiceChange}>
                    <SelectTrigger className="mt-2" id="service" data-testid="service-select">
                      <SelectValue placeholder={t('booking.selectService')} />
                    </SelectTrigger>
                    <SelectContent>
                      {services.map((service) => (
                        <SelectItem key={service.id} value={service.id} data-testid={`service-option-${service.id}`}>
                          {getLocalizedText(service, 'name')} - {service.price}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Select Artist */}
                <div data-testid="artist-select-container">
                  <Label htmlFor="artist" className="text-[#3E3E3E] font-semibold">
                    {t('booking.selectArtist')} *
                  </Label>
                  <Select value={formData.artist_id} onValueChange={handleArtistChange}>
                    <SelectTrigger className="mt-2" id="artist" data-testid="artist-select">
                      <SelectValue placeholder={t('booking.selectArtist')} />
                    </SelectTrigger>
                    <SelectContent>
                      {artists.map((artist) => (
                        <SelectItem key={artist.id} value={artist.id} data-testid={`artist-option-${artist.id}`}>
                          {artist.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Select Date */}
                <div data-testid="date-select-container">
                  <Label className="text-[#3E3E3E] font-semibold">{t('booking.selectDate')} *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal mt-2"
                        data-testid="date-picker-button"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.appointment_date ? format(formData.appointment_date, 'PPP') : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.appointment_date}
                        onSelect={handleDateChange}
                        disabled={isDateDisabled}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                {/* Select Time */}
                <div data-testid="time-select-container">
                  <Label htmlFor="time" className="text-[#3E3E3E] font-semibold">
                    {t('booking.selectTime')} *
                  </Label>
                  <Select value={formData.appointment_time} onValueChange={handleTimeChange}>
                    <SelectTrigger className="mt-2" id="time" data-testid="time-select">
                      <SelectValue placeholder={t('booking.selectTime')} />
                    </SelectTrigger>
                    <SelectContent>
                      {timeSlots.map((time) => (
                        <SelectItem key={time} value={time} data-testid={`time-option-${time}`}>
                          {time}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="border-t border-[#F8E6E9] pt-6 mt-6">
                  <h3 className="text-xl font-bold mb-4 text-[#8B6F8E]" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {t('booking.yourInfo')}
                  </h3>

                  {/* Customer Name */}
                  <div className="mb-4" data-testid="name-input-container">
                    <Label htmlFor="name" className="text-[#3E3E3E] font-semibold">
                      {t('booking.name')} *
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.customer_name}
                      onChange={handleInputChange('customer_name')}
                      className="mt-2"
                      placeholder="Your name"
                      data-testid="name-input"
                      required
                    />
                  </div>

                  {/* Customer Email */}
                  <div className="mb-4" data-testid="email-input-container">
                    <Label htmlFor="email" className="text-[#3E3E3E] font-semibold">
                      {t('booking.email')} *
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.customer_email}
                      onChange={handleInputChange('customer_email')}
                      className="mt-2"
                      placeholder="your.email@example.com"
                      data-testid="email-input"
                      required
                    />
                  </div>

                  {/* Customer Phone */}
                  <div className="mb-4" data-testid="phone-input-container">
                    <Label htmlFor="phone" className="text-[#3E3E3E] font-semibold">
                      {t('booking.phone')} *
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.customer_phone}
                      onChange={handleInputChange('customer_phone')}
                      className="mt-2"
                      placeholder="+41 XX XXX XX XX"
                      data-testid="phone-input"
                      required
                    />
                  </div>

                  {/* Notes */}
                  <div data-testid="notes-input-container">
                    <Label htmlFor="notes" className="text-[#3E3E3E] font-semibold">
                      {t('booking.notes')}
                    </Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={handleInputChange('notes')}
                      className="mt-2"
                      placeholder="Any special requests or preferences?"
                      rows={4}
                      data-testid="notes-input"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-gradient-to-r from-[#F4C2C2] to-[#D4AF76] hover:opacity-90 text-white rounded-full py-6 text-lg"
                  data-testid="confirm-booking-button"
                >
                  {submitting ? 'Booking...' : t('booking.confirmBooking')}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default memo(BookingPage);