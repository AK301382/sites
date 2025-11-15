import React from 'react';
import { Star } from 'lucide-react';
import { Card } from '../../../components/ui/card';

const ServiceRating = ({ rating }) => {
  if (!rating) {
    return null;
  }

  const { average, total, breakdown } = rating;

  // Calculate percentage for each star rating
  const getPercentage = (count) => {
    return ((count / total) * 100).toFixed(0);
  };

  return (
    <section className="py-16 bg-white dark:bg-gray-950" data-testid="service-rating-section">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="max-w-4xl mx-auto p-8 border-gray-200 dark:border-gray-800 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Side - Overall Rating */}
            <div className="flex flex-col items-center justify-center border-r border-gray-300 dark:border-gray-700">
              <div className="text-center">
                <div className="text-6xl font-bold text-gray-900 dark:text-white mb-2" data-testid="average-rating">
                  {average.toFixed(1)}
                </div>
                <div className="flex justify-center gap-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      className={`w-6 h-6 ${i < Math.floor(average) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                    />
                  ))}
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-lg" data-testid="total-reviews">
                  Based on <span className="font-semibold">{total}</span> reviews
                </p>
              </div>
            </div>

            {/* Right Side - Rating Breakdown */}
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Rating Breakdown</h3>
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-3" data-testid={`rating-breakdown-${stars}`}>
                  <div className="flex items-center gap-1 w-16">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{stars}</span>
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  </div>
                  <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 overflow-hidden">
                    <div 
                      className="bg-blue-600 dark:bg-cyan-500 h-full rounded-full transition-all duration-500"
                      style={{ width: `${getPercentage(breakdown[stars])}%` }}
                    ></div>
                  </div>
                  <span className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
                    {breakdown[stars]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default ServiceRating;
