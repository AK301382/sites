import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import AdminLayout from '@/components/admin/AdminLayout';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import ImageUploader from '@/components/admin/ImageUploader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Sparkles } from 'lucide-react';

const API_URL = import.meta.env.VITE_BACKEND_URL || '';

const AdminArtists = () => {
  const { t } = useTranslation(['admin', 'common']);
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [editArtist, setEditArtist] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    specialties: '',
    years_experience: 0,
    image_url: '',
    instagram: ''
  });

  useEffect(() => {
    fetchArtists();
  }, []);

  const fetchArtists = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/artists`);
      setArtists(response.data);
    } catch (error) {
      console.error('Error fetching artists:', error);
      toast.error('Failed to load artists');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (artist) => {
    setEditArtist(artist);
    setFormData({
      name: artist.name,
      bio: artist.bio_de, // Load German version
      specialties: artist.specialties_de,
      years_experience: artist.years_experience,
      image_url: artist.image_url,
      instagram: artist.instagram || ''
    });
    setIsEditOpen(true);
  };

  const handleAdd = () => {
    setEditArtist(null);
    setFormData({
      name: '',
      bio: '',
      specialties: '',
      years_experience: 0,
      image_url: '',
      instagram: ''
    });
    setIsEditOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editArtist) {
        await axios.put(`${API_URL}/api/artists/${editArtist.id}`, formData);
        toast.success(t('artists.updateSuccess'));
      } else {
        await axios.post(`${API_URL}/api/artists`, formData);
        toast.success(t('artists.addSuccess'));
      }
      setIsEditOpen(false);
      fetchArtists();
    } catch (error) {
      console.error('Error saving artist:', error);
      toast.error('Failed to save artist');
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/api/artists/${deleteId}`);
      toast.success(t('artists.deleteSuccess'));
      setDeleteId(null);
      fetchArtists();
    } catch (error) {
      console.error('Error deleting artist:', error);
      toast.error('Failed to delete artist');
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold" style={{ color: '#8B6F8E' }}>{t('artists.title')}</h1>
            <p className="text-gray-600 mt-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              {t('artists.autoTranslate')}
            </p>
          </div>
          <Button
            onClick={handleAdd}
            style={{ backgroundColor: '#8B6F8E' }}
            className="text-white hover:opacity-90"
          >
            <Plus className="mr-2 h-4 w-4" />
            {t('artists.addNew')}
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {artists.map((artist) => (
            <div key={artist.id} className="bg-white rounded-lg shadow overflow-hidden">
              <img
                src={artist.image_url}
                alt={artist.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900">{artist.name}</h3>
                <p className="text-sm text-gray-600 mt-1">
                  {artist.years_experience} {t('artists.yearsExperience')}
                </p>
                <p className="text-sm text-gray-700 mt-2 line-clamp-2">{artist.bio_de}</p>
                <p className="text-xs text-gray-500 mt-2">
                  <strong>{t('artists.specialties')}:</strong> {artist.specialties_de}
                </p>
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={() => handleEdit(artist)}
                    variant="outline"
                    size="sm"
                    className="flex-1"
                  >
                    <Pencil className="h-4 w-4 mr-1" />
                    {t('artists.edit')}
                  </Button>
                  <Button
                    onClick={() => setDeleteId(artist.id)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:text-red-900"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Edit/Add Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editArtist ? t('artists.edit') : t('artists.addNew')}
            </DialogTitle>
            <p className="text-sm text-gray-500 flex items-center gap-2 mt-2">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              {t('artists.autoTranslate')}
            </p>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('artists.name')}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="z.B. Maria Schmidt"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bio">{t('artists.bio')}</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                rows={4}
                placeholder="Biografie auf Deutsch..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="specialties">{t('artists.specialties')}</Label>
              <Input
                id="specialties"
                value={formData.specialties}
                onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
                placeholder="z.B. Gel-Nägel, Nail Art"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="years_experience">{t('artists.yearsExperience')}</Label>
                <Input
                  id="years_experience"
                  type="number"
                  value={formData.years_experience}
                  onChange={(e) => setFormData({ ...formData, years_experience: parseInt(e.target.value) || 0 })}
                  placeholder="5"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram">{t('artists.instagram')}</Label>
                <Input
                  id="instagram"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  placeholder="@username"
                />
              </div>
            </div>

            <ImageUploader
              label={t('artists.imageUrl')}
              currentImage={formData.image_url}
              onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              {t('artists.cancel')}
            </Button>
            <Button
              onClick={handleSubmit}
              style={{ backgroundColor: '#8B6F8E' }}
              className="text-white"
            >
              {t('artists.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={t('artists.delete')}
        description={t('artists.deleteConfirm')}
      />
    </AdminLayout>
  );
};

export default AdminArtists;
