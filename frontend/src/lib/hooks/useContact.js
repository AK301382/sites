/**
 * React Query hooks for Contact API
 */
import { useQuery, useMutation } from '@tanstack/react-query';
import { contactAPI } from '../services/api';
import { toast } from 'sonner';

/**
 * Submit contact form
 */
export const useContactSubmit = () => {
  return useMutation({
    mutationFn: contactAPI.submit,
    onSuccess: (data) => {
      toast.success(data.message || 'Message sent successfully!');
    },
    onError: (error) => {
      toast.error(error.userMessage || 'Failed to send message. Please try again.');
    },
  });
};

/**
 * Fetch contact submissions (admin)
 */
export const useContactSubmissions = (filters = {}) => {
  return useQuery({
    queryKey: ['contact-submissions', filters],
    queryFn: () => contactAPI.getSubmissions(
      filters.status,
      filters.limit || 50,
      filters.skip || 0
    ),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
