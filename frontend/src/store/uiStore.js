/**
 * UI Store using Zustand
 * Manages UI state like modals, notifications, loading states
 */
import { create } from 'zustand';

/**
 * UI store for managing application UI state
 */
export const useUIStore = create((set) => ({
  // State
  isLoading: false,
  notifications: [],
  modalOpen: false,
  sidebarOpen: false,

  // Actions
  /**
   * Set loading state
   * @param {boolean} loading - Loading state
   */
  setLoading: (loading) => set({ isLoading: loading }),

  /**
   * Add notification
   * @param {Object} notification - Notification object
   * @param {string} notification.type - Type of notification (success, error, info, warning)
   * @param {string} notification.message - Notification message
   */
  addNotification: (notification) => 
    set((state) => ({
      notifications: [
        ...state.notifications,
        { ...notification, id: Date.now() }
      ]
    })),

  /**
   * Remove notification by id
   * @param {number} id - Notification id
   */
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id)
    })),

  /**
   * Clear all notifications
   */
  clearNotifications: () => set({ notifications: [] }),

  /**
   * Toggle modal
   */
  toggleModal: () => set((state) => ({ modalOpen: !state.modalOpen })),

  /**
   * Toggle sidebar
   */
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

  /**
   * Set modal open state
   * @param {boolean} open - Modal open state
   */
  setModalOpen: (open) => set({ modalOpen: open }),

  /**
   * Set sidebar open state
   * @param {boolean} open - Sidebar open state
   */
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
}));
