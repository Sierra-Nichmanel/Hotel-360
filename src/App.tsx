
import { Routes, Route } from 'react-router-dom';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import { ThemeProvider } from '@/components/theme-provider';
import { AppLayout } from '@/components/layout/AppLayout';
import { OfflineBanner } from '@/components/layout/OfflineBanner';
import { InstallPrompt } from '@/components/layout/InstallPrompt';
import Dashboard from '@/pages/Dashboard';
import Rooms from '@/pages/Rooms';
import Guests from '@/pages/Guests';
import Bookings from '@/pages/Bookings';
import Tasks from '@/pages/Tasks';
import Inventory from '@/pages/Inventory';
import Scheduling from '@/pages/Scheduling';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';
import Users from '@/pages/Users';
import Billing from '@/pages/Billing';
import GuestExperience from '@/pages/GuestExperience';
import Integrations from '@/pages/Integrations';
import { GuestPortal } from '@/components/guest-experience/GuestPortal';
import { GuestBookingPortal } from '@/components/booking/GuestBookingPortal';
import Auth from '@/pages/Auth';
import NotFound from '@/pages/NotFound';
import { AuthProvider } from '@/lib/auth-context';
import { NetworkProvider } from '@/lib/network-context';
import { Index } from '@/pages/Index';
import './App.css';

function App() {
  console.log("App component rendering");
  
  return (
    <ThemeProvider defaultTheme="system" storageKey="hospitify-theme">
      <TooltipProvider>
        <NetworkProvider>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/guest-portal" element={<GuestPortal />} />
              <Route path="/booking" element={<GuestBookingPortal />} />
              <Route path="/auth" element={<Auth />} />
              <Route element={<AppLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/rooms" element={<Rooms />} />
                <Route path="/guests" element={<Guests />} />
                <Route path="/bookings" element={<Bookings />} />
                <Route path="/tasks" element={<Tasks />} />
                <Route path="/inventory" element={<Inventory />} />
                <Route path="/scheduling" element={<Scheduling />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/guest-experience" element={<GuestExperience />} />
                <Route path="/integrations" element={<Integrations />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/users" element={<Users />} />
                <Route path="/billing" element={<Billing />} />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
            <OfflineBanner />
            <InstallPrompt />
            <Toaster />
          </AuthProvider>
        </NetworkProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;
