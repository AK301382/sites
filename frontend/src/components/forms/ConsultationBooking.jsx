import React, { useState } from 'react';
import { servicesAPI } from '../../lib/api/client';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner';
import { Loader2, Calendar, Clock } from 'lucide-react';

const ConsultationBooking = ({ serviceTitle, serviceName }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service_interested: serviceName || '',
    preferred_date: '',
    preferred_time: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await servicesAPI.bookConsultation(formData);
      toast.success(response.message || 'Consultation booked successfully!');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        service_interested: serviceName || '',
        preferred_date: '',
        preferred_time: '',
        message: ''
      });
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 'Failed to book consultation. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Generate date options for the next 30 days
  const getAvailableDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push({
        value: date.toISOString().split('T')[0],
        label: date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
      });
    }
    return dates;
  };

  const timeSlots = [
    { value: '09:00-10:00', label: '9:00 AM - 10:00 AM' },
    { value: '10:00-11:00', label: '10:00 AM - 11:00 AM' },
    { value: '11:00-12:00', label: '11:00 AM - 12:00 PM' },
    { value: '12:00-13:00', label: '12:00 PM - 1:00 PM' },
    { value: '14:00-15:00', label: '2:00 PM - 3:00 PM' },
    { value: '15:00-16:00', label: '3:00 PM - 4:00 PM' },
    { value: '16:00-17:00', label: '4:00 PM - 5:00 PM' },
  ];

  return (
    <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900" data-testid="consultation-booking-form">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
          Book a Free Consultation
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Schedule a free consultation call to discuss your {serviceTitle} needs.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name and Email */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-900 dark:text-white">Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                data-testid="consultation-name-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-900 dark:text-white">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                data-testid="consultation-email-input"
              />
            </div>
          </div>

          {/* Phone and Company */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-900 dark:text-white">Phone *</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                required
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                data-testid="consultation-phone-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company" className="text-gray-900 dark:text-white">Company</Label>
              <Input
                id="company"
                name="company"
                value={formData.company}
                onChange={handleChange}
                placeholder="Acme Inc."
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                data-testid="consultation-company-input"
              />
            </div>
          </div>

          {/* Preferred Date and Time */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="preferred_date" className="text-gray-900 dark:text-white flex items-center">
                <Calendar className="w-4 h-4 mr-2" />
                Preferred Date *
              </Label>
              <Select onValueChange={(value) => handleSelectChange('preferred_date', value)} value={formData.preferred_date} required>
                <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700" data-testid="consultation-date-select">
                  <SelectValue placeholder="Select a date" />
                </SelectTrigger>
                <SelectContent>
                  {getAvailableDates().map((date) => (
                    <SelectItem key={date.value} value={date.value}>
                      {date.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="preferred_time" className="text-gray-900 dark:text-white flex items-center">
                <Clock className="w-4 h-4 mr-2" />
                Preferred Time *
              </Label>
              <Select onValueChange={(value) => handleSelectChange('preferred_time', value)} value={formData.preferred_time} required>
                <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700" data-testid="consultation-time-select">
                  <SelectValue placeholder="Select a time" />
                </SelectTrigger>
                <SelectContent>
                  {timeSlots.map((slot) => (
                    <SelectItem key={slot.value} value={slot.value}>
                      {slot.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Additional Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-gray-900 dark:text-white">Additional Notes (Optional)</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Any specific topics you'd like to discuss?"
              rows={3}
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
              data-testid="consultation-message-textarea"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            data-testid="consultation-submit-button"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Booking...
              </>
            ) : (
              <>
                <Calendar className="mr-2 h-4 w-4" />
                Book Consultation
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ConsultationBooking;
