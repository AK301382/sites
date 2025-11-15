import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import SEOOptimized from '../../../components/common/SEOOptimized';
import { servicesData } from '../../../lib/config/servicesData';
import { Button } from '../../../components/ui/button';
import { Card } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../components/ui/tabs';
import ServiceInquiryForm from '../../../components/forms/ServiceInquiryForm';
import ConsultationBooking from '../../../components/forms/ConsultationBooking';
import ServiceTestimonials from '../components/ServiceTestimonials';
import ServiceRating from '../components/ServiceRating';
import { ArrowRight, ArrowLeft, CheckCircle2, ChevronRight, Users, Award, Clock } from 'lucide-react';
import * as Icons from 'lucide-react';

const ServiceDetailPage = () => {
  const { slug } = useParams();
  const service = servicesData.find(s => s.slug === slug);
  const [activeTab, setActiveTab] = useState('overview');

  if (!service) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950 pt-20">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Service Not Found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">The service you're looking for doesn't exist.</p>
          <Link to="/services">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="mr-2 w-4 h-4" />
              Back to Services
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const Icon = Icons[service.icon] || Icons.Code;

  // JSON-LD Structured Data for SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": service.title,
    "description": service.shortDesc,
    "provider": {
      "@type": "Organization",
      "name": "Kawesh",
      "url": "https://kawesh.com"
    },
    "areaServed": "Worldwide",
    "availableChannel": {
      "@type": "ServiceChannel",
      "serviceUrl": `https://kawesh.com/services/${slug}`
    }
  };

  return (
    <>
      {/* Dual SEO approach for maximum compatibility */}
      <Helmet>
        <title>{service.title} - Professional {service.title} Services | Kawesh</title>
        <meta name="description" content={service.shortDesc} />
        <meta name="keywords" content={`${service.title}, ${service.features.join(', ')}, kawesh services`} />
        
        {/* Open Graph */}
        <meta property="og:title" content={`${service.title} - Kawesh`} />
        <meta property="og:description" content={service.shortDesc} />
        <meta property="og:image" content={service.image} />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${service.title} - Kawesh`} />
        <meta name="twitter:description" content={service.shortDesc} />
        <meta name="twitter:image" content={service.image} />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      {/* React 19 optimized SEO component */}
      <SEOOptimized
        title={`${service.title} - Professional ${service.title} Services`}
        description={service.shortDesc}
        keywords={`${service.title}, ${service.features.join(', ')}, kawesh services`}
        ogImage={service.image}
        type="website"
      />

      <div className="min-h-screen bg-white dark:bg-gray-950 pt-20" data-testid="service-detail-page">
        {/* Breadcrumb */}
        <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Link to="/" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Home</Link>
              <ChevronRight className="w-4 h-4" />
              <Link to="/services" className="hover:text-blue-600 dark:hover:text-cyan-400 transition-colors">Services</Link>
              <ChevronRight className="w-4 h-4" />
              <span className="text-gray-900 dark:text-white font-medium">{service.title}</span>
            </div>
          </div>
        </div>

        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-br from-gray-50 via-blue-50/30 to-cyan-50/30 dark:from-gray-950 dark:via-blue-950/20 dark:to-cyan-950/20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <span className="text-sm text-blue-600 dark:text-cyan-400 font-semibold uppercase tracking-wide">Professional Service</span>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">{service.title}</h1>
                  </div>
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4">
                  {service.headline}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
                  {service.introduction}
                </p>
                <div className="flex flex-wrap gap-4">
                  <a href="#get-quote">
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all">
                      Get Started
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </a>
                  <a href="#book-consultation">
                    <Button size="lg" variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20">
                      Book Free Consultation
                    </Button>
                  </a>
                </div>
              </div>
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl blur-2xl opacity-20"></div>
                <img
                  src={service.image}
                  alt={service.title}
                  className="relative rounded-2xl shadow-2xl w-full h-auto"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Description */}
        <section className="py-16 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <div className="prose prose-lg dark:prose-invert max-w-none">
                {service.detailedDescription.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Why Choose Kawesh for {service.title}?
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                We deliver exceptional results with proven methodologies and cutting-edge technologies.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {service.benefits.map((benefit, index) => {
                const BenefitIcon = Icons[benefit.icon] || Icons.CheckCircle2;
                return (
                  <Card key={index} className="p-6 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:shadow-xl transition-all duration-300 hover:-translate-y-1" data-testid={`benefit-card-${index}`}>
                    <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mb-4">
                      <BenefitIcon className="w-7 h-7 text-blue-600 dark:text-cyan-400" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{benefit.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{benefit.description}</p>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                What's Included
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Comprehensive services tailored to your needs
              </p>
            </div>

            <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-6">
              {service.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-3 p-4 rounded-lg bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800" data-testid={`feature-item-${index}`}>
                  <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-900 dark:text-white font-medium">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Our Process
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                A proven, step-by-step approach that ensures success and transparency.
              </p>
            </div>

            <div className="max-w-4xl mx-auto space-y-8">
              {service.process.map((step, index) => (
                <div key={index} className="flex gap-6" data-testid={`process-step-${index}`}>
                  <div className="flex-shrink-0">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{step.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Technologies Section */}
        <section className="py-20 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Technologies & Tools We Use
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                We leverage the best tools and technologies to deliver superior results.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4">
              {service.technologies.map((tech, index) => (
                <Badge key={index} className="px-6 py-3 text-base bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-cyan-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 border-0" data-testid={`tech-badge-${index}`}>
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        {/* Ideal For Section */}
        <section className="py-16 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
              <Card className="p-8 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30 border-blue-200 dark:border-blue-800">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">Ideal For</h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                      {service.idealFor}
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Rating Section */}
        <ServiceRating rating={service.rating} />

        {/* Testimonials Section */}
        <ServiceTestimonials testimonials={service.testimonials} />

        {/* Forms Section */}
        <section className="py-20 bg-gray-50 dark:bg-gray-900" id="get-quote">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Let's Get Started
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300">
                Choose how you'd like to proceed - request a detailed quote or book a free consultation call.
              </p>
            </div>

            <div className="max-w-5xl mx-auto">
              <Tabs defaultValue="quote" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 mb-8">
                  <TabsTrigger value="quote" className="text-base" data-testid="quote-tab">Request Quote</TabsTrigger>
                  <TabsTrigger value="consultation" className="text-base" data-testid="consultation-tab">Book Consultation</TabsTrigger>
                </TabsList>
                <TabsContent value="quote">
                  <ServiceInquiryForm serviceTitle={service.title} serviceName={service.title} />
                </TabsContent>
                <TabsContent value="consultation" id="book-consultation">
                  <ConsultationBooking serviceTitle={service.title} serviceName={service.title} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white dark:bg-gray-950">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Award className="w-8 h-8 text-blue-600 dark:text-cyan-400" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">200+</div>
                <p className="text-gray-600 dark:text-gray-400">Successful Projects</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Users className="w-8 h-8 text-blue-600 dark:text-cyan-400" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">150+</div>
                <p className="text-gray-600 dark:text-gray-400">Happy Clients</p>
              </div>
              <div className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                    <Clock className="w-8 h-8 text-blue-600 dark:text-cyan-400" />
                  </div>
                </div>
                <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">24/7</div>
                <p className="text-gray-600 dark:text-gray-400">Support Available</p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="py-24 bg-gradient-to-br from-blue-600 to-cyan-600 dark:from-blue-700 dark:to-cyan-700">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-4xl font-bold text-white mb-6">
                Ready to Start Your Project?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Let's discuss how we can help you achieve your goals with our {service.title.toLowerCase()} services.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#get-quote">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 shadow-lg">
                    Get Free Consultation
                  </Button>
                </a>
                <Link to="/services">
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10">
                    <ArrowLeft className="mr-2 w-5 h-5" />
                    All Services
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default ServiceDetailPage;
