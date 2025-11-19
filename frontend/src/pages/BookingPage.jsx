import React, { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
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
import { Calendar as CalendarIcon, CheckCircle2, User as UserIcon } from 'lucide-react';
import { format } from 'date-fns';
import { useUserAuth } from '@/contexts/UserAuthContext';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Memoized Success Message Component
const SuccessMessage = memo(({ t, onReset, onViewDashboard }) => (
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
        <div className="flex flex-col gap-3">
          <Button 
            className="bg-gradient-to-r from-[#F4C2C2] to-[#D4AF76] hover:opacity-90 text-white rounded-full px-8" 
            onClick={onViewDashboard}
            data-testid="view-dashboard-button"
          >
            <UserIcon className="w-4 h-4 mr-2" />
            View My Dashboard
          </Button>
          <Button 
            variant="outline"
            className="border-2 border-[#8B6F8E] text-[#8B6F8E] hover:bg-[#8B6F8E] hover:text-white rounded-full px-8" 
            onClick={onReset} 
            data-testid="book-another-button"
          >
            Book Another Appointment
          </Button>
        </div>
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
  const navigate = useNavigate();
  const { user, isAuthenticated } = useUserAuth();
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
  // Smart availability states
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [serviceDuration, setServiceDuration] = useState(null);

  // Auto-fill user info if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setFormData(prev => ({
        ...prev,
        customer_name: user.name || prev.customer_name,
        customer_email: user.email || prev.customer_email,
      }));
    }
  }, [isAuthenticated, user]);

  // Fetch available slots when artist, date, or service changes
  useEffect(() => {
    const fetchAvailableSlots = async () => {
      if (!formData.artist_id || !formData.appointment_date || !formData.service_id) {
        setAvailableSlots([]);
        setServiceDuration(null);
        return;
      }

      setLoadingSlots(true);
      try {
        const dateStr = format(formData.appointment_date, 'yyyy-MM-dd');
        const response = await axios.get(`${API}/appointments/availability`, {
          params: {
            artist_id: formData.artist_id,
            date: dateStr,
            service_id: formData.service_id
          }
        });

        if (response.data.success) {
          setAvailableSlots(response.data.available_slots);
          setServiceDuration(response.data.service_duration);

          // Reset time if previously selected time is no longer available
          if (formData.appointment_time && 
              !response.data.available_slots.includes(formData.appointment_time)) {
            setFormData(prev => ({ ...prev, appointment_time: '' }));
            toast.warning('Previously selected time is no longer available. Please select another time.');
          }
        }
      } catch (error) {
        console.error('Error fetching availability:', error);
        toast.error('Failed to load available time slots');
        setAvailableSlots([]);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchAvailableSlots();
  }, [formData.artist_id, formData.appointment_date, formData.service_id, formData.appointment_time]);

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
      // Final availability check before submitting
      const availabilityCheck = await axios.post(
        `${API}/appointments/check-availability`,
        {
          artist_id: formData.artist_id,
          date: format(formData.appointment_date, 'yyyy-MM-dd'),
          time: formData.appointment_time,
          service_id: formData.service_id
        }
      );

      if (!availabilityCheck.data.available) {
        toast.error(availabilityCheck.data.reason || 'Selected time is no longer available');
        // Refresh available slots
        setFormData(prev => ({ ...prev, appointment_time: '' }));
        setSubmitting(false);
        return;
      }

      // Proceed with booking
      const appointmentData = {
        ...formData,
        appointment_date: format(formData.appointment_date, 'yyyy-MM-dd'),
      };

      // CRITICAL FIX: Add withCredentials to link appointment to authenticated user
      await axios.post(`${API}/appointments`, appointmentData, {
        withCredentials: true
      });

      setSuccess(true);
      toast.success(t('booking.bookingSuccess'));

      // Reset form
      setFormData({
        service_id: '',
        artist_id: '',
        appointment_date: null,
        appointment_time: '',
        customer_name: user?.name || '',
        customer_email: user?.email || '',
        customer_phone: '',
        notes: '',
      });
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error(error.response?.data?.detail || 'Failed to book appointment. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }, [formData, t, user]);

  const handleReset = useCallback(() => {
    setSuccess(false);
  }, []);

  const handleViewDashboard = useCallback(() => {
    if (isAuthenticated) {
      navigate('/user/dashboard');
    } else {
      navigate('/user/login');
    }
  }, [isAuthenticated, navigate]);

  // Memoized calendar date validator
  const isDateDisabled = useCallback((date) => date < new Date(new Date().setHours(0, 0, 0, 0)), []);

  if (loading) return <LoadingSpinner />;
  if (success) return <SuccessMessage t={t} onReset={handleReset} onViewDashboard={handleViewDashboard} />;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-[#F8E6E9] to-white" data-testid="booking-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-[#8B6F8E]" style={{ fontFamily: 'Playfair Display, serif' }}>
            {t('booking.title')}
          </h1>
          <p className="text-base sm:text-lg text-[#3E3E3E]/70 max-w-2xl mx-auto">Schedule your next nail appointment in just a few clicks</p>
          
          {/* Login Prompt for non-authenticated users */}
          {!isAuthenticated && (
            <div className="mt-6 p-4 bg-[#F4C2C2]/10 border border-[#F4C2C2] rounded-lg max-w-md mx-auto">
              <p className="text-sm text-[#8B6F8E]">
                💡 <strong>Tip:</strong> <button onClick={() => navigate('/user/login')} className="underline hover:text-[#F4C2C2]">Login</button> to automatically save your bookings to your dashboard!
              </p>
            </div>
          )}
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
                    {serviceDuration && (
                      <span className="ml-2 text-sm text-gray-500 font-normal">
                        (Duration: {serviceDuration} min)
                      </span>
                    )}
                  </Label>

                  {loadingSlots ? (
                    <div className="flex items-center justify-center py-8 mt-2 border-2 border-dashed border-[#F8E6E9] rounded-lg">
                      <div className="text-center">
                        <div className="w-8 h-8 border-3 border-[#F4C2C2] border-t-[#D4AF76] rounded-full animate-spin mx-auto mb-2"></div>
                        <p className="text-sm text-gray-500">Loading available times...</p>
                      </div>
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <div className="p-4 mt-2 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        {formData.artist_id && formData.appointment_date && formData.service_id
                          ? '⚠️ No available time slots for this date. Please select another date.'
                          : '👆 Please select artist, service, and date first.'}
                      </p>
                    </div>
                  ) : (
                    <>
                      <Select value={formData.appointment_time} onValueChange={handleTimeChange}>
                        <SelectTrigger className="mt-2" id="time" data-testid="time-select">
                          <SelectValue placeholder={t('booking.selectTime')} />
                        </SelectTrigger>
                        <SelectContent>
                          {availableSlots.map((time) => (
                            <SelectItem key={time} value={time} data-testid={`time-option-${time}`}>
                              {time}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {availableSlots.length > 0 && (
                        <p className="text-xs text-green-600 mt-2">
                          ✅ {availableSlots.length} time slot{availableSlots.length > 1 ? 's' : ''} available
                        </p>
                      )}
                    </>
                  )}
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
                      disabled={isAuthenticated}
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
                      disabled={isAuthenticated}
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