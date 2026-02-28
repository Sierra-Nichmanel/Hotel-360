
import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth-context';
import { SideNavigation } from './SideNavigation';
import { Header } from './Header';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { LanguageProvider } from '@/lib/i18n/language-context';

// Simple error boundary component
const ErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error("Runtime error detected:", event.error);
      setHasError(true);
      // Prevent the error from bubbling up and crashing the app
      event.preventDefault();
    };

    window.addEventListener('error', handleError);
    return () => window.removeEventListener('error', handleError);
  }, []);

  if (hasError) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Something went wrong</h2>
        <p className="mb-4 text-muted-foreground">There was an error loading this page.</p>
        <button 
          onClick={() => {
            setHasError(false);
            window.location.href = '/dashboard';
          }}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md"
        >
          Try again
        </button>
      </div>
    );
  }

  return <>{children}</>;
};

export function AppLayout() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  
  const toggleSidebar = () => {
    setSidebarOpen(prev => !prev);
  };
  
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth');
    }
  }, [isAuthenticated, navigate]);
  
  return (
    <LanguageProvider>
      <div className="min-h-screen flex bg-background">
        <SideNavigation open={sidebarOpen} />
        <div className={cn(
          "flex-1 flex flex-col transition-all duration-300 ease-in-out",
          !isMobile && "ml-16 lg:ml-64",
        )}>
          <Header toggleSidebar={toggleSidebar} />
          <main className="flex-1 overflow-auto p-4 sm:p-6">
            <ErrorBoundary>
              <Outlet />
            </ErrorBoundary>
          </main>
        </div>
      </div>
    </LanguageProvider>
  );
}
