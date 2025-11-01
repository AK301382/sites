import React, { useCallback, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Globe, Menu, X, User, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { useUserAuth } from '@/contexts/UserAuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';

const Header = () => {
  const { t, i18n } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { user, isAuthenticated, logout } = useUserAuth();
  
  const isHomePage = location.pathname === '/';

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const changeLanguage = useCallback((lng) => {
    i18n.changeLanguage(lng);
  }, [i18n]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const languages = useMemo(() => [
    { code: 'de', name: 'Deutsch' },
    { code: 'fr', name: 'Français' },
    { code: 'en', name: 'English' },
  ], []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 rounded-b-3xl ${
      isScrolled || !isHomePage 
        ? 'bg-white/95 backdrop-blur-sm shadow-lg' 
        : 'bg-transparent'
    }`}>
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center" data-testid="logo-link">
            <h1 className={`text-xl font-bold transition-colors ${
              isScrolled || !isHomePage
                ? 'bg-gradient-to-r from-[#F4C2C2] via-[#D4AF76] to-[#8B6F8E] bg-clip-text text-transparent' 
                : 'text-white drop-shadow-lg'
            }`} style={{ fontFamily: 'Playfair Display, serif' }}>
              Fabulous Nails & Spa
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/" className={`transition-colors ${
              isScrolled || !isHomePage 
                ? 'text-[#3E3E3E] hover:text-[#8B6F8E]' 
                : 'text-white hover:text-[#F4C2C2]'
            }`} data-testid="nav-home">
              {t('nav.home')}
            </Link>
            <Link to="/services" className={`transition-colors ${
              isScrolled || !isHomePage 
                ? 'text-[#3E3E3E] hover:text-[#8B6F8E]' 
                : 'text-white hover:text-[#F4C2C2]'
            }`} data-testid="nav-services">
              {t('nav.services')}
            </Link>
            <Link to="/gallery" className={`transition-colors ${
              isScrolled || !isHomePage 
                ? 'text-[#3E3E3E] hover:text-[#8B6F8E]' 
                : 'text-white hover:text-[#F4C2C2]'
            }`} data-testid="nav-gallery">
              {t('nav.gallery')}
            </Link>
            <Link to="/about" className={`transition-colors ${
              isScrolled || !isHomePage 
                ? 'text-[#3E3E3E] hover:text-[#8B6F8E]' 
                : 'text-white hover:text-[#F4C2C2]'
            }`} data-testid="nav-about">
              {t('nav.about')}
            </Link>
            <Link to="/contact" className={`transition-colors ${
              isScrolled || !isHomePage 
                ? 'text-[#3E3E3E] hover:text-[#8B6F8E]' 
                : 'text-white hover:text-[#F4C2C2]'
            }`} data-testid="nav-contact">
              {t('nav.contact')}
            </Link>
            <Link to="/booking" data-testid="nav-booking">
              <Button className="bg-gradient-to-r from-[#F4C2C2] to-[#D4AF76] hover:opacity-90 text-white rounded-full px-6">
                {t('nav.booking')}
              </Button>
            </Link>
            
            {/* Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="language-switcher" className={
                  isScrolled || !isHomePage 
                    ? 'text-[#3E3E3E]' 
                    : 'text-white'
                }>
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent data-testid="language-menu">
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    data-testid={`lang-${lang.code}`}
                    className={i18n.language === lang.code ? 'bg-[#F8E6E9]' : ''}
                  >
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* User Menu / Login Button */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full" data-testid="user-menu-trigger">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.profile_picture} alt={user.name} />
                      <AvatarFallback className="bg-gradient-to-r from-[#F4C2C2] to-[#D4AF76] text-white">
                        {user.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56" data-testid="user-menu">
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate('/user/dashboard')} data-testid="user-dashboard-link">
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} data-testid="user-logout-button">
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/user/login">
                <Button 
                  variant="outline" 
                  className={`rounded-full ${
                    isScrolled || !isHomePage
                      ? 'border-[#8B6F8E] text-[#8B6F8E] hover:bg-[#8B6F8E] hover:text-white'
                      : 'border-white text-white hover:bg-white hover:text-[#8B6F8E]'
                  }`}
                  data-testid="login-button"
                >
                  <User className="mr-2 h-4 w-4" />
                  Login
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            {/* Mobile Language Switcher */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="mobile-language-switcher" className={
                  isScrolled || !isHomePage 
                    ? 'text-[#3E3E3E]' 
                    : 'text-white'
                }>
                  <Globe className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {languages.map((lang) => (
                  <DropdownMenuItem
                    key={lang.code}
                    onClick={() => changeLanguage(lang.code)}
                    data-testid={`mobile-lang-${lang.code}`}
                  >
                    {lang.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile User Button */}
            {isAuthenticated && user ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/user/dashboard')}
                className={isScrolled || !isHomePage ? 'text-[#3E3E3E]' : 'text-white'}
                data-testid="mobile-user-button"
              >
                <User className="h-5 w-5" />
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate('/user/login')}
                className={isScrolled || !isHomePage ? 'text-[#3E3E3E]' : 'text-white'}
                data-testid="mobile-login-button"
              >
                <User className="h-5 w-5" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="mobile-menu-button"
              className={
                isScrolled || !isHomePage 
                  ? 'text-[#3E3E3E]' 
                  : 'text-white'
              }
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 bg-white/95 backdrop-blur-sm" data-testid="mobile-menu">
            <div className="flex flex-col space-y-4">
              {isAuthenticated && user && (
                <>
                  <div className="px-2 py-3 border-b border-gray-200">
                    <p className="font-medium text-sm text-gray-900">{user.name}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>
                  <Link
                    to="/user/dashboard"
                    className="text-[#3E3E3E] hover:text-[#8B6F8E] transition-colors flex items-center"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <User className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </>
              )}
              <Link
                to="/"
                className="text-[#3E3E3E] hover:text-[#8B6F8E] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
                data-testid="mobile-nav-home"
              >
                {t('nav.home')}
              </Link>
              <Link
                to="/services"
                className="text-[#3E3E3E] hover:text-[#8B6F8E] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
                data-testid="mobile-nav-services"
              >
                {t('nav.services')}
              </Link>
              <Link
                to="/gallery"
                className="text-[#3E3E3E] hover:text-[#8B6F8E] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
                data-testid="mobile-nav-gallery"
              >
                {t('nav.gallery')}
              </Link>
              <Link
                to="/about"
                className="text-[#3E3E3E] hover:text-[#8B6F8E] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
                data-testid="mobile-nav-about"
              >
                {t('nav.about')}
              </Link>
              <Link
                to="/contact"
                className="text-[#3E3E3E] hover:text-[#8B6F8E] transition-colors"
                onClick={() => setMobileMenuOpen(false)}
                data-testid="mobile-nav-contact"
              >
                {t('nav.contact')}
              </Link>
              <Link
                to="/booking"
                onClick={() => setMobileMenuOpen(false)}
                data-testid="mobile-nav-booking"
              >
                <Button className="bg-gradient-to-r from-[#F4C2C2] to-[#D4AF76] hover:opacity-90 text-white rounded-full w-full">
                  {t('nav.booking')}
                </Button>
              </Link>
              {isAuthenticated && user && (
                <Button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  variant="outline"
                  className="w-full border-red-300 text-red-600 hover:bg-red-50"
                  data-testid="mobile-logout-button"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </Button>
              )}
              {!isAuthenticated && (
                <Link to="/user/login" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full border-[#8B6F8E] text-[#8B6F8E]">
                    <User className="mr-2 h-4 w-4" />
                    Login
                  </Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
