import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import api from '@/utils/api';

const SendNotificationModal = ({ isOpen, onClose, selectedUsers, onSuccess }) => {
  const { t } = useTranslation(['admin', 'common']);
  const { toast } = useToast();
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      toast({
        title: t('common:error'),
        description: t('notifications.fillAllFields'),
        variant: 'destructive',
      });
      return;
    }

    try {
      setSending(true);
      await api.post('/admin/notifications/send', {
        title: title.trim(),
        message: message.trim(),
        user_ids: selectedUsers,
      });

      toast({
        title: t('common:success'),
        description:
          selectedUsers.length === 0
            ? t('notifications.sentToAll')
            : t('notifications.sentToSelected', { count: selectedUsers.length }),
      });

      setTitle('');
      setMessage('');
      onSuccess();
    } catch (error) {
      console.error('Error sending notification:', error);
      toast({
        title: t('common:error'),
        description: t('notifications.errorSending'),
        variant: 'destructive',
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]" data-testid="send-notification-modal">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Send className="w-5 h-5" style={{ color: '#8B6F8E' }} />
            {t('notifications.sendNotification')}
          </DialogTitle>
          <DialogDescription>
            {selectedUsers.length === 0
              ? t('notifications.sendToAllDescription')
              : t('notifications.sendToSelectedDescription', {
                  count: selectedUsers.length,
                })}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title">{t('notifications.title')}</Label>
            <Input
              id="title"
              placeholder={t('notifications.titlePlaceholder')}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              data-testid="notification-title-input"
            />
            <p className="text-xs text-gray-500">
              {t('notifications.noTranslation')}
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">{t('notifications.message')}</Label>
            <Textarea
              id="message"
              placeholder={t('notifications.messagePlaceholder')}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              maxLength={500}
              data-testid="notification-message-input"
            />
            <p className="text-xs text-gray-500">
              {message.length}/500 {t('notifications.characters')}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={sending}
            data-testid="cancel-notification-button"
          >
            {t('common:cancel')}
          </Button>
          <Button
            onClick={handleSend}
            disabled={sending || !title.trim() || !message.trim()}
            className="bg-[#F4C2C2] hover:bg-[#F4C2C2]/90 text-white"
            data-testid="send-notification-confirm-button"
          >
            {sending ? (
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
  );
};

export default SendNotificationModal;
