import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useUserAuth } from './UserAuthContext';

const NotificationContext = createContext();

const API_URL = import.meta.env.VITE_BACKEND_URL || '';
const POLLING_INTERVAL = 30000; // 30 seconds

// Notification sound (lightweight beep)
const playNotificationSound = () => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.frequency.value = 800;
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
    
    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (error) {
    console.error('Error playing notification sound:', error);
  }
};

export const NotificationProvider = ({ children }) => {
  const { isAuthenticated, user } = useUserAuth();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const pollingIntervalRef = useRef(null);
  const previousUnreadCountRef = useRef(0);

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!isAuthenticated) {
      setNotifications([]);
      setUnreadCount(0);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/api/user/notifications`, {
        withCredentials: true,
        params: { limit: 50 }
      });

      if (response.data && response.data.notifications) {
        setNotifications(response.data.notifications);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  }, [isAuthenticated]);

  // Fetch unread count
  const fetchUnreadCount = useCallback(async () => {
    if (!isAuthenticated) {
      setUnreadCount(0);
      return;
    }

    try {
      const response = await axios.get(`${API_URL}/api/user/notifications/unread-count`, {
        withCredentials: true
      });

      if (response.data && typeof response.data.unread_count === 'number') {
        const newCount = response.data.unread_count;
        
        // Play sound if new notification arrived
        if (newCount > previousUnreadCountRef.current && previousUnreadCountRef.current > 0) {
          playNotificationSound();
        }
        
        previousUnreadCountRef.current = newCount;
        setUnreadCount(newCount);
      }
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  }, [isAuthenticated]);

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId) => {
    try {
      await axios.patch(
        `${API_URL}/api/user/notifications/${notificationId}/read`,
        {},
        { withCredentials: true }
      );

      // Update local state
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, is_read: true } : notif
        )
      );

      // Update unread count
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }, []);

  // Mark all as read
  const markAllAsRead = useCallback(async () => {
    try {
      await axios.patch(
        `${API_URL}/api/user/notifications/read-all`,
        {},
        { withCredentials: true }
      );

      // Update local state
      setNotifications(prev =>
        prev.map(notif => ({ ...notif, is_read: true }))
      );

      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  }, []);

  // Delete notification
  const deleteNotification = useCallback(async (notificationId) => {
    try {
      await axios.delete(
        `${API_URL}/api/user/notifications/${notificationId}`,
        { withCredentials: true }
      );

      // Update local state
      setNotifications(prev => prev.filter(notif => notif.id !== notificationId));

      // Update unread count if it was unread
      const deletedNotif = notifications.find(n => n.id === notificationId);
      if (deletedNotif && !deletedNotif.is_read) {
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  }, [notifications]);

  // Initial load
  useEffect(() => {
    if (isAuthenticated) {
      setLoading(true);
      Promise.all([fetchNotifications(), fetchUnreadCount()]).finally(() => {
        setLoading(false);
      });
    }
  }, [isAuthenticated, fetchNotifications, fetchUnreadCount]);

  // Setup polling for unread count
  useEffect(() => {
    if (isAuthenticated) {
      // Start polling
      pollingIntervalRef.current = setInterval(() => {
        fetchUnreadCount();
      }, POLLING_INTERVAL);

      return () => {
        if (pollingIntervalRef.current) {
          clearInterval(pollingIntervalRef.current);
        }
      };
    }
  }, [isAuthenticated, fetchUnreadCount]);

  const value = {
    notifications,
    unreadCount,
    loading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    refreshNotifications: fetchNotifications
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
};
