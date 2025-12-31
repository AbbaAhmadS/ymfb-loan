import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

// Admin credentials as per the document
const ADMIN_CREDENTIALS: Record<string, { password: string; role: 'credit' | 'audit' | 'coo' | 'operations' | 'md'; name: string }> = {
  '08012345678': { password: 'Admin340261h', role: 'credit', name: 'Credit Department' },
  '08012345677': { password: 'Admin718392m', role: 'audit', name: 'Internal Audit' },
  '08012345676': { password: 'Admin2049318w', role: 'coo', name: 'Chief Operations Officer' },
  '08012345675': { password: 'Admin1093564j', role: 'operations', name: 'Operations Department' },
  '08012345674': { password: 'Admin7701345a', role: 'md', name: 'Managing Director' },
};

export type AppRole = 'credit' | 'audit' | 'coo' | 'operations' | 'md';

interface Profile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  adminRole: AppRole | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (emailOrPhone: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginAdmin: (phone: string, password: string) => Promise<{ success: boolean; error?: string; locked?: boolean }>;
  signup: (name: string, phone: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  resetPassword: (phone: string, email: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [adminRole, setAdminRole] = useState<AppRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAdmin = adminRole !== null;

  // Fetch user profile
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }
      return data as Profile | null;
    } catch (err) {
      console.error('Error in fetchProfile:', err);
      return null;
    }
  };

  // Check admin role
  const checkAdminRole = async (userId: string): Promise<AppRole | null> => {
    try {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .maybeSingle();

      if (error || !data) {
        return null;
      }
      return data.role as AppRole;
    } catch (err) {
      console.error('Error checking admin role:', err);
      return null;
    }
  };

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Defer profile and role fetches
          setTimeout(async () => {
            const profileData = await fetchProfile(session.user.id);
            setProfile(profileData);
            
            const role = await checkAdminRole(session.user.id);
            setAdminRole(role);
          }, 0);
        } else {
          setProfile(null);
          setAdminRole(null);
        }
      }
    );

    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        fetchProfile(session.user.id).then(setProfile);
        checkAdminRole(session.user.id).then(setAdminRole);
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (emailOrPhone: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      // Determine if input is email or phone
      const isEmail = emailOrPhone.includes('@');
      
      let email = emailOrPhone;
      
      if (!isEmail) {
        // Find user by phone from profiles
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('email')
          .eq('phone', emailOrPhone)
          .maybeSingle();

        if (profileError || !profileData) {
          return { success: false, error: 'Invalid credentials' };
        }
        email = profileData.email;
      }

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      console.error('Login error:', err);
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const loginAdmin = async (phone: string, password: string): Promise<{ success: boolean; error?: string; locked?: boolean }> => {
    setIsLoading(true);
    try {
      // Check lockout status
      const { data: attemptData } = await supabase
        .from('admin_login_attempts')
        .select('*')
        .eq('phone', phone)
        .maybeSingle();

      if (attemptData) {
        // Check if locked
        if (attemptData.locked_until && new Date(attemptData.locked_until) > new Date()) {
          return { success: false, error: 'Account locked. Contact developer.', locked: true };
        }
        
        // Check if 6 or more failed attempts
        if (attemptData.failed_attempts >= 6) {
          return { success: false, error: 'Account locked. Contact developer.', locked: true };
        }
      }

      // Validate against preset admin credentials
      const adminCred = ADMIN_CREDENTIALS[phone];
      if (!adminCred || adminCred.password !== password) {
        // Record failed attempt
        if (attemptData) {
          await supabase
            .from('admin_login_attempts')
            .update({ 
              failed_attempts: attemptData.failed_attempts + 1,
              last_attempt_at: new Date().toISOString()
            })
            .eq('phone', phone);
        } else {
          await supabase
            .from('admin_login_attempts')
            .insert({ phone, failed_attempts: 1 });
        }

        const remainingAttempts = attemptData ? 6 - (attemptData.failed_attempts + 1) : 5;
        
        if (remainingAttempts <= 0) {
          return { success: false, error: 'Account locked. Contact developer.', locked: true };
        }
        
        return { success: false, error: `Invalid credentials. ${remainingAttempts} attempts remaining.` };
      }

      // Check if admin user exists in auth
      const adminEmail = `${adminCred.role}@ymfb.admin`;
      
      // Try to sign in
      let { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
        email: adminEmail,
        password: adminCred.password,
      });

      // If user doesn't exist, create them
      if (signInError?.message?.includes('Invalid login credentials')) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: adminEmail,
          password: adminCred.password,
          options: {
            data: {
              full_name: adminCred.name,
              phone: phone,
            }
          }
        });

        if (signUpError) {
          return { success: false, error: signUpError.message };
        }

        // Add role to user_roles table
        if (signUpData.user) {
          await supabase.from('user_roles').insert({
            user_id: signUpData.user.id,
            role: adminCred.role,
            phone: phone,
          });
        }

        // Sign in after signup
        const { error: finalSignInError } = await supabase.auth.signInWithPassword({
          email: adminEmail,
          password: adminCred.password,
        });

        if (finalSignInError) {
          return { success: false, error: finalSignInError.message };
        }
      } else if (signInError) {
        return { success: false, error: signInError.message };
      }

      // Reset failed attempts on successful login
      if (attemptData) {
        await supabase
          .from('admin_login_attempts')
          .update({ failed_attempts: 0, locked_until: null })
          .eq('phone', phone);
      }

      return { success: true };
    } catch (err) {
      console.error('Admin login error:', err);
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (name: string, phone: string, email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const redirectUrl = `${window.location.origin}/`;
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: name,
            phone: phone,
          }
        }
      });

      if (error) {
        if (error.message.includes('already registered')) {
          return { success: false, error: 'An account with this email already exists' };
        }
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      console.error('Signup error:', err);
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setAdminRole(null);
  };

  const resetPassword = async (phone: string, email: string, newPassword: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      // Verify phone and email match
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('phone', phone)
        .eq('email', email)
        .maybeSingle();

      if (profileError || !profileData) {
        return { success: false, error: 'No account found with this phone and email combination' };
      }

      // Update password using admin API would be needed here
      // For now, we'll use the standard flow
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) {
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (err) {
      console.error('Reset password error:', err);
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      session,
      profile,
      adminRole,
      isLoading, 
      isAdmin,
      login, 
      loginAdmin, 
      signup, 
      logout, 
      resetPassword 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
