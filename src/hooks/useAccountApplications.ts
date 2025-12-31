import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AccountApplication, AccountApplicationInsert, RefereeInsert } from '@/types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const useAccountApplications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: applications, isLoading, error } = useQuery({
    queryKey: ['account-applications', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('account_applications')
        .select('*, referees(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as (AccountApplication & { referees: any[] })[];
    },
    enabled: !!user,
  });

  const createApplication = useMutation({
    mutationFn: async ({ 
      application, 
      referees 
    }: { 
      application: Omit<AccountApplicationInsert, 'user_id' | 'application_number'>; 
      referees: Omit<RefereeInsert, 'account_application_id'>[];
    }) => {
      if (!user) throw new Error('Not authenticated');

      // Generate application number
      const year = new Date().getFullYear();
      const randomNum = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
      const applicationNumber = `ACC${year}-${randomNum}`;

      // Create application
      const { data: newApp, error: appError } = await supabase
        .from('account_applications')
        .insert({
          ...application,
          user_id: user.id,
          application_number: applicationNumber,
        })
        .select()
        .single();

      if (appError) throw appError;

      // Add referees
      if (referees.length > 0) {
        const refereesWithAppId = referees.map(ref => ({
          ...ref,
          account_application_id: newApp.id,
        }));

        const { error: refError } = await supabase
          .from('referees')
          .insert(refereesWithAppId);

        if (refError) throw refError;
      }

      return newApp;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['account-applications'] });
      toast.success('Account application submitted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit application');
    },
  });

  return {
    applications: applications || [],
    isLoading,
    error,
    createApplication,
  };
};

// Hook for operations admin to fetch all account applications
export const useAdminAccountApplications = () => {
  const { adminRole } = useAuth();
  const queryClient = useQueryClient();

  const { data: applications, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-account-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('account_applications')
        .select('*, referees(*), profiles!account_applications_user_id_fkey(full_name, email, phone)')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!adminRole && ['operations', 'md'].includes(adminRole),
  });

  const updateApplicationStatus = useMutation({
    mutationFn: async ({ 
      id, 
      status, 
      notes 
    }: { 
      id: string; 
      status: 'approved' | 'declined' | 'further_review';
      notes?: string;
    }) => {
      const { data: updated, error } = await supabase
        .from('account_applications')
        .update({
          status,
          notes,
          reviewed_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-account-applications'] });
      toast.success('Application updated');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update application');
    },
  });

  return {
    applications: applications || [],
    isLoading,
    error,
    refetch,
    updateApplicationStatus,
  };
};
