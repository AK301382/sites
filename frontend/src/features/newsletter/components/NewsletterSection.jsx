import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { useNewsletter } from '../../../lib/hooks/useNewsletter';

const NewsletterSection = () => {
  const [email, setEmail] = useState('');
  const { isSubmitting, isSuccess, subscribe, resetNewsletter } = useNewsletter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await subscribe(email);
    
    if (result.success) {
      setEmail('');
      // Reset success state after 5 seconds
      setTimeout(() => {
        resetNewsletter();
      }, 5000);
    }
  };

  return (
    <div className="border-t border-gray-800 pt-8 mb-8">
      <div className="max-w-2xl">
        <h3 className="text-white font-semibold mb-2">Subscribe to Our Newsletter</h3>
        <p className="text-gray-400 text-sm mb-4">
          Get monthly tech insights, project updates, and industry trends.
        </p>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={isSubmitting || isSuccess}
            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            type="submit"
            disabled={isSubmitting || isSuccess}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Subscribing...
              </>
            ) : isSuccess ? (
              'Subscribed!'
            ) : (
              'Subscribe'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default NewsletterSection;
