import React, { useEffect, useState, useMemo, useCallback, memo } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Clock, Sparkles, ChevronDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

// Memoized Loading Component
const LoadingSpinner = memo(() => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <div className="w-16 h-16 border-4 border-[#F4C2C2] border-t-[#D4AF76] rounded-full animate-spin mx-auto mb-4"></div>
      <p className="text-[#3E3E3E]">Loading...</p>
    </div>
  </div>
));
LoadingSpinner.displayName = 'LoadingSpinner';

// Memoized Service Card
const ServiceCard = memo(({ service, getLocalizedText, t, categoryTab, index }) => (
  <Card
    className="hover:shadow-xl transition-shadow duration-300 border-2 border-[#F8E6E9] overflow-hidden"
    data-testid={`service-card-${categoryTab}-${index}`}
  >
    {service.image_url && (
      <img src={service.image_url} alt={getLocalizedText(service, 'name')} className="w-full h-48 object-cover" />
    )}
    <CardContent className="p-6">
      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#F4C2C2] to-[#D4AF76] flex items-center justify-center mb-4">
        <Sparkles className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-xl font-bold mb-2 text-[#3E3E3E]">{getLocalizedText(service, 'name')}</h3>
      <p className="text-sm text-[#3E3E3E]/70 mb-4">{getLocalizedText(service, 'description')}</p>
      <div className="flex justify-between items-center mb-4 pb-4 border-b border-[#F8E6E9]">
        <span className="text-2xl font-bold text-[#D4AF76]">{service.price}</span>
        <span className="text-sm text-[#3E3E3E]/70 flex items-center gap-1">
          <Clock className="w-4 h-4" />
          {service.duration}
        </span>
      </div>
      <Link to="/booking">
        <Button
          className="w-full bg-gradient-to-r from-[#F4C2C2] to-[#D4AF76] hover:opacity-90 text-white rounded-full"
          data-testid={`book-service-${categoryTab}-${index}`}
        >
          {t('services.bookService')}
        </Button>
      </Link>
    </CardContent>
  </Card>
));
ServiceCard.displayName = 'ServiceCard';

const ServicesPage = () => {
  const { t, i18n } = useTranslation();
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('');

  // Memoized data fetching
  const fetchData = useCallback(async () => {
    try {
      const [servicesRes, categoriesRes] = await Promise.all([
        axios.get(`${API}/services`),
        axios.get(`${API}/categories`)
      ]);
      setServices(servicesRes.data);
      setCategories(categoriesRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Memoized localization function
  const getLocalizedText = useCallback((item, field) => {
    const lang = i18n.language;
    return item[`${field}_${lang}`] || item[`${field}_en`];
  }, [i18n.language]);

  // Set active tab when categories load or language changes
  useEffect(() => {
    if (categories.length > 0 && !activeTab) {
      setActiveTab(getLocalizedText(categories[0], 'name'));
    }
  }, [categories, getLocalizedText, activeTab]);

  // Memoized helper functions
  const getCategoryEnglishName = useCallback((categoryObj) => categoryObj.name_en, []);

  const getServicesByCategory = useCallback((categoryObj) => {
    if (!categoryObj) return [];
    const englishName = getCategoryEnglishName(categoryObj);
    return services.filter((s) => s.category === englishName);
  }, [services, getCategoryEnglishName]);

  // Memoized active category
  const activeCategory = useMemo(() => {
    return categories.find(c => getLocalizedText(c, 'name') === activeTab) || categories[0];
  }, [categories, activeTab, getLocalizedText]);

  // Memoized filtered services
  const filteredServices = useMemo(() => {
    return getServicesByCategory(activeCategory);
  }, [activeCategory, getServicesByCategory]);

  // Memoized tab change handler
  const handleTabChange = useCallback((value) => {
    setActiveTab(value);
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="pt-24 pb-16 bg-gradient-to-b from-[#F8E6E9] to-white" data-testid="services-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-[#8B6F8E]" style={{ fontFamily: 'Playfair Display, serif' }}>
            {t('services.title')}
          </h1>
          <p className="text-base sm:text-lg text-[#3E3E3E]/70 max-w-2xl mx-auto">
            Experience luxury nail care with our comprehensive range of services
          </p>
        </div>
      </section>

      {/* Services */}
      <section className="py-12 sm:py-16 bg-white" data-testid="services-list">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {categories.length > 0 ? (
            <div>
              {/* Mobile: Dropdown Selector */}
              <div className="block lg:hidden mb-8">
                <Select value={activeTab} onValueChange={handleTabChange}>
                  <SelectTrigger className="w-full max-w-md mx-auto bg-white border-2 border-[#F8E6E9] rounded-full px-6 py-6 text-base font-medium shadow-sm hover:shadow-md transition-all">
                    <SelectValue placeholder={t('services.selectCategory')} />
                    <ChevronDown className="w-5 h-5 ml-2" />
                  </SelectTrigger>
                  <SelectContent className="max-w-md">
                    {categories.map((category) => (
                      <SelectItem
                        key={category.id}
                        value={getLocalizedText(category, 'name')}
                        className="text-base py-3 cursor-pointer hover:bg-[#F8E6E9] transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Sparkles className="w-4 h-4 text-[#D4AF76]" />
                          {getLocalizedText(category, 'name')}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Desktop: Scrollable Tabs */}
              <div className="hidden lg:block">
                <div className="flex justify-center mb-8 sm:mb-12">
                  <div className="inline-flex gap-2 p-2 bg-[#FAF9F6] rounded-full shadow-sm overflow-x-auto max-w-full scrollbar-hide">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleTabChange(getLocalizedText(category, 'name'))}
                        className={`
                          px-6 py-3 rounded-full text-sm sm:text-base font-medium transition-all whitespace-nowrap
                          ${activeTab === getLocalizedText(category, 'name')
                            ? 'bg-gradient-to-r from-[#F4C2C2] to-[#D4AF76] text-white shadow-md'
                            : 'bg-white text-[#3E3E3E] hover:bg-[#F8E6E9]'
                          }
                        `}
                        data-testid={`category-${category.id}`}
                      >
                        {getLocalizedText(category, 'name')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Services Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredServices.map((service, index) => (
                  <ServiceCard
                    key={service.id}
                    service={service}
                    getLocalizedText={getLocalizedText}
                    t={t}
                    categoryTab={activeTab}
                    index={index}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-[#3E3E3E]/70">No services available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-b from-[#FAF9F6] to-[#F8E6E9]" data-testid="services-cta">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-[#8B6F8E]" style={{ fontFamily: 'Playfair Display, serif' }}>
            Ready to pamper yourself?
          </h2>
          <p className="text-lg text-[#3E3E3E]/70 mb-8">Book your appointment today and experience the luxury you deserve</p>
          <Link to="/booking">
            <Button className="bg-gradient-to-r from-[#F4C2C2] to-[#D4AF76] hover:opacity-90 text-white rounded-full px-12 py-6 text-lg" data-testid="cta-book-button">
              {t('hero.bookButton')}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default memo(ServicesPage);