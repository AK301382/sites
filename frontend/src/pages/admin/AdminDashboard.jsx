import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import AdminLayout from '@/components/admin/AdminLayout';
import StatCard from '@/components/admin/StatCard';
import { Calendar, Scissors, Image, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_BACKEND_URL || '';

const AdminDashboard = () => {
  const { t } = useTranslation(['admin', 'common']);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [recentAppointments, setRecentAppointments] = useState([]);

  useEffect(() => {
    fetchStats();
    fetchRecentAppointments();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/admin/stats`);
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      toast.error('Failed to load stats');
    } finally {
      setLoading(false);
    }
  };

  const fetchRecentAppointments = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/appointments`);
      setRecentAppointments(response.data.slice(0, 5));
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F4C2C2]"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6 sm:space-y-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#8B6F8E' }}>{t('dashboard.title')}</h1>
          <p className="text-gray-600 mt-2">{t('dashboard.welcome')}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <StatCard
            title={t('dashboard.totalAppointments')}
            value={stats?.total_appointments || 0}
            icon={Calendar}
            color="#F4C2C2"
          />
          <StatCard
            title={t('dashboard.pendingAppointments')}
            value={stats?.pending_appointments || 0}
            icon={Clock}
            color="#D4AF76"
          />
          <StatCard
            title={t('dashboard.confirmedAppointments')}
            value={stats?.confirmed_appointments || 0}
            icon={CheckCircle}
            color="#8B6F8E"
          />
          <StatCard
            title={t('dashboard.totalServices')}
            value={stats?.total_services || 0}
            icon={Scissors}
            color="#F4C2C2"
          />
          <StatCard
            title={t('dashboard.totalGalleryItems')}
            value={stats?.total_gallery_items || 0}
            icon={Image}
            color="#D4AF76"
          />
          <StatCard
            title={t('dashboard.totalMessages')}
            value={stats?.total_messages || 0}
            icon={MessageSquare}
            color="#8B6F8E"
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold mb-4" style={{ color: '#8B6F8E' }}>{t('dashboard.recentAppointments')}</h2>
          <div className="space-y-3">
            {recentAppointments.length === 0 ? (
              <p className="text-gray-500 text-center py-8">{t('dashboard.noAppointments')}</p>
            ) : (
              recentAppointments.map((appt) => (
                <div key={appt.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-4 bg-gray-50 rounded-lg">
                  <div className="min-w-0 flex-1">
                    <p className="font-medium truncate">{appt.customer_name}</p>
                    <p className="text-sm text-gray-600 truncate">{appt.customer_email}</p>
                  </div>
                  <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2">
                    <p className="text-sm font-medium">{appt.appointment_date}</p>
                    <span 
                      className={`inline-block px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap ${
                        appt.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        appt.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        appt.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}
                    >
                      {appt.status}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
