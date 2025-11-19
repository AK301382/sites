import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  LayoutDashboard, 
  Calendar, 
  Scissors, 
  Image, 
  Users, 
  MessageSquare,
  Settings,
  LogOut,
  UsersRound,
  X
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AdminSidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { logout } = useAuth();
  const { t } = useTranslation(['admin', 'common']);

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: t('sidebar.dashboard') },
    { path: '/admin/appointments', icon: Calendar, label: t('sidebar.appointments') },
    { path: '/admin/users', icon: UsersRound, label: t('sidebar.users') },
    { path: '/admin/services', icon: Scissors, label: t('sidebar.services') },
    { path: '/admin/gallery', icon: Image, label: t('sidebar.gallery') },
    { path: '/admin/artists', icon: Users, label: t('sidebar.artists') },
    { path: '/admin/messages', icon: MessageSquare, label: t('sidebar.messages') },
    { path: '/admin/settings', icon: Settings, label: t('sidebar.settings') },
  ];

  const isActive = (path) => location.pathname === path;

  const handleLinkClick = () => {
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  return (
    <>
      {/* Sidebar */}
      <div className={`
        w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col
        fixed left-0 top-0 z-50 overflow-y-auto
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold" style={{ color: '#8B6F8E' }}>
                {t('sidebar.adminPanel')}
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                {t('sidebar.adminSubtitle')}
              </p>
            </div>
            {/* Close button for mobile */}
            <button
              onClick={onClose}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Close menu"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 sm:p-4 space-y-1 sm:space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={handleLinkClick}
                className={`flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg transition-colors ${
                  isActive(item.path)
                    ? 'bg-[#F4C2C2] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
                <span className="font-medium text-sm sm:text-base">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout button */}
        <div className="p-3 sm:p-4 border-t border-gray-200">
          <button
            onClick={() => {
              logout();
              handleLinkClick();
            }}
            className="flex items-center space-x-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-red-600 hover:bg-red-50 w-full transition-colors"
          >
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
            <span className="font-medium text-sm sm:text-base">{t('sidebar.logout')}</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default AdminSidebar;