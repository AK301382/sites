import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import AdminLayout from '@/components/admin/AdminLayout';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Trash2, Filter } from 'lucide-react';

const API_URL = import.meta.env.VITE_BACKEND_URL || '';

const AdminAppointments = () => {
  const { t, i18n } = useTranslation(['admin', 'common']);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Helper function to get localized service name
  const getLocalizedServiceName = (appt) => {
    let lang = i18n.language;
    // Map Swiss German to standard German
    if (lang === 'de-CH') lang = 'de';
    
    const serviceName = appt[`service_name_${lang}`] || appt.service_name_en || 'N/A';
    return serviceName;
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [appointments, searchTerm, statusFilter]);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/appointments`);
      setAppointments(response.data);
      setFilteredAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast.error(t('appointments.loadError'));
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = appointments;

    if (searchTerm) {
      filtered = filtered.filter(appt => 
        appt.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appt.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        appt.customer_phone.includes(searchTerm)
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(appt => appt.status === statusFilter);
    }

    setFilteredAppointments(filtered);
  };

  const handleStatusChange = async (appointmentId, newStatus) => {
    try {
      await axios.patch(`${API_URL}/api/appointments/${appointmentId}/status?status=${newStatus}`);
      toast.success(t('appointments.updateSuccess'));
      fetchAppointments();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error(t('appointments.updateError'));
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/api/appointments/${deleteId}`);
      toast.success(t('appointments.deleteSuccess'));
      setDeleteId(null);
      fetchAppointments();
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast.error(t('appointments.deleteError'));
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
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: '#8B6F8E' }}>{t('appointments.title')}</h1>
          <p className="text-gray-600 mt-2">{t('appointments.subtitle')}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder={t('appointments.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder={t('appointments.filterByStatus')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('appointments.allStatus')}</SelectItem>
                <SelectItem value="pending">{t('appointments.pending')}</SelectItem>
                <SelectItem value="confirmed">{t('appointments.confirmed')}</SelectItem>
                <SelectItem value="completed">{t('appointments.completed')}</SelectItem>
                <SelectItem value="cancelled">{t('appointments.cancelled')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('appointments.customer')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('appointments.service')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('appointments.artist')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('appointments.contact')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('appointments.dateTime')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('appointments.status')}</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('appointments.actions')}</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAppointments.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      {t('appointments.noAppointments')}
                    </td>
                  </tr>
                ) : (
                  filteredAppointments.map((appt) => (
                    <tr key={appt.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">{appt.customer_name}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{getLocalizedServiceName(appt)}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{appt.artist_name || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{appt.customer_email}</div>
                        <div className="text-sm text-gray-500">{appt.customer_phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{appt.appointment_date}</div>
                        <div className="text-sm text-gray-500">{appt.appointment_time}</div>
                      </td>
                      <td className="px-6 py-4">
                        <Select
                          value={appt.status}
                          onValueChange={(value) => handleStatusChange(appt.id, value)}
                        >
                          <SelectTrigger className="w-32">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">{t('appointments.pending')}</SelectItem>
                            <SelectItem value="confirmed">{t('appointments.confirmed')}</SelectItem>
                            <SelectItem value="completed">{t('appointments.completed')}</SelectItem>
                            <SelectItem value="cancelled">{t('appointments.cancelled')}</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-6 py-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteId(appt.id)}
                          className="text-red-600 hover:text-red-800 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={t('appointments.deleteTitle')}
        description={t('appointments.deleteConfirm')}
      />
    </AdminLayout>
  );
};

export default AdminAppointments;
