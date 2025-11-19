import React, { Suspense, lazy } from 'react';
import './i18n';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './contexts/AuthContext';
import { UserAuthProvider } from './contexts/UserAuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import Header from './components/Header';
import Footer from './components/Footer';
import FloatingCallButton from './components/FloatingCallButton';
import LoadingSpinner from './components/LoadingSpinner';
import ScrollToTop from './components/ScrollToTop';
import ProtectedRoute from './components/admin/ProtectedRoute';
import './App.css';

// Lazy load public pages
const Home = lazy(() => import('./pages/Home'));
const Services = lazy(() => import('./pages/Services'));
const Gallery = lazy(() => import('./pages/Gallery'));
const Contact = lazy(() => import('./pages/Contact'));
const BookingPage = lazy(() => import('./pages/BookingPage'));
const AboutPage = lazy(() => import('./pages/AboutPage'));

// User pages
const UserLogin = lazy(() => import('./pages/UserLogin'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));

// Admin pages
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminAppointments = lazy(() => import('./pages/admin/AdminAppointments'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminServices = lazy(() => import('./pages/admin/AdminServices'));
const AdminGallery = lazy(() => import('./pages/admin/AdminGallery'));
const AdminArtists = lazy(() => import('./pages/admin/AdminArtists'));
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white">
    <LoadingSpinner size="lg" />
  </div>
);

// Public Layout wrapper
const PublicLayout = ({ children }) => (
  <>
    <Header />
    <main className="flex-grow">
      <Suspense fallback={<PageLoader />}>
        {children}
      </Suspense>
    </main>
    <Footer />
    <FloatingCallButton />
  </>
);

// Contact Layout wrapper (without footer)
const ContactLayout = ({ children }) => (
  <>
    <Header />
    <main className="flex-grow">
      <Suspense fallback={<PageLoader />}>
        {children}
      </Suspense>
    </main>
    <FloatingCallButton />
  </>
);

function App() {
  return (
    <div className="App min-h-screen flex flex-col">
      <BrowserRouter>
        <LanguageProvider>
          <AuthProvider>
            <UserAuthProvider>
              <NotificationProvider>
                <ScrollToTop />
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
                  <Route path="/services" element={<PublicLayout><Services /></PublicLayout>} />
                  <Route path="/gallery" element={<PublicLayout><Gallery /></PublicLayout>} />
                  <Route path="/about" element={<PublicLayout><AboutPage /></PublicLayout>} />
                  <Route path="/contact" element={<ContactLayout><Contact /></ContactLayout>} />
                  <Route path="/booking" element={<PublicLayout><BookingPage /></PublicLayout>} />

                  {/* User Routes */}
                  <Route path="/user/login" element={<Suspense fallback={<PageLoader />}><UserLogin /></Suspense>} />
                  <Route path="/user/dashboard" element={<Suspense fallback={<PageLoader />}><UserDashboard /></Suspense>} />

                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<Suspense fallback={<PageLoader />}><AdminLogin /></Suspense>} />
                  <Route path="/admin/dashboard" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense></ProtectedRoute>} />
                  <Route path="/admin/appointments" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><AdminAppointments /></Suspense></ProtectedRoute>} />
                  <Route path="/admin/users" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><AdminUsers /></Suspense></ProtectedRoute>} />
                  <Route path="/admin/services" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><AdminServices /></Suspense></ProtectedRoute>} />
                  <Route path="/admin/gallery" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><AdminGallery /></Suspense></ProtectedRoute>} />
                  <Route path="/admin/artists" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><AdminArtists /></Suspense></ProtectedRoute>} />
                  <Route path="/admin/messages" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><AdminMessages /></Suspense></ProtectedRoute>} />
                  <Route path="/admin/settings" element={<ProtectedRoute><Suspense fallback={<PageLoader />}><AdminSettings /></Suspense></ProtectedRoute>} />
                </Routes>
                <Toaster position="top-center" richColors />
              </NotificationProvider>
            </UserAuthProvider>
          </AuthProvider>
        </LanguageProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
