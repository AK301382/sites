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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Plus, Pencil, Trash2, Sparkles, FolderPlus } from 'lucide-react';

const API_URL = import.meta.env.VITE_BACKEND_URL || '';

const AdminServices = () => {
  const { t, i18n } = useTranslation(['admin', 'common']);
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [editService, setEditService] = useState(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    price: '',
    duration: '',
    image_url: ''
  });

  // Category management state
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState({ name: '' });
  const [deleteCategoryId, setDeleteCategoryId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    await Promise.all([fetchServices(), fetchCategories()]);
    setLoading(false);
  };

  const fetchServices = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/services`);
      setServices(response.data);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error(t('services.loadError'));
      return [];
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/categories`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error(t('services.loadError'));
      return [];
    }
  };

  const handleEdit = (service) => {
    setEditService(service);
    setFormData({
      name: service.name_de,
      description: service.description_de,
      category: service.category,
      price: service.price,
      duration: service.duration,
      image_url: service.image_url || ''
    });
    setIsEditOpen(true);
  };

  const handleAdd = () => {
    setEditService(null);
    setFormData({
      name: '',
      description: '',
      category: categories.length > 0 ? getLocalizedText(categories[0], 'name') : '',
      price: '',
      duration: '',
      image_url: ''
    });
    setIsEditOpen(true);
  };

  const handleSubmit = async () => {
    try {
      if (editService) {
        await axios.put(`${API_URL}/api/services/${editService.id}`, formData);
        toast.success(t('services.updateSuccess'));
      } else {
        await axios.post(`${API_URL}/api/services`, formData);
        toast.success(t('services.addSuccess'));
      }
      setIsEditOpen(false);
      fetchServices();
    } catch (error) {
      console.error('Error saving service:', error);
      toast.error(t('services.saveError'));
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${API_URL}/api/services/${deleteId}`);
      toast.success(t('services.deleteSuccess'));
      setDeleteId(null);
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      toast.error(t('services.saveError'));
    }
  };

  // Category management functions
  const handleAddCategory = () => {
    setEditCategory(null);
    setCategoryFormData({ name: '' });
    setIsCategoryOpen(true);
  };

  const handleEditCategory = (category) => {
    setEditCategory(category);
    setCategoryFormData({ name: category.name_de });
    setIsCategoryOpen(true);
  };

  const handleSubmitCategory = async () => {
    try {
      if (editCategory) {
        await axios.put(`${API_URL}/api/categories/${editCategory.id}`, categoryFormData);
        toast.success(t('services.categoryUpdateSuccess'));
      } else {
        await axios.post(`${API_URL}/api/categories`, categoryFormData);
        toast.success(t('services.categoryAddSuccess'));
      }
      setIsCategoryOpen(false);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      toast.error(t('services.saveError'));
    }
  };

  const handleDeleteCategory = async () => {
    try {
      await axios.delete(`${API_URL}/api/categories/${deleteCategoryId}`);
      toast.success(t('services.categoryDeleteSuccess'));
      setDeleteCategoryId(null);
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
      toast.error(t('services.saveError'));
    }
  };

  const getLocalizedText = (item, field) => {
    let lang = i18n.language;
    // Map Swiss German (de-CH) to standard German (de) for database fields
    if (lang === 'de-CH') lang = 'de';
    return item[`${field}_${lang}`] || item[`${field}_en`];
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#8B6F8E' }}>{t('services.title')}</h1>
            <p className="text-sm sm:text-base text-gray-600 mt-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-500 flex-shrink-0" />
              {t('services.autoTranslateInfo')}
            </p>
          </div>
          <Button
            onClick={handleAdd}
            style={{ backgroundColor: '#8B6F8E' }}
            className="text-white hover:opacity-90 w-full sm:w-auto"
            data-testid="add-service-button"
          >
            <Plus className="mr-2 h-4 w-4" />
            {t('services.addNewService')}
          </Button>
        </div>

        <Tabs defaultValue="services" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="services" data-testid="services-tab">{t('services.servicesTab')}</TabsTrigger>
            <TabsTrigger value="categories" data-testid="categories-tab">{t('services.categoriesTab')}</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="mt-6">
            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-lg shadow">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('services.serviceName')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('services.serviceCategory')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('services.servicePrice')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('services.duration')}
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('common.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {services.map((service) => (
                      <tr key={service.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{service.name_de}</div>
                          <div className="text-xs text-gray-500 mt-1">{service.description_de?.substring(0, 50)}...</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {service.category}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {service.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {service.duration}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <Button
                            onClick={() => handleEdit(service)}
                            variant="ghost"
                            size="sm"
                            className="mr-2"
                            data-testid={`edit-service-${service.id}`}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            onClick={() => setDeleteId(service.id)}
                            variant="ghost"
                            size="sm"
                            className="text-red-600 hover:text-red-900"
                            data-testid={`delete-service-${service.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            {/* Mobile Card View */}
            <div className="md:hidden space-y-4">
              {services.map((service) => (
                <div key={service.id} className="bg-white rounded-lg shadow border border-gray-200 p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{service.name_de}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2">{service.description_de}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500 font-medium">{t('services.serviceCategory')}</p>
                      <p className="text-gray-900">{service.category}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 font-medium">{t('services.servicePrice')}</p>
                      <p className="text-gray-900">{service.price}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="text-gray-500 font-medium">{t('services.duration')}</p>
                      <p className="text-gray-900">{service.duration}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-200 flex gap-2">
                    <Button
                      onClick={() => handleEdit(service)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      data-testid={`edit-service-${service.id}`}
                    >
                      <Pencil className="h-4 w-4 mr-2" />
                      {t('common:edit')}
                    </Button>
                    <Button
                      onClick={() => setDeleteId(service.id)}
                      variant="outline"
                      size="sm"
                      className="flex-1 text-red-600 hover:text-red-900"
                      data-testid={`delete-service-${service.id}`}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {t('common:delete')}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="categories" className="mt-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">{t('services.categoriesTitle')}</h2>
                </div>
                <Button
                  onClick={handleAddCategory}
                  style={{ backgroundColor: '#8B6F8E' }}
                  className="text-white hover:opacity-90"
                  data-testid="add-category-button"
                >
                  <FolderPlus className="mr-2 h-4 w-4" />
                  {t('services.addNewCategory')}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                    data-testid={`category-${category.id}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{getLocalizedText(category, 'name')}</h3>
                        <p className="text-xs text-gray-500 mt-1">
                          DE: {category.name_de} | EN: {category.name_en} | FR: {category.name_fr}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEditCategory(category)}
                          variant="ghost"
                          size="sm"
                          data-testid={`edit-category-${category.id}`}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          onClick={() => setDeleteCategoryId(category.id)}
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-900"
                          data-testid={`delete-category-${category.id}`}
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

      {/* Service Edit/Add Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editService ? t('services.edit') : t('services.addNewService')}
            </DialogTitle>
            <p className="text-sm text-gray-500 flex items-center gap-2 mt-2">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              {t('services.autoTranslateInfo')}
            </p>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">{t('services.serviceName')}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="z.B. Klassische Maniküre"
                data-testid="service-name-input"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t('services.description')}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={4}
                placeholder="Beschreibung auf Deutsch..."
                data-testid="service-description-input"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">{t('services.serviceCategory')}</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger data-testid="service-category-select">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={getLocalizedText(cat, 'name')}>
                        {getLocalizedText(cat, 'name')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">{t('services.servicePrice')}</Label>
                <Input
                  id="price"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  placeholder="CHF 65"
                  data-testid="service-price-input"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">{t('services.duration')}</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="45 min"
                data-testid="service-duration-input"
              />
            </div>

            <ImageUploader
              label={t('services.imageUrl')}
              currentImage={formData.image_url}
              onImageUploaded={(url) => setFormData({ ...formData, image_url: url })}
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditOpen(false)}>
              {t('services.cancel')}
            </Button>
            <Button
              onClick={handleSubmit}
              style={{ backgroundColor: '#8B6F8E' }}
              className="text-white"
              data-testid="save-service-button"
            >
              {t('services.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Category Edit/Add Dialog */}
      <Dialog open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editCategory ? t('services.editCategory') : t('services.addNewCategory')}
            </DialogTitle>
            <p className="text-sm text-gray-500 flex items-center gap-2 mt-2">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              {t('services.autoTranslateInfo')}
            </p>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="category-name">{t('services.categoryName')}</Label>
              <Input
                id="category-name"
                value={categoryFormData.name}
                onChange={(e) => setCategoryFormData({ name: e.target.value })}
                placeholder="z.B. Maniküre, Pediküre, Nageldesign"
                data-testid="category-name-input"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCategoryOpen(false)}>
              {t('services.cancel')}
            </Button>
            <Button
              onClick={handleSubmitCategory}
              style={{ backgroundColor: '#8B6F8E' }}
              className="text-white"
              data-testid="save-category-button"
            >
              {t('services.save')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Service Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title={t('services.delete')}
        description={t('services.deleteConfirm')}
      />

      {/* Category Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteCategoryId}
        onClose={() => setDeleteCategoryId(null)}
        onConfirm={handleDeleteCategory}
        title={t('services.delete')}
        description={t('services.categoryDeleteConfirm')}
      />
    </AdminLayout>
  );
};

export default AdminServices;
