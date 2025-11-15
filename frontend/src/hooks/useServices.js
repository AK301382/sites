/**
 * React Query hooks for Services API
 */
import { useQuery, useMutation } from '@tanstack/react-query';
import { servicesAPI } from '../services/api';
import { toast } from 'sonner';

/**
 * Submit service inquiry
 */
export const useServiceInquiry = () => {
  return useMutation({
    mutationFn: servicesAPI.submitInquiry,
    onSuccess: (data) => {
      toast.success(data.message || 'Inquiry submitted successfully!');
    },
    onError: (error) => {
      toast.error(error.userMessage || 'Failed to submit inquiry. Please try again.');
    },
  });
};

/**
 * Book consultation
 */
export const useBookConsultation = () => {
  return useMutation({
    mutationFn: servicesAPI.bookConsultation,
    onSuccess: (data) => {
      toast.success(data.message || 'Consultation booked successfully!');
    },
    onError: (error) => {
      toast.error(error.userMessage || 'Failed to book consultation. Please try again.');
    },
  });
};

/**
 * Fetch service inquiries (admin)
 */
export const useServiceInquiries = (filters = {}) => {
  return useQuery({
    queryKey: ['service-inquiries', filters],
    queryFn: () => servicesAPI.getInquiries(
      filters.status,
      filters.service_type,
      filters.limit || 50,
      filters.skip || 0
    ),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

/**
 * Fetch consultation bookings (admin)
 */
export const useConsultationBookings = (filters = {}) => {
  return useQuery({
    queryKey: ['consultation-bookings', filters],
    queryFn: () => servicesAPI.getConsultations(
      filters.status,
      filters.limit || 50,
      filters.skip || 0
    ),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};
