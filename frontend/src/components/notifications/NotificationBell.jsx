import React from 'react';
import { Bell } from 'lucide-react';
import { cn } from '../../lib/utils';

const NotificationBell = ({ unreadCount, onClick, className }) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative p-2 rounded-full hover:bg-gray-100 transition-colors",
        className
      )}
      aria-label="Notifications"
    >
      <Bell className="h-6 w-6 text-gray-700" />
      
      {unreadCount > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[20px] h-5 px-1 text-xs font-bold text-white bg-red-500 rounded-full animate-pulse">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  );
};

export default NotificationBell;
