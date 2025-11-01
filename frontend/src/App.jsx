import React, { lazy, Suspense } from 'react';
import './i18n';
import '@/App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import { AuthProvider } from '@/contexts/AuthContext';
import { UserAuthProvider } from '@/contexts/UserAuthContext';
import ProtectedRoute from '@/components/admin/ProtectedRoute';

// Lazy load pages for better performance
const HomePage = lazy(() => import('@/pages/HomePage'));
const ServicesPage = lazy(() => import('@/pages/ServicesPage'));
const GalleryPage = lazy(() => import('@/pages/GalleryPage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const BookingPage = lazy(() => import('@/pages/BookingPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));

// User pages - lazy loaded
const UserLogin = lazy(() => import('@/pages/UserLogin'));
const UserDashboard = lazy(() => import('@/pages/UserDashboard'));

// Admin pages - lazy loaded
const AdminLogin = lazy(() => import('@/pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('@/pages/admin/AdminDashboard'));
const AdminAppointments = lazy(() => import('@/pages/admin/AdminAppointments'));
const AdminServices = lazy(() => import('@/pages/admin/AdminServices'));
const AdminGallery = lazy(() => import('@/pages/admin/AdminGallery'));
const AdminArtists = lazy(() => import('@/pages/admin/AdminArtists'));
const AdminMessages = lazy(() => import('@/pages/admin/AdminMessages'));
const AdminSettings = lazy(() => import('@/pages/admin/AdminSettings'));

// Loading component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-400"></div>
  </div>
);

// Public Layout wrapper
const PublicLayout = ({ children }) => (
  <>
    <Header />
    <Suspense fallback={<PageLoader />}>
      {children}
    </Suspense>
    <Footer />
  </>
);

// Contact Layout wrapper (without footer)
const ContactLayout = ({ children }) => (
  <>
    <Header />
    <Suspense fallback={<PageLoader />}>
      {children}
    </Suspense>
  </>
);

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AuthProvider>
          <UserAuthProvider>
            <ScrollToTop />
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
              
              {/* Other Public Routes */}
              <Route path="/services" element={<PublicLayout><ServicesPage /></PublicLayout>} />
              <Route path="/gallery" element={<PublicLayout><GalleryPage /></PublicLayout>} />
              <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
              <Route path="/contact" element={<ContactLayout><ContactPage /></ContactLayout>} />
              <Route path="/booking" element={<PublicLayout><BookingPage /></PublicLayout>} />

              {/* User Routes */}
              <Route path="/user/login" element={<Suspense fallback={<PageLoader />}><UserLogin /></Suspense>} />
              <Route path="/user/dashboard" element={<Suspense fallback={<PageLoader />}><UserDashboard /></Suspense>} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<Suspense fallback={<PageLoader />}><AdminLogin /></Suspense>} />
              <Route path="/admin/dashboard" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense></ProtectedRoute>} />
              <Route path="/admin/appointments" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><AdminAppointments /></Suspense></ProtectedRoute>} />
              <Route path="/admin/services" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><AdminServices /></Suspense></ProtectedRoute>} />
              <Route path="/admin/gallery" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><AdminGallery /></Suspense></ProtectedRoute>} />
              <Route path="/admin/artists" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><AdminArtists /></Suspense></ProtectedRoute>} />
              <Route path="/admin/messages" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><AdminMessages /></Suspense></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><AdminSettings /></Suspense></ProtectedRoute>} />
            </Routes>
            <Toaster position="top-center" richColors />
          </UserAuthProvider>
        </AuthProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
