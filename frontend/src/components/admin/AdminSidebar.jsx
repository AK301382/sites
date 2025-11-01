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
  LogOut
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const AdminSidebar = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const { t } = useTranslation(['admin', 'common']);

  const menuItems = [
    { path: '/admin/dashboard', icon: LayoutDashboard, label: t('sidebar.dashboard') },
    { path: '/admin/appointments', icon: Calendar, label: t('sidebar.appointments') },
    { path: '/admin/services', icon: Scissors, label: t('sidebar.services') },
    { path: '/admin/gallery', icon: Image, label: t('sidebar.gallery') },
    { path: '/admin/artists', icon: Users, label: t('sidebar.artists') },
    { path: '/admin/messages', icon: MessageSquare, label: t('sidebar.messages') },
    { path: '/admin/settings', icon: Settings, label: t('sidebar.settings') },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 bg-white border-r border-gray-200 min-h-screen flex flex-col fixed left-0 top-0 overflow-y-auto">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold" style={{ color: '#8B6F8E' }}>{t('sidebar.adminPanel')}</h2>
        <p className="text-sm text-gray-500 mt-1">{t('sidebar.adminSubtitle')}</p>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-[#F4C2C2] text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200">
        <button
          onClick={logout}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg text-red-600 hover:bg-red-50 w-full transition-colors"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium">{t('sidebar.logout')}</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;
