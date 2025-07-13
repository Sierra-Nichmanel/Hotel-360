
import React from 'react';
import { useLocation } from 'react-router-dom';
import { 
  Home, Users, Calendar, Hotel, Clipboard, 
  Package, Clock, BarChart2, Settings, 
  CreditCard, CoffeeIcon, Globe, Menu, UserCog
} from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { NavItem } from './NavItem';
import { useAuth } from '@/lib/auth-context';

export function SideNavigation({ open }: { open: boolean }) {
  const location = useLocation();
  const { user } = useAuth();
  
  const isAdmin = user?.role === 'admin' || user?.role === 'manager';
  
  return (
    <ScrollArea className={`h-full ${open ? '' : 'hidden'}`}>
      <div className="space-y-1 py-2">
        <NavItem 
          to="/dashboard" 
          icon={<Home className="h-4 w-4" />} 
          label="Dashboard" 
          active={location.pathname === '/dashboard'}
        />
        
        <NavItem 
          to="/rooms" 
          icon={<Hotel className="h-4 w-4" />} 
          label="Rooms" 
          active={location.pathname === '/rooms'}
        />
        
        <NavItem 
          to="/guests" 
          icon={<Users className="h-4 w-4" />} 
          label="Guests" 
          active={location.pathname === '/guests'}
        />
        
        <NavItem 
          to="/bookings" 
          icon={<Calendar className="h-4 w-4" />} 
          label="Bookings" 
          active={location.pathname === '/bookings'}
        />
        
        <NavItem 
          to="/tasks" 
          icon={<Clipboard className="h-4 w-4" />} 
          label="Tasks" 
          active={location.pathname === '/tasks'}
        />
        
        <NavItem 
          to="/inventory" 
          icon={<Package className="h-4 w-4" />} 
          label="Inventory" 
          active={location.pathname === '/inventory'}
        />
        
        <NavItem 
          to="/scheduling" 
          icon={<Clock className="h-4 w-4" />} 
          label="Scheduling" 
          active={location.pathname === '/scheduling'}
        />
        
        <NavItem 
          to="/reports" 
          icon={<BarChart2 className="h-4 w-4" />} 
          label="Reports" 
          active={location.pathname === '/reports'}
        />
        
        <NavItem 
          to="/guest-experience" 
          icon={<CoffeeIcon className="h-4 w-4" />} 
          label="Guest Experience" 
          active={location.pathname === '/guest-experience'}
        />
        
        <NavItem 
          to="/integrations" 
          icon={<Globe className="h-4 w-4" />} 
          label="Integrations" 
          active={location.pathname === '/integrations'}
        />
        
        {isAdmin && (
          <>
            <NavItem 
              to="/users" 
              icon={<UserCog className="h-4 w-4" />} 
              label="Users" 
              active={location.pathname === '/users'}
            />
            
            <NavItem 
              to="/billing" 
              icon={<CreditCard className="h-4 w-4" />} 
              label="Billing" 
              active={location.pathname === '/billing'}
            />
          </>
        )}
        
        <NavItem 
          to="/settings" 
          icon={<Settings className="h-4 w-4" />} 
          label="Settings" 
          active={location.pathname === '/settings'}
        />
      </div>
    </ScrollArea>
  );
}
