import React from 'react';
import { Link } from 'react-router-dom';
import { Code, Palette, Cloud, RefreshCw, Users, TrendingUp, Video, Server } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';

const Services = () => {
  const services = [
    {
      icon: Code,
      title: "Web Design & Development",
      description: "Professional, responsive websites built with cutting-edge technologies and best practices.",
      features: ["Custom Websites", "E-commerce", "CMS", "PWAs"],
      slug: "web-design-development",
      image: "https://images.unsplash.com/photo-1759662011366-8a743eae9649?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxwcm9mZXNzaW9uYWwlMjBzb2Z0d2FyZSUyMGRldmVsb3BtZW50fGVufDB8fHx8MTc2MzIwMDMwMHww&ixlib=rb-4.1.0&q=85"
    },
    {
      icon: Users,
      title: "Mobile App Development",
      description: "Native and cross-platform mobile applications with superior UI/UX and performance.",
      features: ["iOS Apps", "Android Apps", "Cross-Platform", "App Store"],
      slug: "mobile-app-development",
      image: "https://images.unsplash.com/photo-1760670399462-f5e479452c27?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwyfHxwcm9mZXNzaW9uYWwlMjBzb2Z0d2FyZSUyMGRldmVsb3BtZW50fGVufDB8fHx8MTc2MzIwMDMwMHww&ixlib=rb-4.1.0&q=85"
    },
    {
      icon: TrendingUp,
      title: "Digital Marketing",
      description: "Comprehensive digital marketing strategies, SEO, social media, and content marketing.",
      features: ["SEO", "Social Media", "PPC", "Analytics"],
      slug: "digital-marketing",
      image: "https://images.unsplash.com/photo-1759884247447-beea12f8a207?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwzfHxwcm9mZXNzaW9uYWwlMjBzb2Z0d2FyZSUyMGRldmVsb3BtZW50fGVufDB8fHx8MTc2MzIwMDMwMHww&ixlib=rb-4.1.0&q=85"
    },
    {
      icon: Palette,
      title: "Graphic Design & Branding",
      description: "Complete brand identity, logo design, motion graphics, and all your visual needs.",
      features: ["Logo Design", "Branding", "Motion Graphics", "Print Design"],
      slug: "graphic-design-branding",
      image: "https://images.unsplash.com/photo-1623715537851-8bc15aa8c145?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwxfHx0ZWNobm9sb2d5JTIwd29ya3NwYWNlfGVufDB8fHx8MTc2MzIwMDMwNnww&ixlib=rb-4.1.0&q=85"
    },
    {
      icon: Video,
      title: "Video Production",
      description: "Professional video content: commercials, corporate videos, and promotional content.",
      features: ["Commercials", "Corporate Videos", "Explainer Videos", "Animation"],
      slug: "video-production",
      image: "https://images.unsplash.com/photo-1759884247194-f1fd2144951b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHw0fHxwcm9mZXNzaW9uYWwlMjBzb2Z0d2FyZSUyMGRldmVsb3BtZW50fGVufDB8fHx8MTc2MzIwMDMwMHww&ixlib=rb-4.1.0&q=85"
    },
    {
      icon: Server,
      title: "Hosting & Support",
      description: "Enterprise-grade hosting with 99.9% uptime and 24/7 technical support.",
      features: ["Cloud Hosting", "SSL", "Backups", "24/7 Support"],
      slug: "hosting-support",
      image: "https://images.unsplash.com/photo-1611648694931-1aeda329f9da?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njl8MHwxfHNlYXJjaHwzfHx0ZWNobm9sb2d5JTIwd29ya3NwYWNlfGVufDB8fHx8MTc2MzIwMDMwNnww&ixlib=rb-4.1.0&q=85"
    }
  ];

  return (
    <section id="services" className="py-24 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-600 dark:text-cyan-400 font-semibold text-sm uppercase tracking-wide">Our Services</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-4 mb-6">
            Comprehensive Software Solutions
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            From concept to deployment, we deliver end-to-end software development services tailored to your business needs.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card 
                key={index} 
                className="group hover:shadow-2xl transition-all duration-500 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:scale-[1.02] cursor-pointer overflow-hidden animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {/* Professional Image Header */}
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent"></div>
                  
                  {/* Floating Icon */}
                  <div className="absolute bottom-4 left-4 w-14 h-14 bg-white dark:bg-gray-900 rounded-xl flex items-center justify-center shadow-xl group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <Icon className="w-7 h-7 text-blue-600 dark:text-cyan-400" />
                  </div>
                </div>

                {/* Gradient Accent on Hover */}
                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-cyan-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500"></div>
                
                <CardHeader className="relative">
                  <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors duration-300">
                    {service.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400 mt-2">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-2 mb-4">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-gray-700 dark:text-gray-300 transform translate-x-0 group-hover:translate-x-1 transition-transform duration-300" style={{ transitionDelay: `${idx * 50}ms` }}>
                        <div className="w-1.5 h-1.5 bg-blue-600 dark:bg-cyan-400 rounded-full mr-2 group-hover:scale-150 transition-transform duration-300"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Link to={`/services/${service.slug}`}>
                    <Button variant="ghost" className="w-full text-blue-600 dark:text-cyan-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 group/btn">
                      <span>Learn More</span>
                      <span className="inline-block ml-2 group-hover/btn:translate-x-2 transition-transform duration-300">→</span>
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
