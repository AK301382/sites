/**
 * Authentication Store using Zustand
 * Manages user authentication state with persistence
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/**
 * Auth store with persistent storage
 * State is automatically saved to localStorage
 */
export const useAuthStore = create(
  persist(
    (set) => ({
      // State
      user: null,
      token: null,
      isAuthenticated: false,

      // Actions
      /**
       * Login action - stores user and token
       * @param {Object} user - User object
       * @param {string} token - JWT token
       */
      login: (user, token) => set({ 
        user, 
        token, 
        isAuthenticated: true 
      }),

      /**
       * Logout action - clears user and token
       */
      logout: () => set({ 
        user: null, 
        token: null, 
        isAuthenticated: false 
      }),

      /**
       * Update user action - updates user information
       * @param {Object} user - Updated user object
       */
      updateUser: (user) => set({ user }),

      /**
       * Check if user is authenticated
       * @returns {boolean} Authentication status
       */
      checkAuth: () => {
        const state = useAuthStore.getState();
        return !!state.token && !!state.user;
      },
    }),
    {
      name: 'kawesh-auth-storage', // localStorage key
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token,
        isAuthenticated: state.isAuthenticated
      }), // Only persist these fields
    }
  )
);
