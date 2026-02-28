
import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/language-context';
import { Locale, localeNames } from '@/lib/i18n/translations';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface LanguageSelectorProps {
  variant?: 'default' | 'outline' | 'ghost' | 'secondary';
  size?: 'default' | 'sm' | 'lg';
  showLabel?: boolean;
}

export function LanguageSelector() {
  const { locale, setLocale, t } = useLanguage();
  const { toast } = useToast();
  const currentLanguage = localeNames[locale];

  const handleChangeLanguage = (newLocale: Locale) => {
    if (newLocale !== locale) {
      setLocale(newLocale);
      toast({
        title: t('common.notification'),
        description: `Language changed to ${localeNames[newLocale]}`,
        duration: 3000,
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-1">
          <Globe className="h-4 w-4" />
          <span className="text-xs uppercase">{currentLanguage}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {(Object.keys(localeNames) as Locale[]).map((lang) => (
          <DropdownMenuItem 
            key={lang}
            onClick={() => handleChangeLanguage(lang)}
            className={lang === locale ? "bg-accent font-medium" : ""}
          >
            {localeNames[lang]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
