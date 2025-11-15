/**
 * Application Providers Setup
 * Wraps the app with necessary providers: React Query, Helmet, and Theme
 */
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider } from '../contexts/ThemeContext';

// Configure React Query client with optimized defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - data is considered fresh
      cacheTime: 10 * 60 * 1000, // 10 minutes - cache kept in memory
      retry: 1, // Retry failed requests once
      refetchOnWindowFocus: false, // Don't refetch on window focus
      refetchOnReconnect: true, // Refetch on network reconnect
    },
    mutations: {
      retry: 0, // Don't retry mutations
    },
  },
});

/**
 * Providers component that wraps the entire application
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const Providers = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    <HelmetProvider>
      <ThemeProvider>
        {children}
      </ThemeProvider>
    </HelmetProvider>
  </QueryClientProvider>
);
