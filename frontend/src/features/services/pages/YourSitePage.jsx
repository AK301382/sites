import React, { useState, useMemo } from 'react';
import { Sparkles, Crown, Eye, Rocket, Zap, Star, ChevronDown, Search, Filter } from 'lucide-react';
import { Button } from '../../../components/ui/button';

const YourSitePage = () => {
  const [activeSection, setActiveSection] = useState('all');
  const [freeDisplayCount, setFreeDisplayCount] = useState(16);
  const [premiumDisplayCount, setPremiumDisplayCount] = useState(12);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all'); // 'all', 'free', 'premium'

  // All images are now local - no URL optimization needed

  // Free Templates - 40 businesses from different fields (now using local images)
  const freeTemplates = [
    { name: 'Hair Salon', image: '/images/templates/website-pages/hair-salon.jpg', category: 'Beauty & Wellness' },
    { name: 'Medical Clinic', image: '/images/templates/website-pages/medical-clinic.jpg', category: 'Healthcare' },
    { name: 'Café & Coffee Shop', image: '/images/templates/website-pages/cafe-coffee-shop.jpg', category: 'Food & Beverage' },
    { name: 'Restaurant', image: '/images/templates/website-pages/restaurant.jpg', category: 'Food & Beverage' },
    { name: 'Bakery', image: '/images/templates/website-pages/bakery.jpg', category: 'Food & Beverage' },
    { name: 'Dental Clinic', image: '/images/templates/website-pages/dental-clinic.jpg', category: 'Healthcare' },
    { name: 'Gym & Fitness Center', image: '/images/templates/website-pages/gym-fitness.jpg', category: 'Sports & Fitness' },
    { name: 'Yoga Studio', image: '/images/templates/website-pages/yoga-studio.jpg', category: 'Sports & Fitness' },
    { name: 'Law Firm', image: '/images/templates/website-pages/law-firm.jpg', category: 'Professional Services' },
    { name: 'Accounting Office', image: '/images/templates/website-pages/accounting-office.jpg', category: 'Professional Services' },
    { name: 'Real Estate Agency', image: '/images/templates/website-pages/real-estate.jpg', category: 'Real Estate' },
    { name: 'Construction Company', image: '/images/templates/website-pages/construction.jpg', category: 'Construction' },
    { name: 'Interior Design Studio', image: '/images/templates/website-pages/interior-design.jpg', category: 'Design & Creative' },
    { name: 'Photography Studio', image: '/images/templates/website-pages/photography-studio.jpg', category: 'Design & Creative' },
    { name: 'Beauty Spa', image: '/images/templates/website-pages/beauty-spa.jpg', category: 'Beauty & Wellness' },
    { name: 'Barber Shop', image: '/images/templates/website-pages/barber-shop.jpg', category: 'Beauty & Wellness' },
    { name: 'Pet Grooming', image: '/images/templates/website-pages/pet-grooming.jpg', category: 'Pet Services' },
    { name: 'Veterinary Clinic', image: '/images/templates/website-pages/veterinary-clinic.jpg', category: 'Pet Services' },
    { name: 'Flower Shop', image: '/images/templates/website-pages/flower-shop.jpg', category: 'Retail' },
    { name: 'Fashion Boutique', image: '/images/templates/website-pages/fashion-boutique.jpg', category: 'Retail' },
    { name: 'Jewelry Store', image: '/images/templates/website-pages/jewelry-store.jpg', category: 'Retail' },
    { name: 'Electronics Store', image: '/images/templates/website-pages/electronics-store.jpg', category: 'Retail' },
    { name: 'Auto Repair Shop', image: '/images/templates/website-pages/auto-repair.jpg', category: 'Automotive' },
    { name: 'Car Wash', image: '/images/templates/website-pages/car-wash.jpg', category: 'Automotive' },
    { name: 'Driving School', image: '/images/templates/website-pages/driving-school.jpg', category: 'Education & Training' },
    { name: 'Music School', image: '/images/templates/website-pages/music-school.jpg', category: 'Education & Training' },
    { name: 'Dance Academy', image: '/images/templates/website-pages/dance-academy.jpg', category: 'Education & Training' },
    { name: 'Tutoring Center', image: '/images/templates/website-pages/tutoring-center.jpg', category: 'Education & Training' },
    { name: 'Daycare Center', image: '/images/templates/website-pages/daycare-center.jpg', category: 'Childcare' },
    { name: 'Event Planning', image: '/images/templates/website-pages/event-planning.jpg', category: 'Events & Entertainment' },
    { name: 'Catering Service', image: '/images/templates/website-pages/catering-service.jpg', category: 'Food & Beverage' },
    { name: 'Food Truck', image: '/images/templates/website-pages/food-truck.jpg', category: 'Food & Beverage' },
    { name: 'Hotel', image: '/images/templates/website-pages/hotel.jpg', category: 'Hospitality' },
    { name: 'Travel Agency', image: '/images/templates/website-pages/travel-agency.jpg', category: 'Travel & Tourism' },
    { name: 'Cleaning Service', image: '/images/templates/website-pages/cleaning-service.jpg', category: 'Home Services' },
    { name: 'Plumbing Service', image: '/images/templates/website-pages/plumbing-service.jpg', category: 'Home Services' },
    { name: 'Electrical Service', image: '/images/templates/website-pages/electrical-service.jpg', category: 'Home Services' },
    { name: 'Moving Company', image: '/images/templates/website-pages/moving-company.jpg', category: 'Home Services' },
    { name: 'Printing Shop', image: '/images/templates/website-pages/printing-shop.jpg', category: 'Business Services' },
    { name: 'Laundry Service', image: '/images/templates/website-pages/laundry-service.jpg', category: 'Personal Services' }
  ];

  // Premium Templates - 20 businesses with special features (now using local images)
  const premiumTemplates = [
    { 
      name: 'Hair Salon Pro', 
      image: '/images/templates/website-pages/hair-salon-pro.jpg', 
      category: 'Beauty & Wellness',
      features: ['Online Booking', 'Staff Scheduling', 'Service Menu', 'Customer Reviews']
    },
    { 
      name: 'Medical Clinic Plus', 
      image: '/images/templates/website-pages/medical-clinic-plus.jpg', 
      category: 'Healthcare',
      features: ['Appointment Booking', 'Patient Portal', 'Online Prescriptions', 'Telemedicine']
    },
    { 
      name: 'Restaurant Premium', 
      image: '/images/templates/website-pages/restaurant-premium.jpg', 
      category: 'Food & Beverage',
      features: ['Online Ordering', 'Table Reservation', 'Menu Management', 'Delivery Integration']
    },
    { 
      name: 'Dental Clinic Advanced', 
      image: '/images/templates/website-pages/dental-clinic-advanced.jpg', 
      category: 'Healthcare',
      features: ['Appointment Scheduling', 'Treatment Plans', 'Insurance Verification', 'Patient Records']
    },
    { 
      name: 'Fitness Center Pro', 
      image: '/images/templates/website-pages/fitness-center-pro.jpg', 
      category: 'Sports & Fitness',
      features: ['Class Booking', 'Membership Management', 'Trainer Scheduling', 'Workout Tracking']
    },
    { 
      name: 'E-Commerce Store', 
      image: '/images/templates/website-pages/ecommerce-store.jpg', 
      category: 'Retail',
      features: ['Product Catalog', 'Shopping Cart', 'Payment Gateway', 'Inventory Management']
    },
    { 
      name: 'Hotel Booking System', 
      image: '/images/templates/website-pages/hotel-booking.jpg', 
      category: 'Hospitality',
      features: ['Room Booking', 'Availability Calendar', 'Payment Processing', 'Guest Management']
    },
    { 
      name: 'Law Firm Professional', 
      image: '/images/templates/website-pages/law-firm-pro.jpg', 
      category: 'Professional Services',
      features: ['Case Management', 'Client Portal', 'Document Sharing', 'Consultation Booking']
    },
    { 
      name: 'Real Estate Platform', 
      image: '/images/templates/website-pages/real-estate-platform.jpg', 
      category: 'Real Estate',
      features: ['Property Listings', 'Virtual Tours', 'Lead Management', 'Mortgage Calculator']
    },
    { 
      name: 'Event Management Pro', 
      image: '/images/templates/website-pages/event-management-pro.jpg', 
      category: 'Events & Entertainment',
      features: ['Event Booking', 'Ticket Sales', 'Guest Management', 'Seating Arrangements']
    },
    { 
      name: 'Photography Portfolio+', 
      image: '/images/templates/website-pages/photography-portfolio-plus.jpg', 
      category: 'Design & Creative',
      features: ['Gallery Management', 'Booking System', 'Client Proofing', 'Online Payments']
    },
    { 
      name: 'Spa & Wellness Pro', 
      image: '/images/templates/website-pages/spa-wellness-pro.jpg', 
      category: 'Beauty & Wellness',
      features: ['Service Booking', 'Package Deals', 'Gift Cards', 'Loyalty Program']
    },
    { 
      name: 'Tutoring Platform', 
      image: '/images/templates/website-pages/tutoring-platform.jpg', 
      category: 'Education & Training',
      features: ['Session Scheduling', 'Student Portal', 'Progress Tracking', 'Online Payments']
    },
    { 
      name: 'Auto Service Center', 
      image: '/images/templates/website-pages/auto-service-center.jpg', 
      category: 'Automotive',
      features: ['Appointment Booking', 'Service History', 'Quote Generator', 'Parts Ordering']
    },
    { 
      name: 'Veterinary Clinic+', 
      image: '/images/templates/website-pages/veterinary-clinic-plus.jpg', 
      category: 'Pet Services',
      features: ['Pet Records', 'Appointment Scheduling', 'Vaccination Reminders', 'Online Store']
    },
    { 
      name: 'Consulting Firm Pro', 
      image: '/images/templates/website-pages/consulting-firm-pro.jpg', 
      category: 'Professional Services',
      features: ['Consultation Booking', 'Project Management', 'Client Dashboard', 'Invoice System']
    },
    { 
      name: 'Music Academy+', 
      image: '/images/templates/website-pages/music-academy-plus.jpg', 
      category: 'Education & Training',
      features: ['Lesson Booking', 'Student Progress', 'Practice Tracking', 'Performance Calendar']
    },
    { 
      name: 'Catering Service Pro', 
      image: '/images/templates/website-pages/catering-service-pro.jpg', 
      category: 'Food & Beverage',
      features: ['Menu Customization', 'Event Booking', 'Quote Calculator', 'Dietary Preferences']
    },
    { 
      name: 'Travel Agency Plus', 
      image: '/images/templates/website-pages/travel-agency-plus.jpg', 
      category: 'Travel & Tourism',
      features: ['Trip Planning', 'Booking System', 'Itinerary Builder', 'Payment Integration']
    },
    { 
      name: 'Home Services Hub', 
      image: '/images/templates/website-pages/home-services-hub.jpg', 
      category: 'Home Services',
      features: ['Service Booking', 'Professional Network', 'Quote System', 'Review Management']
    }
  ];

  // Smart search function
  const searchTemplates = (templates, query) => {
    if (!query.trim()) return templates;
    
    const searchTerm = query.toLowerCase().trim();
    return templates.filter(template => {
      const name = template.name.toLowerCase();
      const category = template.category.toLowerCase();
      const features = template.features ? template.features.join(' ').toLowerCase() : '';
      
      return name.includes(searchTerm) || 
             category.includes(searchTerm) || 
             features.includes(searchTerm);
    });
  };

  // Memoize filtered templates based on search and filter type
  const filteredFreeTemplates = useMemo(() => {
    return searchTemplates(freeTemplates, searchQuery);
  }, [searchQuery]);

  const filteredPremiumTemplates = useMemo(() => {
    return searchTemplates(premiumTemplates, searchQuery);
  }, [searchQuery]);

  // Memoize visible templates
  const visibleFreeTemplates = useMemo(() => {
    return filteredFreeTemplates.slice(0, freeDisplayCount);
  }, [filteredFreeTemplates, freeDisplayCount]);

  const visiblePremiumTemplates = useMemo(() => {
    return filteredPremiumTemplates.slice(0, premiumDisplayCount);
  }, [filteredPremiumTemplates, premiumDisplayCount]);

  // Combined templates for "All" view
  const allTemplates = useMemo(() => {
    if (filterType === 'free') return filteredFreeTemplates;
    if (filterType === 'premium') return filteredPremiumTemplates;
    return [...filteredFreeTemplates, ...filteredPremiumTemplates];
  }, [filterType, filteredFreeTemplates, filteredPremiumTemplates]);

  const visibleAllTemplates = useMemo(() => {
    return allTemplates.slice(0, Math.max(freeDisplayCount, premiumDisplayCount));
  }, [allTemplates, freeDisplayCount, premiumDisplayCount]);

  const TemplateCard = ({ template, isPremium = false }) => (
    <div 
      data-testid={`template-card-${template.name.toLowerCase().replace(/\s+/g, '-')}`}
      className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700 hover:border-blue-500 dark:hover:border-cyan-400"
    >
      {isPremium && (
        <div className="absolute top-3 right-3 z-10">
          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 shadow-lg">
            <Crown className="w-3 h-3" />
            PREMIUM
          </div>
        </div>
      )}
      
      {/* Image Section with Lazy Loading */}
      <div className="relative h-48 overflow-hidden bg-gray-200 dark:bg-gray-700">
        <img 
          src={template.image}
          alt={template.name}
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-cyan-400 transition-colors">
          {template.name}
        </h3>
        
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          {template.category}
        </p>
        
        {isPremium && template.features && (
          <div className="mb-4 space-y-2">
            <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Special Features:</p>
            <ul className="space-y-1">
              {template.features.slice(0, 3).map((feature, index) => (
                <li key={index} className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
                  <Star className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <Button 
          data-testid={`view-template-btn-${template.name.toLowerCase().replace(/\s+/g, '-')}`}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center gap-2"
        >
          <Eye className="w-4 h-4" />
          View Template
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800 opacity-50"></div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-cyan-400 px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Sparkles className="w-4 h-4" />
              Build Your Website in Minutes
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Your Site, Your Way.
            </h1>
            
            <p className="text-2xl md:text-3xl font-semibold text-blue-600 dark:text-cyan-400 mb-4">
              Build the future of your business with <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Build Site</span> here.
            </p>
            
            <div className="max-w-4xl mx-auto space-y-6">
              <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed">
                Create a professional website for your business with just a few clicks. Choose from our carefully crafted templates designed specifically for your industry.
              </p>
              
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl p-8 border-2 border-blue-200 dark:border-cyan-600">
                <p className="text-lg md:text-xl text-gray-800 dark:text-gray-200 font-medium leading-relaxed">
                  <span className="text-2xl mr-2">✨</span>
                  <strong className="text-blue-600 dark:text-cyan-400">The fact that you can build your website with just a few clicks is the result of months of our work on templates.</strong>
                  <span className="text-2xl ml-2">🚀</span>
                </p>
              </div>
              
              <p className="text-lg text-gray-600 dark:text-gray-400">
                Whether you're running a hair salon, medical clinic, café, or any other business, we have a template that fits your needs perfectly. All templates are mobile-responsive, SEO-optimized, and ready to launch.
              </p>
              
              <div className="flex items-center justify-center gap-4 text-lg font-bold text-green-600 dark:text-green-400">
                <Zap className="w-6 h-6" />
                <span>100% FREE to Start</span>
                <Rocket className="w-6 h-6" />
              </div>
            </div>
            
            <div className="mt-10 flex items-center justify-center gap-4 text-lg font-bold text-gray-700 dark:text-gray-300">
              <div className="flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 px-6 py-3 rounded-xl">
                <Sparkles className="w-5 h-5 text-blue-600 dark:text-cyan-400" />
                <span>40 Free Templates</span>
              </div>
              <span className="text-2xl">+</span>
              <div className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/30 px-6 py-3 rounded-xl">
                <Crown className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                <span>20 Premium Templates</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search and Filter Section */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto max-w-7xl">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative w-full md:w-2/3 lg:w-1/2">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                data-testid="template-search-input"
                placeholder="Search templates (e.g., restaurant, salon, medical...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 text-base border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:text-white transition-all shadow-sm hover:shadow-md"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  data-testid="clear-search-btn"
                >
                  <span className="text-xl">×</span>
                </button>
              )}
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2 w-full md:w-auto">
              <Button
                data-testid="filter-all-btn"
                onClick={() => setFilterType('all')}
                className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  filterType === 'all'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400'
                }`}
              >
                <Filter className="w-4 h-4" />
                All
              </Button>
              <Button
                data-testid="filter-free-btn"
                onClick={() => setFilterType('free')}
                className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  filterType === 'free'
                    ? 'bg-gradient-to-r from-green-600 to-teal-600 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-green-500 dark:hover:border-green-400'
                }`}
              >
                <Sparkles className="w-4 h-4" />
                Free
              </Button>
              <Button
                data-testid="filter-premium-btn"
                onClick={() => setFilterType('premium')}
                className={`flex-1 md:flex-none px-6 py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
                  filterType === 'premium'
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-2 border-gray-300 dark:border-gray-600 hover:border-yellow-500 dark:hover:border-yellow-400'
                }`}
              >
                <Crown className="w-4 h-4" />
                Premium
              </Button>
            </div>
          </div>

          {/* Search Results Counter */}
          {searchQuery && (
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Found <span className="font-bold text-blue-600 dark:text-cyan-400">{allTemplates.length}</span> templates matching "{searchQuery}"
              </p>
            </div>
          )}
        </div>
      </section>

      {/* All Templates Section (Combined View) */}
      {filterType === 'all' && (
        <section id="all-templates" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-600 dark:text-cyan-400 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <Sparkles className="w-4 h-4" />
                All Templates
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Browse All Templates
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Explore our complete collection of free and premium templates
              </p>
            </div>
            
            {allTemplates.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {visibleAllTemplates.map((template, index) => {
                    const isPremium = premiumTemplates.some(t => t.name === template.name);
                    return <TemplateCard key={index} template={template} isPremium={isPremium} />;
                  })}
                </div>

                {/* Load More Button */}
                {visibleAllTemplates.length < allTemplates.length && (
                  <div className="text-center mt-12">
                    <Button
                      onClick={() => {
                        setFreeDisplayCount(prev => prev + 16);
                        setPremiumDisplayCount(prev => prev + 16);
                      }}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg transform hover:scale-105 transition-all flex items-center justify-center gap-2 mx-auto"
                    >
                      <ChevronDown className="w-5 h-5" />
                      Load More Templates ({allTemplates.length - visibleAllTemplates.length} remaining)
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No templates found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Try adjusting your search terms</p>
                <Button
                  onClick={() => setSearchQuery('')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Free Templates Section */}
      {filterType === 'free' && (
        <section id="free-templates" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <Sparkles className="w-4 h-4" />
                100% Free Forever
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Free Templates
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Professional, ready-to-use templates for every type of business. No credit card required.
              </p>
            </div>
            
            {filteredFreeTemplates.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {visibleFreeTemplates.map((template, index) => (
                    <TemplateCard key={index} template={template} isPremium={false} />
                  ))}
                </div>

                {/* Load More Button */}
                {freeDisplayCount < filteredFreeTemplates.length && (
                  <div className="text-center mt-12">
                    <Button
                      onClick={() => setFreeDisplayCount(prev => Math.min(prev + 16, filteredFreeTemplates.length))}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg rounded-xl shadow-lg transform hover:scale-105 transition-all flex items-center justify-center gap-2 mx-auto"
                    >
                      <ChevronDown className="w-5 h-5" />
                      Load More Templates ({filteredFreeTemplates.length - freeDisplayCount} remaining)
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No free templates found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Try adjusting your search terms</p>
                <Button
                  onClick={() => setSearchQuery('')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Premium Templates Section */}
      {filterType === 'premium' && (
        <section id="premium-templates" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-yellow-900/30 dark:to-orange-900/30 text-orange-600 dark:text-orange-400 px-4 py-2 rounded-full text-sm font-semibold mb-4">
                <Crown className="w-4 h-4" />
                Advanced Features Included
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Premium Templates
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
                Take your business to the next level with advanced features like booking systems, payment integration, customer portals, and more.
              </p>
            </div>
            
            {filteredPremiumTemplates.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {visiblePremiumTemplates.map((template, index) => (
                    <TemplateCard key={index} template={template} isPremium={true} />
                  ))}
                </div>

                {/* Load More Button */}
                {premiumDisplayCount < filteredPremiumTemplates.length && (
                  <div className="text-center mt-12">
                    <Button
                      onClick={() => setPremiumDisplayCount(prev => Math.min(prev + 12, filteredPremiumTemplates.length))}
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-4 text-lg rounded-xl shadow-lg transform hover:scale-105 transition-all flex items-center justify-center gap-2 mx-auto"
                    >
                      <ChevronDown className="w-5 h-5" />
                      Load More Premium ({filteredPremiumTemplates.length - premiumDisplayCount} remaining)
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <Search className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No premium templates found</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">Try adjusting your search terms</p>
                <Button
                  onClick={() => setSearchQuery('')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Clear Search
                </Button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-cyan-500 dark:from-blue-800 dark:to-cyan-700">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Build Your Website?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of businesses who have already launched their professional websites with Kawesh.
          </p>
          <Button 
            data-testid="get-started-cta-btn"
            className="bg-white text-blue-600 hover:bg-gray-100 px-10 py-6 text-lg rounded-xl shadow-lg transform hover:scale-105 transition-all"
          >
            Get Started Now - It's Free!
          </Button>
        </div>
      </section>
    </div>
  );
};

export default YourSitePage;
