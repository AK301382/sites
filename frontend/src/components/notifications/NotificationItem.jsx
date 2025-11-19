import React from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircle, Bell, AlertCircle, X, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { de, enUS, fr } from 'date-fns/locale';

const getNotificationIcon = (type) => {
  switch (type) {
    case 'appointment_confirmed':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'appointment_reminder':
      return <Bell className="h-5 w-5 text-orange-500" />;
    case 'appointment_cancelled':
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    default:
      return <Bell className="h-5 w-5 text-blue-500" />;
  }
};

const getLocale = (language) => {
  switch (language) {
    case 'de':
      return de;
    case 'fr':
      return fr;
    case 'en':
      return enUS;
    default:
      return de;
  }
};

const NotificationItem = ({ notification, onMarkRead, onDelete, compact = false }) => {
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'de';

  // Get notification text in current language
  const title = notification[`title_${currentLang}`] || notification.title_de || notification.title_en;
  const message = notification[`message_${currentLang}`] || notification.message_de || notification.message_en;

  // Format time
  const timeAgo = React.useMemo(() => {
    try {
      return formatDistanceToNow(new Date(notification.created_at), {
        addSuffix: true,
        locale: getLocale(currentLang)
      });
    } catch (error) {
      return '';
    }
  }, [notification.created_at, currentLang]);

  const handleClick = () => {
    if (!notification.is_read && onMarkRead) {
      onMarkRead(notification.id);
    }
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) {
      onDelete(notification.id);
    }
  };

  if (compact) {
    return (
      <div
        onClick={handleClick}
        className={`
          flex items-start gap-3 p-3 rounded-lg cursor-pointer transition-colors
          ${notification.is_read ? 'bg-white hover:bg-gray-50' : 'bg-blue-50 hover:bg-blue-100'}
        `}
      >
        <div className="flex-shrink-0 mt-0.5">
          {getNotificationIcon(notification.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {title}
          </p>
          <p className="text-xs text-gray-600 line-clamp-2 mt-0.5">
            {message}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {timeAgo}
          </p>
        </div>

        <button
          onClick={handleDelete}
          className="flex-shrink-0 p-1 text-gray-400 hover:text-red-500 transition-colors"
          aria-label="Delete notification"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`
        flex items-start gap-4 p-4 rounded-lg border transition-all
        ${notification.is_read 
          ? 'bg-white border-gray-200' 
          : 'bg-blue-50 border-blue-200 shadow-sm'
        }
      `}
    >
      <div className="flex-shrink-0 mt-1">
        {getNotificationIcon(notification.type)}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-semibold text-gray-900">
            {title}
          </h4>
          
          {!notification.is_read && (
            <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-1.5" />
          )}
        </div>

        <p className="text-sm text-gray-700 mt-1">
          {message}
        </p>

        <div className="flex items-center gap-4 mt-3">
          <span className="text-xs text-gray-500">
            {timeAgo}
          </span>

          {!notification.is_read && onMarkRead && (
            <button
              onClick={() => onMarkRead(notification.id)}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              Als gelesen markieren
            </button>
          )}

          {onDelete && (
            <button
              onClick={handleDelete}
              className="text-xs text-gray-500 hover:text-red-600 font-medium"
            >
              Löschen
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationItem;
