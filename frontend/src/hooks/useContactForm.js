import { useState } from 'react';
import { contactAPI } from '../services/api';
import { toast } from 'sonner';

export const useContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const submitContactForm = async (data) => {
    setIsSubmitting(true);
    setIsSuccess(false);

    try {
      const response = await contactAPI.submit(data);
      
      if (response.success) {
        setIsSuccess(true);
        toast.success(response.message || 'Thank you for contacting us!');
        return { success: true, data: response.data };
      } else {
        toast.error(response.message || 'Something went wrong. Please try again.');
        return { success: false, error: response.message };
      }
    } catch (error) {
      const errorMessage = error.response?.data?.detail || 
                          error.response?.data?.message || 
                          'Failed to submit form. Please try again.';
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIsSuccess(false);
  };

  return {
    isSubmitting,
    isSuccess,
    submitContactForm,
    resetForm,
  };
};