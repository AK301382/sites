import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, EyeOff, Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const UserLogin = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('common');
  const { isAuthenticated, processSessionId, loginWithGoogle, loginWithEmail, registerWithEmail } = useUserAuth();
  const [processing, setProcessing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  
  // Login form state
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  
  // Register form state
  const [registerForm, setRegisterForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const languages = [
    { code: 'de', name: 'Deutsch' },
    { code: 'en', name: 'English' },
    { code: 'fr', name: 'Français' },
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    // If already authenticated, redirect to dashboard
    if (isAuthenticated) {
      navigate('/user/dashboard');
      return;
    }

    // Check for session_id in URL fragment (Google OAuth callback)
    const hash = window.location.hash;
    if (hash && hash.includes('session_id=')) {
      const sessionId = hash.split('session_id=')[1].split('&')[0];
      
      if (sessionId) {
        setProcessing(true);
        
        processSessionId(sessionId).then((success) => {
          if (success) {
            navigate('/user/dashboard');
          } else {
            setProcessing(false);
            setError('Authentication failed. Please try again.');
          }
        });
      }
    }
  }, [isAuthenticated, processSessionId, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setProcessing(true);
    
    try {
      const success = await loginWithEmail(loginForm.email, loginForm.password);
      if (success) {
        navigate('/user/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (registerForm.password !== registerForm.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (registerForm.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setProcessing(true);
    
    try {
      const success = await registerWithEmail(
        registerForm.email,
        registerForm.password,
        registerForm.name
      );
      
      if (success) {
        navigate('/user/dashboard');
      } else {
        setError('Registration failed. Please try again.');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (processing && window.location.hash.includes('session_id')) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#F8E6E9] to-white">
        <Card className="max-w-md w-full mx-4">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 border-4 border-[#F4C2C2] border-t-[#D4AF76] rounded-full animate-spin mx-auto mb-4"></div>
            <h2 className="text-2xl font-bold text-[#8B6F8E] mb-2">Authenticating...</h2>
            <p className="text-gray-600">Please wait while we log you in.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#F8E6E9] to-white py-12 px-4">
      <Card className="max-w-md w-full border-2 border-[#F8E6E9] shadow-xl relative">
        {/* Language Switcher */}
        <div className="absolute top-4 right-4 z-10">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="text-[#8B6F8E]">
                <Globe className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {languages.map((lang) => (
                <DropdownMenuItem
                  key={lang.code}
                  onClick={() => changeLanguage(lang.code)}
                  className={i18n.language === lang.code ? 'bg-[#F8E6E9]' : ''}
                >
                  {lang.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <CardContent className="p-8">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold text-[#8B6F8E] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
              {t('auth.welcomeBack')}
            </h1>
            <p className="text-gray-600">{t('auth.loginSubtitle')}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
              {error}
            </div>
          )}

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">{t('auth.login')}</TabsTrigger>
              <TabsTrigger value="register">{t('auth.register')}</TabsTrigger>
            </TabsList>

            {/* Login Tab */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-email">{t('auth.email')}</Label>
                  <Input
                    id="login-email"
                    type="email"
                    placeholder={t('auth.emailPlaceholder')}
                    value={loginForm.email}
                    onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                    required
                    data-testid="login-email-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="login-password">{t('auth.password')}</Label>
                  <div className="relative">
                    <Input
                      id="login-password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder={t('auth.passwordPlaceholder')}
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                      data-testid="login-password-input"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-gradient-to-r from-[#F4C2C2] to-[#D4AF76] hover:opacity-90 text-white rounded-full py-6"
                  data-testid="login-submit-button"
                >
                  {processing ? `${t('auth.loginButton')}...` : t('auth.loginButton')}
                </Button>
              </form>
            </TabsContent>

            {/* Register Tab */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="register-name">{t('auth.name')}</Label>
                  <Input
                    id="register-name"
                    type="text"
                    placeholder={t('auth.namePlaceholder')}
                    value={registerForm.name}
                    onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                    required
                    data-testid="register-name-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-email">{t('auth.email')}</Label>
                  <Input
                    id="register-email"
                    type="email"
                    placeholder={t('auth.emailPlaceholder')}
                    value={registerForm.email}
                    onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                    required
                    data-testid="register-email-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-password">{t('auth.password')}</Label>
                  <Input
                    id="register-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('auth.passwordPlaceholder')}
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    required
                    minLength={6}
                    data-testid="register-password-input"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="register-confirm-password">{t('auth.password')}</Label>
                  <Input
                    id="register-confirm-password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder={t('auth.passwordPlaceholder')}
                    value={registerForm.confirmPassword}
                    onChange={(e) => setRegisterForm({ ...registerForm, confirmPassword: e.target.value })}
                    required
                    minLength={6}
                    data-testid="register-confirm-password-input"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={processing}
                  className="w-full bg-gradient-to-r from-[#F4C2C2] to-[#D4AF76] hover:opacity-90 text-white rounded-full py-6"
                  data-testid="register-submit-button"
                >
                  {processing ? `${t('auth.registerButton')}...` : t('auth.registerButton')}
                </Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="relative my-6">
            <Separator />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-3 text-sm text-gray-500">
              {t('auth.or')}
            </span>
          </div>

          {/* Google OAuth Button */}
          <Button
            onClick={loginWithGoogle}
            disabled={processing}
            className="w-full bg-white hover:bg-gray-50 text-gray-800 border-2 border-gray-300 rounded-full py-6 text-lg font-medium flex items-center justify-center gap-3"
            data-testid="google-login-button"
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {t('auth.continueWithGoogle')}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserLogin;