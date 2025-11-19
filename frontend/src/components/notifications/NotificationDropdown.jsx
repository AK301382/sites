import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { X } from 'lucide-react';
import { useNotifications } from '../../contexts/NotificationContext';
import NotificationItem from './NotificationItem';

const NotificationDropdown = ({ isOpen, onClose, anchorRef }) => {
  const { t } = useTranslation();
  const { notifications, unreadCount, markAsRead, markAllAsRead, deleteNotification } = useNotifications();
  const dropdownRef = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, anchorRef]);

  if (!isOpen) return null;

  const recentNotifications = notifications.slice(0, 5);

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-96 max-w-[calc(100vw-2rem)] bg-white rounded-lg shadow-2xl border border-gray-200 z-50 overflow-hidden"
      style={{
        maxHeight: '80vh',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200 bg-gray-50">
        <h3 className="font-semibold text-gray-900">
          {t('common.notifications', 'Benachrichtigungen')}
        </h3>
        
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Alle als gelesen
            </button>
          )}
          
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 rounded"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="max-h-96 overflow-y-auto">
        {recentNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-3">
              <span className="text-2xl">🔔</span>
            </div>
            <p className="text-gray-600 font-medium">
              Keine Benachrichtigungen
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Wenn etwas Neues passiert, sehen Sie es hier
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentNotifications.map((notification) => (
              <div key={notification.id} className="px-2 py-1">
                <NotificationItem
                  notification={notification}
                  onMarkRead={markAsRead}
                  onDelete={deleteNotification}
                  compact
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      {notifications.length > 5 && (
        <div className="border-t border-gray-200 p-3 text-center bg-gray-50">
          <a
            href="/user/notifications"
            onClick={onClose}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Alle {notifications.length} Benachrichtigungen ansehen
          </a>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
