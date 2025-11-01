import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Save, Loader, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

const API_URL = import.meta.env.VITE_BACKEND_URL || '';

const AdminSettings = () => {
  const { t } = useTranslation(['admin', 'common']);
  const [formData, setFormData] = useState({
    business_name: '',
    phone: '',
    email: '',
    address_line1: '',
    address_line2: '',
    city: '',
    postal_code: '',
    country: '',
    hours_weekday: '',
    hours_saturday: '',
    hours_sunday: '',
    instagram_url: '',
    facebook_url: '',
    whatsapp_number: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${API_URL}/api/settings`);
      if (!response.ok) throw new Error('Failed to fetch settings');
      const data = await response.json();
      
      // Load German version for editing
      setFormData({
        business_name: data.business_name_de || '',
        phone: data.phone || '',
        email: data.email || '',
        address_line1: data.address_line1 || '',
        address_line2: data.address_line2 || '',
        city: data.city || '',
        postal_code: data.postal_code || '',
        country: data.country || '',
        hours_weekday: data.hours_weekday || '',
        hours_saturday: data.hours_saturday || '',
        hours_sunday: data.hours_sunday || '',
        instagram_url: data.instagram_url || '',
        facebook_url: data.facebook_url || '',
        whatsapp_number: data.whatsapp_number || ''
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch(`${API_URL}/api/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to update settings');
      
      toast.success(t('settings.updateSuccess'));
      fetchSettings(); // Reload to see all language versions
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    } finally {
      setSaving(false);
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
          <h1 className="text-3xl font-bold" style={{ color: '#8B6F8E' }}>{t('settings.title')}</h1>
          <p className="text-gray-600 mt-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            {t('settings.autoTranslate')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Business Name */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {t('settings.businessName')}
            </h2>
            <div className="space-y-2">
              <Label htmlFor="business_name">{t('settings.businessName')}</Label>
              <Input
                id="business_name"
                name="business_name"
                value={formData.business_name}
                onChange={handleChange}
                placeholder="z.B. Fabulous Nails & Spa"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {t('settings.contactInfo')}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone">{t('settings.phone')}</Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+41 44 123 45 67"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t('settings.email')}</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="info@example.ch"
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {t('settings.address')}
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address_line1">{t('settings.addressLine1')}</Label>
                <Input
                  id="address_line1"
                  name="address_line1"
                  value={formData.address_line1}
                  onChange={handleChange}
                  placeholder="Bahnhofstrasse 123"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address_line2">{t('settings.addressLine2')}</Label>
                <Input
                  id="address_line2"
                  name="address_line2"
                  value={formData.address_line2}
                  onChange={handleChange}
                  placeholder="2. Stock"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">{t('settings.city')}</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Zürich"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postal_code">{t('settings.postalCode')}</Label>
                  <Input
                    id="postal_code"
                    name="postal_code"
                    value={formData.postal_code}
                    onChange={handleChange}
                    placeholder="8001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">{t('settings.country')}</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    placeholder="Schweiz"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {t('settings.hours')}
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="hours_weekday">{t('settings.hoursWeekday')}</Label>
                <Input
                  id="hours_weekday"
                  name="hours_weekday"
                  value={formData.hours_weekday}
                  onChange={handleChange}
                  placeholder="Mo-Fr: 09:00 - 19:00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hours_saturday">{t('settings.hoursSaturday')}</Label>
                <Input
                  id="hours_saturday"
                  name="hours_saturday"
                  value={formData.hours_saturday}
                  onChange={handleChange}
                  placeholder="Sa: 09:00 - 17:00"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hours_sunday">{t('settings.hoursSunday')}</Label>
                <Input
                  id="hours_sunday"
                  name="hours_sunday"
                  value={formData.hours_sunday}
                  onChange={handleChange}
                  placeholder="So: 10:00 - 16:00"
                />
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div className="bg-white rounded-lg shadow p-6 space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {t('settings.socialMedia')}
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="instagram_url">{t('settings.instagram')}</Label>
                <Input
                  id="instagram_url"
                  name="instagram_url"
                  value={formData.instagram_url}
                  onChange={handleChange}
                  placeholder="https://instagram.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="facebook_url">{t('settings.facebook')}</Label>
                <Input
                  id="facebook_url"
                  name="facebook_url"
                  value={formData.facebook_url}
                  onChange={handleChange}
                  placeholder="https://facebook.com/..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp_number">{t('settings.whatsapp')}</Label>
                <Input
                  id="whatsapp_number"
                  name="whatsapp_number"
                  value={formData.whatsapp_number}
                  onChange={handleChange}
                  placeholder="+41441234567"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={saving}
              style={{ backgroundColor: '#8B6F8E' }}
              className="text-white hover:opacity-90 px-8"
            >
              {saving ? (
                <>
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                  {t('common.loading')}
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {t('settings.save')}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
