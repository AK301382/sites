import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import AdminLayout from '@/components/admin/AdminLayout';
import ConfirmDialog from '@/components/admin/ConfirmDialog';
import ImageUploader from '@/components/admin/ImageUploader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Sparkles, Palette, PaintBucket } from 'lucide-react';

const API_URL = import.meta.env.VITE_BACKEND_URL || '';

const AdminGallery = () => {
  const { t, i18n } = useTranslation(['admin', 'common']);
  const [items, setItems] = useState([]);
  const [styles, setStyles] = useState([]);
  const [colors, setColors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    image_url: '',
    artist_name: '',
    style: '',
    colors: []
  });

  // Style management state
  const [isStyleOpen, setIsStyleOpen] = useState(false);
  const [editStyle, setEditStyle] = useState(null);
  const [styleFormData, setStyleFormData] = useState({ name: '' });
  const [deleteStyleId, setDeleteStyleId] = useState(null);

  // Color management state
  const [isColorOpen, setIsColorOpen] = useState(false);
  const [editColor, setEditColor] = useState(null);
  const [colorFormData, setColorFormData] = useState({ name: '' });
  const [deleteColorId, setDeleteColorId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await Promise.all([fetchGallery(), fetchStyles(), fetchColors()]);
    setLoading(false);
  };

  const fetchGallery = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/gallery`);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching gallery:', error);
      toast.error(t('gallery.loadGalleryError'));
    }
  };

  const fetchStyles = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/gallery-styles`);
      setStyles(response.data);
    } catch (error) {
      console.error('Error fetching styles:', error);
      toast.error(t('gallery.loadStylesError'));
    }
  };

  const fetchColors = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/gallery-colors`);
      setColors(response.data);
    } catch (error) {
      console.error('Error fetching colors:', error);
      toast.error(t('gallery.loadColorsError'));
    }
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setFormData({
      title: item.title_de,
      image_url: item.image_url,
      artist_name: item.artist_name,
      style: item.style, // Already stored as name_en
      colors: Array.isArray(item.colors) ? item.colors : [] // Already stored as name_en array
    });
    setIsEditOpen(true);
  };

  const handleAdd = () => {
    setEditItem(null);
    setFormData({
      title: '',
      image_url: '',
      artist_name: '',
      style: styles.length > 0 ? styles[0].name_en : '',
      colors: []
    });
    setIsEditOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const submitData = {
        title: formData.title,
        image_url: formData.image_url,
        artist_name: formData.artist_name,
        style: formData.style, // Send name_en directly
        colors: formData.colors // Send name_en array directly
      };
      
      if (editItem) {
        await axios.put(`${API_URL}/api/gallery/${editItem.id}`, submitData);
        toast.success(t('gallery.updateSuccess'));
      } else {
        await axios.post(`${API_URL}/api/gallery`, submitData);
        toast.success(t('gallery.addSuccess'));
      }
      setIsEditOpen(false);
      fetchGallery();
    } catch (error) {
      console.error('Error saving gallery item:', error);
      toast.error(t('gallery.saveItemError'));
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/api/gallery/${deleteId}`);
      toast.success(t('gallery.deleteSuccess'));
      setDeleteId(null);
      fetchGallery();
    } catch (error) {
      console.error('Error deleting item:', error);
      toast.error(t('gallery.deleteItemError'));
    }
  };

  // Style management functions
  const handleAddStyle = () => {
    setEditStyle(null);
    setStyleFormData({ name: '' });
    setIsStyleOpen(true);
  };

  const handleEditStyle = (style) => {
    setEditStyle(style);
    setStyleFormData({ name: style.name_de });
    setIsStyleOpen(true);
  };

  const handleSubmitStyle = async () => {
    try {
      if (editStyle) {
        await axios.put(`${API_URL}/api/gallery-styles/${editStyle.id}`, styleFormData);
        toast.success(t('gallery.styleUpdateSuccess'));
      } else {
        await axios.post(`${API_URL}/api/gallery-styles`, styleFormData);
        toast.success(t('gallery.styleAddSuccess'));
      }
      setIsStyleOpen(false);
      await fetchStyles();
      // Update form if adding new style and dialog is open
      if (!editStyle && isEditOpen) {
        const updatedStyles = await axios.get(`${API_URL}/api/gallery-styles`);
        if (updatedStyles.data.length > 0 && !formData.style) {
          setFormData({ ...formData, style: updatedStyles.data[updatedStyles.data.length - 1].name_en });
        }
      }
    } catch (error) {
      console.error('Error saving style:', error);
      toast.error(t('gallery.saveStyleError'));
    }
  };

  const handleDeleteStyle = async () => {
    try {
      await axios.delete(`${API_URL}/api/gallery-styles/${deleteStyleId}`);
      toast.success(t('gallery.styleDeleteSuccess'));
      setDeleteStyleId(null);
      fetchStyles();
    } catch (error) {
      console.error('Error deleting style:', error);
      toast.error(t('gallery.deleteStyleError'));
    }
  };

  // Color management functions
  const handleAddColor = () => {
    setEditColor(null);
    setColorFormData({ name: '' });
    setIsColorOpen(true);
  };

  const handleEditColor = (color) => {
    setEditColor(color);
    setColorFormData({ name: color.name_de });
    setIsColorOpen(true);
  };

  const handleSubmitColor = async () => {
    try {
      if (editColor) {
        await axios.put(`${API_URL}/api/gallery-colors/${editColor.id}`, colorFormData);
        toast.success(t('gallery.colorUpdateSuccess'));
      } else {
        await axios.post(`${API_URL}/api/gallery-colors`, colorFormData);
        toast.success(t('gallery.colorAddSuccess'));
      }
      setIsColorOpen(false);
      fetchColors();
    } catch (error) {
      console.error('Error saving color:', error);
      toast.error(t('gallery.saveColorError'));
    }
  };

  const handleDeleteColor = async () => {
    try {
      await axios.delete(`${API_URL}/api/gallery-colors/${deleteColorId}`);
      toast.success(t('gallery.colorDeleteSuccess'));
      setDeleteColorId(null);
      fetchColors();
    } catch (error) {
      console.error('Error deleting color:', error);
      toast.error(t('gallery.deleteColorError'));
    }
  };

  const getLocalizedText = (item, field) => {
    let lang = i18n.language;
    // Map Swiss German (de-CH) to standard German (de) for database fields
    if (lang === 'de-CH') lang = 'de';
    return item[`${field}_${lang}`] || item[`${field}_en`];
  };

  // Find localized display name for a stored name_en value
  const getLocalizedStyleName = (styleNameEn) => {
    const style = styles.find(s => s.name_en === styleNameEn);
    return style ? getLocalizedText(style, 'name') : styleNameEn;
  };

  const getLocalizedColorName = (colorNameEn) => {
    const color = colors.find(c => c.name_en === colorNameEn);
    return color ? getLocalizedText(color, 'name') : colorNameEn;
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
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold truncate" style={{ color: '#8B6F8E' }}>{t('gallery.title')}</h1>
            <p className="text-xs sm:text-sm text-gray-600 mt-2 flex items-center gap-2">
              <Sparkles className="h-3 h-3 sm:h-4 sm:w-4 text-yellow-500 flex-shrink-0" />
              <span className="truncate">{t('gallery.autoTranslate')}</span>
            </p>
          </div>
          <Button
            onClick={handleAdd}
            style={{ backgroundColor: '#8B6F8E' }}
            className="text-white hover:opacity-90 w-full sm:w-auto flex-shrink-0"
            data-testid="add-gallery-button"
          >
            <Plus className="mr-2 h-4 w-4" />
            {t('gallery.addNew')}
          </Button>
        </div>

        <Tabs defaultValue="gallery" className="w-full">
          <TabsList className="grid w-full grid-cols-3 max-w-full sm:max-w-2xl h-auto">
            <TabsTrigger value="gallery" data-testid="gallery-tab" className="text-xs sm:text-sm px-2 py-2 sm:px-4 sm:py-2.5">{t('gallery.galleryTab')}</TabsTrigger>
            <TabsTrigger value="styles" data-testid="styles-tab" className="text-xs sm:text-sm px-2 py-2 sm:px-4 sm:py-2.5">{t('gallery.stylesTab')}</TabsTrigger>
            <TabsTrigger value="colors" data-testid="colors-tab" className="text-xs sm:text-sm px-2 py-2 sm:px-4 sm:py-2.5">{t('gallery.colorsTab')}</TabsTrigger>
          </TabsList>

          <TabsContent value="gallery" className="mt-4 sm:mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {items.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden group relative">
                  <img
                    src={item.image_url}
                    alt={item.title_de}
                    className="w-full h-48 sm:h-56 md:h-64 object-cover"
                  />
                  <div className="p-3 sm:p-4">
                    <h3 className="text-sm font-semibold text-gray-900 truncate">{item.title_de}</h3>
                    <p className="text-xs text-gray-600 mt-1 truncate">{item.artist_name}</p>
                    <p className="text-xs text-gray-500 mt-1 truncate">{getLocalizedStyleName(item.style)}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {Array.isArray(item.colors) && item.colors.slice(0, 5).map((colorEn, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded"
                        >
                          {getLocalizedColorName(colorEn)}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity flex gap-2">
                    <Button
                      onClick={() => handleEdit(item)}
                      size="sm"
                      className="bg-white hover:bg-gray-100"
                      data-testid={`edit-gallery-${item.id}`}
                    >
                      <Pencil className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                    <Button
                      onClick={() => setDeleteId(item.id)}
                      size="sm"
                      className="bg-white hover:bg-red-100 text-red-600"
                      data-testid={`delete-gallery-${item.id}`}
                    >
                      <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="styles" className="mt-4 sm:mt-6">
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">{t('gallery.stylesTitle')}</h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">{t('gallery.stylesSubtitle')}</p>
                </div>
                <Button
                  onClick={handleAddStyle}
                  style={{ backgroundColor: '#8B6F8E' }}
                  className="text-white hover:opacity-90 w-full sm:w-auto flex-shrink-0"
                  data-testid="add-style-button"
                >
                  <Palette className="mr-2 h-4 w-4" />
                  {t('gallery.addStyle')}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {styles.map((style) => (
                  <div
                    key={style.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    data-testid={`style-${style.id}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{getLocalizedText(style, 'name')}</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          DE: {style.name_de} | EN: {style.name_en} | FR: {style.name_fr}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEditStyle(style)}
                          variant="ghost"
                          size="sm"
                          data-testid={`edit-style-${style.id}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => setDeleteStyleId(style.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-900"
                          data-testid={`delete-style-${style.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="colors" className="mt-4 sm:mt-6">
            <div className="bg-white rounded-lg shadow p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div className="min-w-0 flex-1">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900">{t('gallery.colorsTitle')}</h2>
                  <p className="text-xs sm:text-sm text-gray-500 mt-1">{t('gallery.colorsSubtitle')}</p>
                </div>
                <Button
                  onClick={handleAddColor}
                  style={{ backgroundColor: '#8B6F8E' }}
                  className="text-white hover:opacity-90 w-full sm:w-auto flex-shrink-0"
                  data-testid="add-color-button"
                >
                  <PaintBucket className="mr-2 h-4 w-4" />
                  {t('gallery.addColor')}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {colors.map((color) => (
                  <div
                    key={color.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    data-testid={`color-${color.id}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{getLocalizedText(color, 'name')}</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          DE: {color.name_de} | EN: {color.name_en} | FR: {color.name_fr}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEditColor(color)}
                          variant="ghost"
                          size="sm"
                          data-testid={`edit-color-${color.id}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => setDeleteColorId(color.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-900"
                          data-testid={`delete-color-${color.id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Gallery Item Edit/Add Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto sm:max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">
              {editItem ? t('gallery.edit') : t('gallery.addNew')}
            </DialogTitle>
            <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-2 mt-2">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
              {t('gallery.autoTranslate')}
            </p>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">{t('gallery.title_field')}</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="z.B. Elegante French Nägel"
                data-testid="gallery-title-input"
              />
            </div>

            <ImageUploader
              label={t('gallery.imageUrl')}
              currentImage={formData.image_url}
              onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
            />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="artist_name">{t('gallery.artistName')}</Label>
                <Input
                  id="artist_name"
                  value={formData.artist_name}
                  onChange={(e) => setFormData({ ...formData, artist_name: e.target.value })}
                  placeholder="Maria Schmidt"
                  data-testid="gallery-artist-input"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="style">{t('gallery.style')}</Label>
                <Select
                  value={formData.style}
                  onValueChange={(value) => setFormData({ ...formData, style: value })}
                >
                  <SelectTrigger data-testid="gallery-style-select">
                    <SelectValue placeholder="Select style" />
                  </SelectTrigger>
                  <SelectContent>
                    {styles.map((style) => (
                      <SelectItem key={style.id} value={style.name_en}>
                        {getLocalizedText(style, 'name')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="colors">{t('gallery.colors')} (Select Multiple)</Label>
              <div className="border rounded-md p-4 max-h-48 overflow-y-auto space-y-2">
                {colors.map((color) => {
                  const isSelected = formData.colors.includes(color.name_en);
                  return (
                    <label
                      key={color.id}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 p-2 rounded"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => {
                          let newColors;
                          if (e.target.checked) {
                            newColors = [...formData.colors, color.name_en];
                          } else {
                            newColors = formData.colors.filter(c => c !== color.name_en);
                          }
                          setFormData({ ...formData, colors: newColors });
                        }}
                        className="w-4 h-4 text-[#8B6F8E] rounded"
                      />
                      <span className="text-sm">{getLocalizedText(color, 'name')}</span>
                    </label>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500">
                Selected: {formData.colors.map(c => getLocalizedColorName(c)).join(', ') || 'None'}
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              {t('gallery.cancel')}
            </Button>
            <Button
              onClick={handleSubmit}
              style={{ backgroundColor: '#8B6F8E' }}
              className="text-white"
              data-testid="save-gallery-button"
            >
              {t('gallery.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Style Edit/Add Dialog */}
      <Dialog open={isStyleOpen} onOpenChange={setIsStyleOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">
              {editStyle ? t('gallery.editStyle') : t('gallery.addStyle')}
            </DialogTitle>
            <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-2 mt-2">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
              {t('gallery.autoTranslate')}
            </p>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="style-name">{t('gallery.styleName')}</Label>
              <Input
                id="style-name"
                value={styleFormData.name}
                onChange={(e) => setStyleFormData({ name: e.target.value })}
                placeholder="z.B. Französisch, Modern, Minimalistisch"
                data-testid="style-name-input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsStyleOpen(false)}>
              {t('gallery.cancel')}
            </Button>
            <Button
              onClick={handleSubmitStyle}
              style={{ backgroundColor: '#8B6F8E' }}
              className="text-white"
              data-testid="save-style-button"
            >
              {t('gallery.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Color Edit/Add Dialog */}
      <Dialog open={isColorOpen} onOpenChange={setIsColorOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base sm:text-lg">
              {editColor ? t('gallery.editColor') : t('gallery.addColor')}
            </DialogTitle>
            <p className="text-xs sm:text-sm text-gray-500 flex items-center gap-2 mt-2">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500" />
              {t('gallery.autoTranslateColor')}
            </p>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="color-name">{t('gallery.colorName')}</Label>
              <Input
                id="color-name"
                value={colorFormData.name}
                onChange={(e) => setColorFormData({ name: e.target.value })}
                placeholder="z.B. Rosa, Blau, Gold"
                data-testid="color-name-input"
              />
              <p className="text-xs text-gray-500">
                Beispiele: Rosa, Blau, Rot, Gold, Silber, Schwarz, Weiß, Grün, etc.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsColorOpen(false)}>
              {t('gallery.cancel')}
            </Button>
            <Button
              onClick={handleSubmitColor}
              style={{ backgroundColor: '#8B6F8E' }}
              className="text-white"
              data-testid="save-color-button"
            >
              {t('gallery.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Gallery Item Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={t('gallery.delete')}
        description={t('gallery.deleteConfirm')}
      />

      {/* Style Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteStyleId}
        onClose={() => setDeleteStyleId(null)}
        onConfirm={handleDeleteStyle}
        title={t('gallery.deleteStyle')}
        description={t('gallery.deleteStyleConfirm')}
      />

      {/* Color Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteColorId}
        onClose={() => setDeleteColorId(null)}
        onConfirm={handleDeleteColor}
        title={t('gallery.deleteColor')}
        description={t('gallery.deleteColorConfirm')}
      />
    </AdminLayout>
  );
};

export default AdminGallery;
