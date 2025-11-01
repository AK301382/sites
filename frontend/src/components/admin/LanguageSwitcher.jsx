import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Globe } from 'lucide-react';

const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const currentLang = i18n.language;
    const newLang = currentLang === 'de' ? 'en' : 'de';
    i18n.changeLanguage(newLang);
    localStorage.setItem('adminLanguage', newLang);
  };

  const getCurrentLanguageName = () => {
    return i18n.language === 'de' ? 'Deutsch' : 'English';
  };

  return (
    <Button
      onClick={toggleLanguage}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      <Globe className="h-4 w-4" />
      <span>{getCurrentLanguageName()}</span>
    </Button>
  );
};

export default LanguageSwitcher;
