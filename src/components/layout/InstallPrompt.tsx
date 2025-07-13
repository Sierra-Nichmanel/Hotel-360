
import { useState, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, X } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(localStorage.getItem('pwa_install_dismissed') === 'true');

  useEffect(() => {
    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      // Show the prompt if not previously dismissed
      if (localStorage.getItem('pwa_install_dismissed') !== 'true') {
        setShowPrompt(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) {
      return;
    }

    // Show the install prompt
    deferredPrompt.prompt();

    // Wait for the user to respond to the prompt
    const choiceResult = await deferredPrompt.userChoice;
    
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    // Clear the deferredPrompt variable
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    localStorage.setItem('pwa_install_dismissed', 'true');
  };

  if (!showPrompt || dismissed) {
    return null;
  }

  return (
    <div className="fixed bottom-12 left-4 right-4 z-50 md:left-auto md:right-4 md:w-96">
      <Card className="shadow-lg">
        <CardContent className="p-4">
          <div className="flex justify-between items-start">
            <div className="flex-1 pr-4">
              <h4 className="font-semibold text-lg">Install Hospitify 360</h4>
              <p className="text-muted-foreground text-sm mt-1">
                Install this app on your device for offline access and improved performance.
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={handleDismiss} className="mt-0">
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex justify-end mt-4">
            <Button variant="default" onClick={handleInstall} className="flex items-center">
              <Download className="mr-2 h-4 w-4" />
              Install App
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
