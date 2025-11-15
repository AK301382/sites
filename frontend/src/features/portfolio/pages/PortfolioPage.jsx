import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { portfolioWorks, portfolioCategories } from '../../../lib/config/portfolioData';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Award,
  TrendingUp,
  Eye,
  Rocket,
  Star
} from 'lucide-react';
import SEOOptimized from '../../../components/common/SEOOptimized';

const PortfolioPage = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');

  const filteredProjects = selectedFilter === 'All'
    ? portfolioWorks
    : portfolioWorks.filter(project => project.category === selectedFilter);

  // Stats for hero section
  const stats = [
    { number: "200+", label: "Projects Delivered", icon: Rocket },
    { number: "150+", label: "Happy Clients", icon: Award },
    { number: "98%", label: "Success Rate", icon: TrendingUp },
    { number: "18", label: "Work Samples", icon: Star }
  ];

  return (
    <>
      {/* SEO Meta Tags */}
      <Helmet>
        <title>Our Portfolio - Featured Projects & Case Studies | Kawesh</title>
        <meta name="description" content="Explore Kawesh's portfolio of successful digital projects. From web development to mobile apps, digital marketing, branding, video production, and hosting solutions." />
        <meta name="keywords" content="portfolio, case studies, web development projects, mobile app projects, digital marketing campaigns, branding work, video production, success stories" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Our Portfolio - Featured Projects & Case Studies | Kawesh" />
        <meta property="og:description" content="Explore our portfolio of successful digital projects across web, mobile, marketing, design, and more." />
        <meta property="og:image" content="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop" />
        <meta property="og:type" content="website" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Our Portfolio - Featured Projects & Case Studies | Kawesh" />
        <meta name="twitter:description" content="Explore our portfolio of successful digital projects across web, mobile, marketing, design, and more." />
        <meta name="twitter:image" content="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop" />
      </Helmet>

      <SEOOptimized
        title="Our Portfolio - Featured Projects & Case Studies"
        description="Explore Kawesh's portfolio of successful digital projects. From web development to mobile apps, digital marketing, branding, video production, and hosting solutions."
        keywords="portfolio, case studies, web development projects, mobile app projects, digital marketing campaigns, branding work, video production"
        ogImage="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=630&fit=crop"
      />

      <div className="min-h-screen bg-white dark:bg-gray-950 pt-20" data-testid="portfolio-page">
        {/* Hero Section - Enhanced */}
        <section className="py-24 bg-gradient-to-br from-gray-50 via-blue-50/30 to-cyan-50/30 dark:from-gray-950 dark:via-blue-950/20 dark:to-cyan-950/20 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-5 dark:opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(59, 130, 246) 1px, transparent 0)',
              backgroundSize: '40px 40px'
            }}></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="px-6 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-cyan-400 border-0 text-sm font-semibold mb-6 inline-flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Our Portfolio
              </Badge>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="text-gray-900 dark:text-white">Where Vision Meets</span>
                <br />
                <span className="bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-700 bg-clip-text text-transparent">
                  Exceptional Execution
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8 max-w-3xl mx-auto">
                Discover how we've transformed businesses across industries with innovative digital solutions. 
                Each project represents our commitment to excellence, creativity, and measurable results that 
                drive real business growth.
              </p>

              {/* Key Highlights */}
              <div className="flex flex-wrap justify-center gap-6 mb-8">
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="font-medium">Award-Winning Work</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="font-medium">Proven Results</span>
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                  <span className="font-medium">Client Success Stories</span>
                </div>
              </div>

              {/* CTA Button */}
              <Link to="/contact">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all">
                  Start Your Project
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="text-center" data-testid={`portfolio-stat-${index}`}>
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                        <IconComponent className="w-8 h-8 text-blue-600 dark:text-cyan-400" />
                      </div>
                    </div>
                    <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{stat.number}</div>
                    <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Introduction Paragraph */}
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full mb-6">
                <Eye className="w-8 h-8 text-blue-600 dark:text-cyan-400" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Real Projects. Real Results. Real Impact.
              </h2>
              <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
                Our portfolio showcases diverse projects across web development, mobile applications, digital marketing campaigns, 
                brand identities, video production, and technical infrastructure. Each work sample demonstrates our expertise in 
                delivering beautiful, functional, and results-driven solutions. From startups to enterprises, we've helped businesses 
                achieve their digital goals with innovative strategies and flawless execution. Explore our work organized by service 
                category and see how we can bring your vision to life.
              </p>
            </div>
          </div>
        </section>

        {/* Filter Section - Enhanced */}
        <section className="py-12 bg-white dark:bg-gray-950 sticky top-20 z-40 border-b border-gray-200 dark:border-gray-800 shadow-sm">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap gap-3 justify-center">
              {portfolioCategories.map((category) => (
                <Button
                  key={category}
                  onClick={() => setSelectedFilter(category)}
                  variant={selectedFilter === category ? 'default' : 'outline'}
                  className={selectedFilter === category 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-md' 
                    : 'border-2 border-gray-300 dark:border-gray-700 hover:border-blue-600 dark:hover:border-cyan-400 transition-colors'}
                  data-testid={`filter-${category.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  {category}
                  {category === 'All' && ` (${portfolioWorks.length})`}
                  {category !== 'All' && ` (${portfolioWorks.filter(p => p.category === category).length})`}
                </Button>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Grid - Enhanced */}
        <section className="py-24 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            {filteredProjects.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-gray-600 dark:text-gray-400">No projects found in this category.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredProjects.map((project) => (
                  <Card
                    key={project.id}
                    className="group hover:shadow-2xl transition-all duration-300 overflow-hidden border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:-translate-y-2"
                    data-testid={`project-card-${project.id}`}
                  >
                    {/* Project Image */}
                    <div className="relative h-56 overflow-hidden bg-gray-900">
                      <img
                        src={project.image}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent"></div>
                      
                      {/* Category Badge */}
                      <Badge className="absolute top-4 left-4 bg-white/95 text-gray-900 border-0 font-semibold">
                        {project.category.split(' ')[0]}
                      </Badge>
                      
                      {/* Year Badge */}
                      <Badge className="absolute top-4 right-4 bg-blue-600 text-white border-0">
                        {project.year}
                      </Badge>
                    </div>

                    <CardHeader>
                      <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
                        {project.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <Award className="w-4 h-4" />
                        {project.client}
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                      {/* Description */}
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {project.shortDescription}
                      </p>

                      {/* Results Metrics */}
                      <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-100 dark:border-blue-900/30">
                        <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          Key Results:
                        </p>
                        <div className="grid grid-cols-3 gap-2">
                          <div className="text-center">
                            <div className="text-xs font-bold text-blue-600 dark:text-cyan-400">
                              {project.results.metric1}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs font-bold text-green-600 dark:text-green-400">
                              {project.results.metric2}
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs font-bold text-purple-600 dark:text-purple-400">
                              {project.results.metric3}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Technologies */}
                      <div className="flex flex-wrap gap-2">
                        {project.technologies.map((tech, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs border-gray-300 dark:border-gray-700">
                            {tech}
                          </Badge>
                        ))}
                      </div>

                      {/* Duration */}
                      <div className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        Duration: {project.duration}
                      </div>

                      {/* CTA */}
                      <Button 
                        variant="ghost" 
                        className="w-full group/btn hover:bg-blue-50 dark:hover:bg-blue-950/20 text-blue-600 dark:text-cyan-400 border border-transparent hover:border-blue-600 dark:hover:border-cyan-400"
                        data-testid={`view-project-${project.id}`}
                      >
                        View Case Study
                        <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Section - Enhanced */}
        <section className="py-24 bg-gradient-to-br from-blue-600 via-cyan-600 to-blue-700 dark:from-blue-700 dark:via-cyan-700 dark:to-blue-800 relative overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
              backgroundSize: '30px 30px'
            }}></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-block p-3 bg-white/10 rounded-full mb-6">
                <Rocket className="w-12 h-12 text-white" />
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Ready to Create Your Success Story?
              </h2>
              
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join 150+ satisfied clients who've transformed their businesses with our expert digital solutions. 
                Let's discuss how we can help you achieve remarkable results.
              </p>

              {/* Benefits */}
              <div className="flex flex-wrap justify-center gap-6 mb-10">
                <div className="flex items-center gap-2 text-white">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Free Consultation</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Custom Proposal</span>
                </div>
                <div className="flex items-center gap-2 text-white">
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Proven Process</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/contact">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all" data-testid="cta-start-project">
                    Start Your Project
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/services">
                  <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10" data-testid="cta-explore-services">
                    Explore Our Services
                  </Button>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="mt-12 pt-8 border-t border-white/20">
                <p className="text-blue-100 text-sm mb-4">Trusted by industry leaders worldwide</p>
                <div className="flex justify-center items-center gap-8 flex-wrap opacity-80">
                  <div className="text-white font-semibold">200+ Projects</div>
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  <div className="text-white font-semibold">98% Success Rate</div>
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                  <div className="text-white font-semibold">Award-Winning</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default PortfolioPage;