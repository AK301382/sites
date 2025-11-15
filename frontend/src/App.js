import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Providers } from "./app/providers";
import { AuthProvider } from "./contexts/AuthContext";
 
import ErrorBoundary from "./components/common/ErrorBoundary";
import { Header, Footer } from "./components/layout";
import { Toaster } from "./components/ui/sonner";

// Pages
import HomePage from "./features/portfolio/pages/HomePage";
import ServicesPage from "./features/services/pages/ServicesPage";
import ServiceDetailPage from "./features/services/pages/ServiceDetailPage";
import PortfolioPage from "./features/portfolio/pages/PortfolioPage";
import ContactPage from "./features/contact/pages/ContactPage";
import AboutUs from "./features/portfolio/pages/AboutUs";
import YourSitePage from "./features/services/pages/YourSitePage";

// Admin Pages
import AdminLogin from "./features/admin/pages/AdminLogin";
import AdminDashboard from "./features/admin/pages/AdminDashboard";
import AdminContacts from "./features/admin/pages/AdminContacts";
import AdminNewsletter from "./features/admin/pages/AdminNewsletter";
import AdminBlog from "./features/admin/pages/AdminBlog";
import AdminPortfolio from "./features/admin/pages/AdminPortfolio";
import ProtectedRoute from "./components/admin/ProtectedRoute";
// Customer & Account Pages
import { 
  CustomerRegistration, 
  CustomerLogin, 
  CustomerDashboard 
} from "./features/customers";
import { AccountManagement } from "./features/accounts";

function App() {
  return (
    <Providers>
      <AuthProvider>
        {/* ThemeProvider is now included in Providers component */}
        <ErrorBoundary>
            <div className="App">
              <BrowserRouter>
              <Routes>
              {/* Public Routes */}
              <Route path="/" element={
                <>
                  <Header />
                  <main><HomePage /></main>
                  <Footer />
                </>
              } />
              <Route path="/services" element={
                <>
                  <Header />
                  <main><ServicesPage /></main>
                  <Footer />
                </>
              } />
              <Route path="/services/:slug" element={
                <>
                  <Header />
                  <main><ServiceDetailPage /></main>
                  <Footer />
                </>
              } />
              <Route path="/portfolio" element={
                <>
                  <Header />
                  <main><PortfolioPage /></main>
                  <Footer />
                </>
              } />
              <Route path="/contact" element={
                <>
                  <Header />
                  <main><ContactPage /></main>
                  <Footer />
                </>
              } />
              <Route path="/about" element={
                <>
                  <Header />
                  <main><AboutUs /></main>
                  <Footer />
                </>
              } />
              <Route path="/your-site" element={
                <>
                  <Header />
                  <main><YourSitePage /></main>
                  <Footer />
                </>
              } />

              {/* Admin Routes */}
              <Route path="/admin" element={<AdminLogin />} />
              <Route path="/admin/dashboard" element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/contacts" element={
                <ProtectedRoute>
                  <AdminContacts />
                </ProtectedRoute>
              } />
              <Route path="/admin/newsletter" element={
                <ProtectedRoute>
                  <AdminNewsletter />
                </ProtectedRoute>
              } />
              <Route path="/admin/blog" element={
                <ProtectedRoute>
                  <AdminBlog />
                </ProtectedRoute>
              } />
              <Route path="/admin/portfolio" element={
                <ProtectedRoute>
                  <AdminPortfolio />
                </ProtectedRoute>
              } />

              {/* Customer Routes */}
              <Route path="/customer/register" element={<CustomerRegistration />} />
              <Route path="/customer/login" element={<CustomerLogin />} />
              <Route path="/customer/dashboard" element={<CustomerDashboard />} />
              <Route path="/customer/accounts" element={<AccountManagement />} />
              </Routes>
              <Toaster />
            </BrowserRouter>
          </div>
        </ErrorBoundary>
        {/* ThemeProvider closing tag removed */}
      </AuthProvider>
    </Providers>
  );
}

export default App;