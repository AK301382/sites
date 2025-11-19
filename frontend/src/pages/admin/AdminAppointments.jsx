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
import { Trash2, Filter, Send, Bell } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const API_URL = import.meta.env.VITE_BACKEND_URL || '';

const AdminAppointments = () => {
  const { t, i18n } = useTranslation(['admin', 'common']);
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  
  // Notification modal state
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [sendingNotification, setSendingNotification] = useState(false);

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

  const handleSendNotification = (appointment) => {
    setSelectedAppointment(appointment);
    setShowNotificationModal(true);
  };

  const handleSendNotificationSubmit = async () => {
    if (!notificationTitle.trim() || !notificationMessage.trim()) {
      toast.error(t('notifications.fillAllFields'));
      return;
    }

    try {
      setSendingNotification(true);
      await axios.post(
        `${API_URL}/api/admin/appointments/${selectedAppointment.id}/send-notification`,
        {
          title: notificationTitle.trim(),
          message: notificationMessage.trim(),
          user_ids: [], // Not used for single appointment notification
        }
      );

      toast.success(t('notifications.sentSuccessfully'));
      setShowNotificationModal(false);
      setNotificationTitle('');
      setNotificationMessage('');
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Error sending notification:', error);
      if (error.response?.status === 400) {
        toast.error(t('notifications.noUserLinked'));
      } else {
        toast.error(t('notifications.errorSending'));
      }
    } finally {
      setSendingNotification(false);
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
      <div className="space-y-4 sm:space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#8B6F8E' }}>{t('appointments.title')}</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">{t('appointments.subtitle')}</p>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4">
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            <div className="flex-1">
              <Input
                placeholder={t('appointments.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-48">
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

        {/* Desktop Table View */}
        <div className="hidden lg:block bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
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
                        <div className="flex items-center gap-2">
                          <div className="font-medium text-gray-900">{appt.customer_name}</div>
                          {appt.user_id && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleSendNotification(appt)}
                              className="text-[#8B6F8E] hover:text-[#8B6F8E] hover:bg-[#F8E6E9] p-1 h-auto"
                              title={t('appointments.sendNotification')}
                              data-testid={`send-notification-${appt.id}`}
                            >
                              <Bell className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
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
        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {filteredAppointments.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center text-gray-500">
              {t('appointments.noAppointments')}
            </div>
          ) : (
            filteredAppointments.map((appt) => (
              <div key={appt.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 truncate">{appt.customer_name}</h3>
                      {appt.user_id && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSendNotification(appt)}
                          className="text-[#8B6F8E] hover:text-[#8B6F8E] hover:bg-[#F8E6E9] p-1 h-auto flex-shrink-0"
                          title={t('appointments.sendNotification')}
                          data-testid={`send-notification-${appt.id}`}
                        >
                          <Bell className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 truncate">{appt.customer_email}</p>
                    <p className="text-sm text-gray-600">{appt.customer_phone}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500 font-medium">{t('appointments.service')}</p>
                    <p className="text-gray-900">{getLocalizedServiceName(appt)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">{t('appointments.artist')}</p>
                    <p className="text-gray-900">{appt.artist_name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">{t('appointments.dateTime')}</p>
                    <p className="text-gray-900">{appt.appointment_date}</p>
                    <p className="text-gray-600">{appt.appointment_time}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium mb-1">{t('appointments.status')}</p>
                    <Select
                      value={appt.status}
                      onValueChange={(value) => handleStatusChange(appt.id, value)}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">{t('appointments.pending')}</SelectItem>
                        <SelectItem value="confirmed">{t('appointments.confirmed')}</SelectItem>
                        <SelectItem value="completed">{t('appointments.completed')}</SelectItem>
                        <SelectItem value="cancelled">{t('appointments.cancelled')}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200 flex justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setDeleteId(appt.id)}
                    className="text-red-600 hover:text-red-800 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {t('common:delete')}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={t('appointments.deleteTitle')}
        description={t('appointments.deleteConfirm')}
      />

      {/* Send Notification Modal */}
      <Dialog open={showNotificationModal} onOpenChange={setShowNotificationModal}>
        <DialogContent className="sm:max-w-[500px]" data-testid="appointment-notification-modal">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="w-5 h-5" style={{ color: '#8B6F8E' }} />
              {t('notifications.sendNotification')}
            </DialogTitle>
            <DialogDescription>
              {selectedAppointment &&
                t('notifications.sendToCustomer', {
                  name: selectedAppointment.customer_name,
                })}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="notification-title">{t('notifications.title')}</Label>
              <Input
                id="notification-title"
                placeholder={t('notifications.titlePlaceholder')}
                value={notificationTitle}
                onChange={(e) => setNotificationTitle(e.target.value)}
                maxLength={100}
                data-testid="appointment-notification-title"
              />
              <p className="text-xs text-gray-500">{t('notifications.noTranslation')}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notification-message">{t('notifications.message')}</Label>
              <Textarea
                id="notification-message"
                placeholder={t('notifications.messagePlaceholder')}
                value={notificationMessage}
                onChange={(e) => setNotificationMessage(e.target.value)}
                rows={4}
                maxLength={500}
                data-testid="appointment-notification-message"
              />
              <p className="text-xs text-gray-500">
                {notificationMessage.length}/500 {t('notifications.characters')}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowNotificationModal(false);
                setNotificationTitle('');
                setNotificationMessage('');
                setSelectedAppointment(null);
              }}
              disabled={sendingNotification}
              data-testid="cancel-appointment-notification"
            >
              {t('common:cancel')}
            </Button>
            <Button
              onClick={handleSendNotificationSubmit}
              disabled={
                sendingNotification ||
                !notificationTitle.trim() ||
                !notificationMessage.trim()
              }
              className="bg-[#F4C2C2] hover:bg-[#F4C2C2]/90 text-white"
              data-testid="send-appointment-notification-button"
            >
              {sendingNotification ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {t('notifications.sending')}
                </>
              ) : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  {t('notifications.send')}
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminAppointments;
