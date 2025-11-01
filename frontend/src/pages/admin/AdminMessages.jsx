import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import AdminLayout from '@/components/admin/AdminLayout';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Trash2, Mail, Phone } from 'lucide-react';
import { format } from 'date-fns';

const API_URL = import.meta.env.VITE_BACKEND_URL || '';

const AdminMessages = () => {
  const { t } = useTranslation(['admin', 'common']);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);

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
          <h1 className="text-3xl font-bold" style={{ color: '#8B6F8E' }}>{t('messages.title')}</h1>
          <p className="text-gray-600 mt-2">{t('messages.subtitle') || 'View and manage contact messages'}</p>
        </div>

        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
              <p className="text-gray-500">{t('messages.noMessages')}</p>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2">{message.name}</h3>
                    <div className="flex flex-col gap-1 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{message.email}</span>
                      </div>
                      {message.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4" />
                          <span>{message.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">
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
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">{message.message}</p>
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
    </AdminLayout>
  );
};

export default AdminMessages;
