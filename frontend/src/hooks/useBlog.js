/**
 * React Query hooks for Blog API
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogAPI } from '../services/api';
import { toast } from 'sonner';

// Query keys
export const blogKeys = {
  all: ['blog'],
  lists: () => [...blogKeys.all, 'list'],
  list: (filters) => [...blogKeys.lists(), filters],
  details: () => [...blogKeys.all, 'detail'],
  detail: (slug) => [...blogKeys.details(), slug],
};

/**
 * Fetch all blog posts
 */
export const useBlog = (filters = {}) => {
  return useQuery({
    queryKey: blogKeys.list(filters),
    queryFn: () => blogAPI.getAll(
      filters.category,
      filters.featured,
      filters.status || 'published',
      filters.limit || 50,
      filters.skip || 0
    ),
    staleTime: 5 * 60 * 1000,
  });
};

/**
 * Fetch single blog post by slug
 */
export const useBlogPost = (slug) => {
  return useQuery({
    queryKey: blogKeys.detail(slug),
    queryFn: () => blogAPI.getBySlug(slug),
    enabled: !!slug,
    staleTime: 10 * 60 * 1000,
  });
};

/**
 * Create new blog post
 */
export const useCreateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blogAPI.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
      toast.success('Blog post created successfully!');
    },
    onError: (error) => {
      toast.error(error.userMessage || 'Failed to create blog post');
    },
  });
};

/**
 * Update blog post
 */
export const useUpdateBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => blogAPI.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: blogKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
      toast.success('Blog post updated successfully!');
    },
    onError: (error) => {
      toast.error(error.userMessage || 'Failed to update blog post');
    },
  });
};

/**
 * Delete blog post
 */
export const useDeleteBlog = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: blogAPI.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogKeys.lists() });
      toast.success('Blog post deleted successfully!');
    },
    onError: (error) => {
      toast.error(error.userMessage || 'Failed to delete blog post');
    },
  });
};
