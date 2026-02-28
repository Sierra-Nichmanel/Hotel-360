import React from 'react';
import { Menu, UserCircle } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { LanguageSelector } from '@/components/language/LanguageSelector';
import { NotificationBell } from '@/components/notifications/NotificationSystem';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth-context';
import { useLanguage } from '@/lib/i18n/language-context';

interface HeaderProps {
  toggleSidebar: () => void;
}

export function Header({ toggleSidebar }: HeaderProps) {
  const isMobile = useIsMobile();
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  
  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full bg-background border-b">
      <div className="flex flex-1 items-center justify-between px-4">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={toggleSidebar}>
            <Menu className="h-5 w-5" />
            <span className="sr-only">{t("Toggle menu")}</span>
          </Button>
        )}
        
        <div className="flex-1" />
        
        <div className="flex items-center gap-2">
          <LanguageSelector />
          
          <NotificationBell />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="rounded-full">
                <UserCircle className="h-6 w-6" />
                <span className="sr-only">{t("User menu")}</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {user ? user.name : t("My Account")}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => window.location.href = "/settings"}>
                {t("Settings")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                {t("Sign out")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
