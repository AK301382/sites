import React, { useState } from 'react';
import { servicesAPI } from '../../lib/api/client';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner';
import { Loader2, Send } from 'lucide-react';

const ServiceInquiryForm = ({ serviceTitle, serviceName }) => {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    service_type: serviceName || '',
    message: '',
    budget_range: '',
    timeline: ''
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
      const response = await servicesAPI.submitInquiry(formData);
      toast.success(response.message || 'Inquiry submitted successfully!');
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        service_type: serviceName || '',
        message: '',
        budget_range: '',
        timeline: ''
      });
    } catch (error) {
      // Use enhanced error message from API interceptor
      const errorMessage = error.userMessage || error.response?.data?.detail || 'Failed to submit inquiry. Please try again.';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900" data-testid="service-inquiry-form">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
          Request a Quote for {serviceTitle}
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Fill out the form below and our team will get back to you within 24 hours.
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
                data-testid="inquiry-name-input"
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
                data-testid="inquiry-email-input"
              />
            </div>
          </div>

          {/* Phone and Company */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-gray-900 dark:text-white">Phone</Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
                data-testid="inquiry-phone-input"
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
                data-testid="inquiry-company-input"
              />
            </div>
          </div>

          {/* Budget and Timeline */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="budget_range" className="text-gray-900 dark:text-white">Budget Range</Label>
              <Select onValueChange={(value) => handleSelectChange('budget_range', value)} value={formData.budget_range}>
                <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700" data-testid="inquiry-budget-select">
                  <SelectValue placeholder="Select budget range" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="under-5k">Under $5,000</SelectItem>
                  <SelectItem value="5k-15k">$5,000 - $15,000</SelectItem>
                  <SelectItem value="15k-50k">$15,000 - $50,000</SelectItem>
                  <SelectItem value="50k-plus">$50,000+</SelectItem>
                  <SelectItem value="not-sure">Not Sure</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="timeline" className="text-gray-900 dark:text-white">Timeline</Label>
              <Select onValueChange={(value) => handleSelectChange('timeline', value)} value={formData.timeline}>
                <SelectTrigger className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700" data-testid="inquiry-timeline-select">
                  <SelectValue placeholder="Select timeline" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urgent">Urgent (1-2 weeks)</SelectItem>
                  <SelectItem value="1-3-months">1-3 months</SelectItem>
                  <SelectItem value="3-6-months">3-6 months</SelectItem>
                  <SelectItem value="6-plus-months">6+ months</SelectItem>
                  <SelectItem value="flexible">Flexible</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="message" className="text-gray-900 dark:text-white">Project Details *</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Tell us about your project, goals, and any specific requirements..."
              required
              rows={5}
              className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700"
              data-testid="inquiry-message-textarea"
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            data-testid="inquiry-submit-button"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Send className="mr-2 h-4 w-4" />
                Submit Inquiry
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ServiceInquiryForm;
