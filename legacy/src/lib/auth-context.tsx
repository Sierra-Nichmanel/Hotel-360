import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '../hooks/use-toast';
import { useNetwork } from './network-context';
import { 
  SupabaseStaff, 
  signInWithEmailPassword, 
  checkAuthentication, 
  logout as supabaseLogout 
} from './supabase-client';

interface AuthContextType {
  user: SupabaseStaff | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SupabaseStaff | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isOnline, checkConnection } = useNetwork();

  useEffect(() => {
    checkAuth().finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (isOnline && user) {
      verifySession();
    }
  }, [isOnline]);

  const verifySession = async () => {
    try {
      const result = await checkAuthentication();
      
      if (!result.success) {
        toast({
          title: "Session expired",
          description: "Your session is no longer valid. Please log in again.",
          variant: "destructive",
        });
        logout();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Session verification error:', error);
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      if (!isOnline) {
        const connectionCheck = await checkConnection();
        if (!connectionCheck) {
          toast({
            title: "Cannot log in",
            description: "Internet connection required to log in",
            variant: "destructive",
          });
          return false;
        }
      }
      
      console.log('Attempting login for email:', email);
      
      const result = await signInWithEmailPassword(email, password);

      if (!result.success) {
        console.log('Authentication failed:', result.message);
        toast({
          title: "Authentication failed",
          description: result.message || "Invalid credentials",
          variant: "destructive",
        });
        return false;
      }
      
      if (result.user) {
        setUser(result.user as SupabaseStaff);
        
        toast({
          title: "Authentication successful",
          description: `Welcome back, ${result.user.name}!`,
        });
        
        return true;
      } else {
        toast({
          title: "Authentication error",
          description: "User data could not be retrieved",
          variant: "destructive",
        });
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Authentication failed",
        description: "An unexpected error occurred",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    supabaseLogout();
    setUser(null);
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
  };

  const checkAuth = async (): Promise<boolean> => {
    try {
      const result = await checkAuthentication();
      
      if (result.success && result.user) {
        setUser(result.user);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Authentication check error:', error);
      return false;
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    checkAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
