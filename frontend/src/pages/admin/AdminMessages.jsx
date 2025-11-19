import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import AdminLayout from '@/components/admin/AdminLayout';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Trash2, Mail, Phone, Send, Bell } from 'lucide-react';
import { format } from 'date-fns';

const API_URL = import.meta.env.VITE_BACKEND_URL || '';

const AdminMessages = () => {
  const { t } = useTranslation(['admin', 'common']);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  
  // Notification modal state
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [notificationTitle, setNotificationTitle] = useState('');
  const [notificationMessage, setNotificationMessage] = useState('');
  const [sendingNotification, setSendingNotification] = useState(false);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/contact`);
      setMessages(response.data);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error(t('messages.loadError') || 'Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/api/contact/${deleteId}`);
      toast.success(t('messages.deleteSuccess'));
      setDeleteId(null);
      fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error(t('messages.deleteError') || 'Failed to delete message');
    }
  };

  const handleSendNotification = (message) => {
    setSelectedMessage(message);
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
        `${API_URL}/api/admin/contact/${selectedMessage.id}/send-notification`,
        {
          title: notificationTitle.trim(),
          message: notificationMessage.trim(),
          user_ids: [], // Not used for single contact notification
        }
      );

      toast.success(t('notifications.sentSuccessfully'));
      setShowNotificationModal(false);
      setNotificationTitle('');
      setNotificationMessage('');
      setSelectedMessage(null);
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
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#8B6F8E' }}>{t('messages.title')}</h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">{t('messages.subtitle') || 'View and manage contact messages'}</p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {messages.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 sm:p-12 text-center">
              <p className="text-sm sm:text-base text-gray-500">{t('messages.noMessages')}</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-0 mb-3 sm:mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-bold text-base sm:text-lg truncate">{message.name}</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSendNotification(message)}
                        className="text-[#8B6F8E] hover:text-[#8B6F8E] hover:bg-[#F8E6E9] p-1 h-auto flex-shrink-0"
                        title={t('messages.sendResponse')}
                        data-testid={`send-notification-${message.id}`}
                      >
                        <Bell className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-col gap-1 text-xs sm:text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                        <span className="truncate">{message.email}</span>
                      </div>
                      {message.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                          <span>{message.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 sm:gap-3">
                    <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">
                      {format(new Date(message.created_at), 'MMM dd, yyyy HH:mm')}
                    </span>
                    <Button
                      onClick={() => setDeleteId(message.id)}
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3 sm:p-4">
                  <p className="text-sm sm:text-base text-gray-700 whitespace-pre-wrap break-words">{message.message}</p>
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
        title={t('messages.delete')}
        description={t('messages.deleteConfirm')}
      />

      {/* Send Notification Modal */}
      <Dialog open={showNotificationModal} onOpenChange={setShowNotificationModal}>
        <DialogContent className="sm:max-w-[500px]" data-testid="contact-notification-modal">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="w-5 h-5" style={{ color: '#8B6F8E' }} />
              {t('messages.sendResponse')}
            </DialogTitle>
            <DialogDescription>
              {selectedMessage &&
                t('messages.sendResponseTo', {
                  name: selectedMessage.name,
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
                data-testid="contact-notification-title"
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
                data-testid="contact-notification-message"
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
                setSelectedMessage(null);
              }}
              disabled={sendingNotification}
              data-testid="cancel-contact-notification"
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
              data-testid="send-contact-notification-button"
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

export default AdminMessages;
