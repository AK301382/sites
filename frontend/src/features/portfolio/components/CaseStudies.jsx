import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '../../../components/ui/card';
import { Badge } from '../../../components/ui/badge';
import { Button } from '../../../components/ui/button';
import { ArrowRight, TrendingUp, Users, Zap } from 'lucide-react';
import { caseStudies } from '../../../lib/config/mock';

const CaseStudies = () => {
  return (
    <section id="case-studies" className="py-24 bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 animate-fade-in">
          <span className="text-blue-600 dark:text-cyan-400 font-semibold text-sm uppercase tracking-wide">Case Studies</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-4 mb-6">
            Success Stories
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Real projects, real results. See how we've helped companies transform their digital presence.
          </p>
        </div>

        {/* Case Studies Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {caseStudies.map((study, index) => (
            <Card 
              key={study.id} 
              className="group hover:shadow-2xl transition-all duration-500 overflow-hidden border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:scale-[1.02] animate-fade-in-up"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Project Image */}
              <div className="relative h-56 overflow-hidden bg-gray-900">
                <img 
                  src={study.image} 
                  alt={study.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent group-hover:via-gray-900/30 transition-colors duration-500"></div>
                <Badge className="absolute top-4 left-4 bg-white/95 text-gray-900 backdrop-blur-sm group-hover:scale-110 transition-transform duration-300">
                  {study.industry}
                </Badge>
              </div>

              <CardHeader>
                <CardTitle className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors duration-300">
                  {study.title}
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  {study.client}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Project Details */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="transform group-hover:translate-x-1 transition-transform duration-300">
                    <p className="text-gray-500 dark:text-gray-400">Duration</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{study.duration}</p>
                  </div>
                  <div className="transform group-hover:translate-x-1 transition-transform duration-300" style={{ transitionDelay: '50ms' }}>
                    <p className="text-gray-500 dark:text-gray-400">Team Size</p>
                    <p className="font-semibold text-gray-900 dark:text-white">{study.teamSize} developers</p>
                  </div>
                </div>

                {/* Challenge */}
                <div className="transform group-hover:translate-x-1 transition-transform duration-300" style={{ transitionDelay: '100ms' }}>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Challenge</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{study.challenge}</p>
                </div>

                {/* Results */}
                <div className="space-y-2 transform group-hover:translate-x-1 transition-transform duration-300" style={{ transitionDelay: '150ms' }}>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Key Results</p>
                  <div className="grid grid-cols-2 gap-2">
                    {study.results.performance && (
                      <div className="flex items-center gap-2 text-sm group-hover:scale-105 transition-transform duration-300">
                        <TrendingUp className="w-4 h-4 text-green-500 group-hover:rotate-12 transition-transform duration-300" />
                        <span className="text-gray-700 dark:text-gray-300">{study.results.performance}% faster</span>
                      </div>
                    )}
                    {study.results.users && (
                      <div className="flex items-center gap-2 text-sm group-hover:scale-105 transition-transform duration-300">
                        <Users className="w-4 h-4 text-blue-500 group-hover:scale-125 transition-transform duration-300" />
                        <span className="text-gray-700 dark:text-gray-300">{study.results.users} users</span>
                      </div>
                    )}
                    {study.results.cost && (
                      <div className="flex items-center gap-2 text-sm group-hover:scale-105 transition-transform duration-300">
                        <Zap className="w-4 h-4 text-yellow-500 group-hover:rotate-12 transition-transform duration-300" />
                        <span className="text-gray-700 dark:text-gray-300">{study.results.cost}% cost saved</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2">
                  {study.technologies.slice(0, 4).map((tech, idx) => (
                    <Badge 
                      key={idx} 
                      variant="outline" 
                      className="text-xs group-hover:border-blue-600 dark:group-hover:border-cyan-400 group-hover:scale-105 transition-all duration-300"
                      style={{ transitionDelay: `${idx * 50}ms` }}
                    >
                      {tech}
                    </Badge>
                  ))}
                </div>

                {/* CTA */}
                <Button variant="ghost" className="w-full group/btn hover:bg-blue-50 dark:hover:bg-blue-950/20 text-blue-600 dark:text-cyan-400">
                  <span>Read Full Case Study</span>
                  <ArrowRight className="ml-2 w-4 h-4 group-hover/btn:translate-x-2 transition-transform duration-300" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/20">
            View All Case Studies
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CaseStudies;
