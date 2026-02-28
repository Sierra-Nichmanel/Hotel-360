
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { LanguageSelector } from "@/components/language/LanguageSelector";
import { useTranslation } from "react-i18next";
import { useNetwork } from "@/lib/network-context";
import { OfflineSettings } from "@/components/settings/OfflineSettings";

export default function Settings() {
  const { t } = useTranslation();
  const { isOnline } = useNetwork();
  
  const [darkMode, setDarkMode] = useState(
    document.documentElement.classList.contains('dark')
  );
  
  const handleDarkModeChange = (checked: boolean) => {
    setDarkMode(checked);
    if (checked) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('hospitify-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('hospitify-theme', 'light');
    }
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold tracking-tight">{t('settings.title')}</h2>
        <p className="text-muted-foreground">
          {t('settings.subtitle')}
        </p>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">{t('settings.tabs.general')}</TabsTrigger>
          <TabsTrigger value="appearance">{t('settings.tabs.appearance')}</TabsTrigger>
          <TabsTrigger value="notifications">{t('settings.tabs.notifications')}</TabsTrigger>
          <TabsTrigger value="offline">{t('settings.tabs.offline')}</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.general.title')}</CardTitle>
              <CardDescription>
                {t('settings.general.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t('settings.general.language')}</h3>
                <LanguageSelector />
              </div>
              
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-lg font-medium">{t('settings.general.hotel')}</h3>
                <div className="grid gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="hotel-name">{t('settings.general.hotelName')}</Label>
                    <Input id="hotel-name" defaultValue="Grand Hotel" />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="hotel-address">{t('settings.general.hotelAddress')}</Label>
                    <Input id="hotel-address" defaultValue="123 Main Street, New York, NY 10001" />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="hotel-phone">{t('settings.general.hotelPhone')}</Label>
                    <Input id="hotel-phone" defaultValue="+1 (555) 123-4567" />
                  </div>
                  
                  <div className="grid gap-2">
                    <Label htmlFor="hotel-email">{t('settings.general.hotelEmail')}</Label>
                    <Input id="hotel-email" type="email" defaultValue="info@grandhotel.com" />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button>{t('common.save')}</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.appearance.title')}</CardTitle>
              <CardDescription>
                {t('settings.appearance.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="dark-mode">{t('settings.appearance.darkMode')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.appearance.darkModeDescription')}
                  </p>
                </div>
                <Switch
                  id="dark-mode"
                  checked={darkMode}
                  onCheckedChange={handleDarkModeChange}
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="compact-mode">{t('settings.appearance.compactMode')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.appearance.compactModeDescription')}
                  </p>
                </div>
                <Switch id="compact-mode" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('settings.notifications.title')}</CardTitle>
              <CardDescription>
                {t('settings.notifications.description')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">
                    {t('settings.notifications.emailNotifications')}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.notifications.emailNotificationsDescription')}
                  </p>
                </div>
                <Switch id="email-notifications" defaultChecked />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="push-notifications">
                    {t('settings.notifications.pushNotifications')}
                  </Label>
                  <p className="text-sm text-muted-foreground">
                    {t('settings.notifications.pushNotificationsDescription')}
                  </p>
                </div>
                <Switch id="push-notifications" defaultChecked={isOnline} disabled={!isOnline} />
              </div>
              
              {!isOnline && (
                <p className="text-sm text-muted-foreground italic">
                  {t('settings.notifications.offlineNotice')}
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="offline" className="space-y-4">
          <OfflineSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
