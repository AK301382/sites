import React from 'react';
import AdminSidebar from './AdminSidebar';
import LanguageSwitcher from './LanguageSwitcher';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 ml-64 overflow-auto">
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-8 py-4 flex justify-end">
          <LanguageSwitcher />
        </div>
        <div className="p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
