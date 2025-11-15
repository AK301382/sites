import { useState } from 'react';
import { newsletterAPI } from '../services/api';
import { toast } from 'sonner';

export const useNewsletter = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const subscribe = async (email) => {
    setIsSubmitting(true);
    setIsSuccess(false);

    try {
      const response = await newsletterAPI.subscribe(email);
      
      if (response.success) {
        setIsSuccess(true);
        toast.success(response.message || 'Successfully subscribed!');
        return { success: true };
      } else {
        toast.error(response.message || 'Subscription failed. Please try again.');
        return { success: false };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          'Failed to subscribe. Please try again.';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetNewsletter = () => {
    setIsSuccess(false);
  };

  return {
    isSubmitting,
    isSuccess,
    subscribe,
    resetNewsletter,
  };
};