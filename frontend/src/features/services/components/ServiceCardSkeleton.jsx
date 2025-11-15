import React from 'react';
import { Card, CardHeader, CardContent } from '../../../components/ui/card';

/**
 * ServiceCardSkeleton - Loading skeleton for service cards
 * Provides visual feedback while content is loading
 */
const ServiceCardSkeleton = () => {
  return (
    <Card className="border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
      {/* Image Skeleton */}
      <div className="h-56 bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 animate-pulse" />
      
      <CardHeader className="pb-4 space-y-3">
        {/* Title Skeleton */}
        <div className="h-7 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-3/4" />
        
        {/* Description Skeleton */}
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-full" />
          <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-5/6" />
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Features Skeleton */}
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-4 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-full" />
          ))}
        </div>

        {/* Button Skeleton */}
        <div className="h-12 bg-gray-200 dark:bg-gray-800 rounded animate-pulse w-full" />
      </CardContent>
    </Card>
  );
};

export default ServiceCardSkeleton;
