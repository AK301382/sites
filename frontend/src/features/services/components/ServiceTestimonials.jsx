import React from 'react';
import { Card, CardContent } from '../../../components/ui/card';
import { Star, Quote } from 'lucide-react';

const ServiceTestimonials = ({ testimonials }) => {
  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-gray-50 dark:bg-gray-900" data-testid="service-testimonials-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
            Client Success Stories
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Hear from clients who have experienced the quality and impact of our services firsthand.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card 
              key={testimonial.id} 
              className="group hover:shadow-2xl transition-all duration-300 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 relative overflow-hidden"
              data-testid={`testimonial-card-${index}`}
            >
              {/* Quote Icon Background */}
              <div className="absolute top-6 right-6 opacity-10 group-hover:opacity-20 transition-opacity">
                <Quote className="w-16 h-16 text-blue-600 dark:text-cyan-400" />
              </div>

              <CardContent className="pt-6 relative z-10">
                {/* Rating Stars */}
                <div className="flex gap-1 mb-4" data-testid={`testimonial-rating-${index}`}>
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
                  <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-blue-500 to-cyan-500">
                    <img 
                      src={testimonial.image} 
                      alt={testimonial.author}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `<span class="flex items-center justify-center w-full h-full text-white font-bold text-lg">${testimonial.author.split(' ').map(n => n[0]).join('')}</span>`;
                      }}
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{testimonial.author}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.role}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500">{testimonial.company}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceTestimonials;
