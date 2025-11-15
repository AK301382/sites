import React, { useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import { Label } from '../../../components/ui/label';
import { Card } from '../../../components/ui/card';
import { Mail, Phone, MapPin, Send, Loader2 } from 'lucide-react';
import { useContactForm } from '../../../lib/hooks/useContactForm';

const ContactCTA = () => {
  const { isSubmitting, submitContactForm } = useContactForm();
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    service: '',
    budget: '',
    timeline: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSelectChange = (name, value) => {
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const result = await submitContactForm(formData);
    
    if (result.success) {
      // Reset form on success
      setFormData({
        name: '',
        company: '',
        email: '',
        phone: '',
        service: '',
        budget: '',
        timeline: '',
        message: ''
      });
    }
  };

  return (
    <section id="contact" className="py-24 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-600 dark:text-cyan-400 font-semibold text-sm uppercase tracking-wide">Get In Touch</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-4 mb-6">
            Ready to Start Your Project?
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Let's discuss how we can help bring your vision to life. Free consultation, no obligations.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="p-6 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-blue-600 dark:text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Email Us</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">hello@kawesh.com</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">sales@kawesh.com</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-blue-600 dark:text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Call Us</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">+1 (555) 123-4567</p>
                  <p className="text-gray-500 dark:text-gray-500 text-xs mt-1">Mon-Fri 9am-6pm EST</p>
                </div>
              </div>
            </Card>

            <Card className="p-6 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-blue-600 dark:text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Visit Us</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">123 Tech Street</p>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">San Francisco, CA 94105</p>
                </div>
              </div>
            </Card>

            {/* Social Links */}
            <div className="pt-6">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Follow Us</h3>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 dark:hover:bg-cyan-500 transition-colors group">
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 dark:hover:bg-cyan-500 transition-colors group">
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </a>
                <a href="#" className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center hover:bg-blue-600 dark:hover:bg-cyan-500 transition-colors group">
                  <svg className="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="p-8 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Your Name *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                      className="border-gray-300 dark:border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company">Company</Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="Your Company"
                      className="border-gray-300 dark:border-gray-700"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                      className="border-gray-300 dark:border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+1 (555) 123-4567"
                      className="border-gray-300 dark:border-gray-700"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="service">Service Needed *</Label>
                    <Select value={formData.service} onValueChange={(value) => handleSelectChange('service', value)} required>
                      <SelectTrigger className="border-gray-300 dark:border-gray-700">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="custom-dev">Custom Software Development</SelectItem>
                        <SelectItem value="design">Product Design & UX</SelectItem>
                        <SelectItem value="cloud">Cloud & DevOps</SelectItem>
                        <SelectItem value="modernization">Legacy Modernization</SelectItem>
                        <SelectItem value="team">Dedicated Team</SelectItem>
                        <SelectItem value="consulting">Consulting & Strategy</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget Range</Label>
                    <Select value={formData.budget} onValueChange={(value) => handleSelectChange('budget', value)}>
                      <SelectTrigger className="border-gray-300 dark:border-gray-700">
                        <SelectValue placeholder="Select budget range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="10k-50k">$10k - $50k</SelectItem>
                        <SelectItem value="50k-100k">$50k - $100k</SelectItem>
                        <SelectItem value="100k-250k">$100k - $250k</SelectItem>
                        <SelectItem value="250k+">$250k+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeline">Timeline</Label>
                  <Select value={formData.timeline} onValueChange={(value) => handleSelectChange('timeline', value)}>
                    <SelectTrigger className="border-gray-300 dark:border-gray-700">
                      <SelectValue placeholder="Select timeline" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="asap">ASAP</SelectItem>
                      <SelectItem value="1-3-months">1-3 months</SelectItem>
                      <SelectItem value="3-6-months">3-6 months</SelectItem>
                      <SelectItem value="6+-months">6+ months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Project Description *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your project..."
                    rows={5}
                    required
                    className="border-gray-300 dark:border-gray-700"
                  />
                </div>

                <Button type="submit" size="lg" className="w-full bg-blue-600 hover:bg-blue-700 text-white" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <Send className="ml-2 w-5 h-5" />
                    </>
                  )}
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactCTA;
