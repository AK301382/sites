import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Star, Quote } from 'lucide-react';
import { testimonials } from '../../lib/config/mock';

const Testimonials = () => {
  return (
    <section className="py-24 bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-blue-600 dark:text-cyan-400 font-semibold text-sm uppercase tracking-wide">Testimonials</span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mt-4 mb-6">
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Don't just take our word for it. Hear from the companies we've helped transform.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card key={testimonial.id} className="group hover:shadow-2xl transition-all duration-300 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 relative overflow-hidden">
              {/* Quote Icon */}
              <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-16 h-16 text-blue-600 dark:text-cyan-400" />
              </div>

              <CardContent className="pt-6 relative z-10">
                {/* Rating */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>

                {/* Quote */}
                <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                  "{testimonial.quote}"
                </p>

                {/* Author Info */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold text-lg">
                      {testimonial.author.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{testimonial.author}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">{testimonial.company}</p>
                  </div>
                </div>

                {/* Project Type Badge */}
                <div className="mt-4">
                  <span className="inline-block px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-cyan-400 text-xs font-semibold rounded-full">
                    {testimonial.projectType}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
