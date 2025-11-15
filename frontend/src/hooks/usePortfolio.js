/**
 * React Query hooks for Portfolio API
 * Provides caching, automatic refetching, and optimistic updates
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { portfolioAPI } from '../services/api';
import { toast } from 'sonner';

// Query keys
export const portfolioKeys = {
  all: ['portfolio'],
  lists: () => [...portfolioKeys.all, 'list'],
  list: (filters) => [...portfolioKeys.lists(), filters],
  details: () => [...portfolioKeys.all, 'detail'],
  detail: (slug) => [...portfolioKeys.details(), slug],
};

/**
 * Fetch all portfolio items
 */
export const usePortfolio = (filters = {}) => {
  return useQuery({
    queryKey: portfolioKeys.list(filters),
    queryFn: () => portfolioAPI.getAll(
      filters.category,
      filters.featured,
      filters.status || 'published',
      filters.limit || 50,
      filters.skip || 0
    ),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Fetch single portfolio item by slug
 */
export const usePortfolioItem = (slug) => {
  return useQuery({
    queryKey: portfolioKeys.detail(slug),
    queryFn: () => portfolioAPI.getBySlug(slug),
    enabled: !!slug, // Only run query if slug exists
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
};

/**
 * Create new portfolio item (mutation)
 */
export const useCreatePortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: portfolioAPI.create,
    onSuccess: () => {
      // Invalidate and refetch portfolio list
      queryClient.invalidateQueries({ queryKey: portfolioKeys.lists() });
      toast.success('Portfolio item created successfully!');
    },
    onError: (error) => {
      toast.error(error.userMessage || 'Failed to create portfolio item');
    },
  });
};

/**
 * Update portfolio item (mutation)
 */
export const useUpdatePortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => portfolioAPI.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidate specific item and list
      queryClient.invalidateQueries({ queryKey: portfolioKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: portfolioKeys.lists() });
      toast.success('Portfolio item updated successfully!');
    },
    onError: (error) => {
      toast.error(error.userMessage || 'Failed to update portfolio item');
    },
  });
};

/**
 * Delete portfolio item (mutation)
 */
export const useDeletePortfolio = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: portfolioAPI.delete,
    onSuccess: () => {
      // Invalidate portfolio list
      queryClient.invalidateQueries({ queryKey: portfolioKeys.lists() });
      toast.success('Portfolio item deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.userMessage || 'Failed to delete portfolio item');
    },
  });
};
