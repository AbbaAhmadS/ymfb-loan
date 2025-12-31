import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LoanApplication, LoanApplicationInsert, GuarantorInsert } from '@/types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const useLoanApplications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: applications, isLoading, error } = useQuery({
    queryKey: ['loan-applications', user?.id],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('loan_applications')
        .select('*, guarantors(*)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as (LoanApplication & { guarantors: any[] })[];
    },
    enabled: !!user,
  });

  const createApplication = useMutation({
    mutationFn: async (data: Omit<LoanApplicationInsert, 'user_id' | 'application_number'>) => {
      if (!user) throw new Error('Not authenticated');

      // Generate application number
      const year = new Date().getFullYear();
      const randomNum = Math.floor(Math.random() * 999999).toString().padStart(6, '0');
      const applicationNumber = `YMFB${year}-${randomNum}`;

      const { data: newApp, error } = await supabase
        .from('loan_applications')
        .insert({
          ...data,
          user_id: user.id,
          application_number: applicationNumber,
        })
        .select()
        .single();

      if (error) throw error;
      return newApp;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loan-applications'] });
      toast.success('Application created successfully');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create application');
    },
  });

  const updateApplication = useMutation({
    mutationFn: async ({ id, ...data }: Partial<LoanApplication> & { id: string }) => {
      const { data: updated, error } = await supabase
        .from('loan_applications')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loan-applications'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to update application');
    },
  });

  const submitApplication = useMutation({
    mutationFn: async (id: string) => {
      const { data: updated, error } = await supabase
        .from('loan_applications')
        .update({
          status: 'submitted',
          submitted_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loan-applications'] });
      toast.success('Application submitted successfully!');
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to submit application');
    },
  });

  const addGuarantor = useMutation({
    mutationFn: async (data: GuarantorInsert) => {
      const { data: guarantor, error } = await supabase
        .from('guarantors')
        .insert(data)
        .select()
        .single();

      if (error) throw error;
      return guarantor;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['loan-applications'] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to add guarantor');
    },
  });

  return {
    applications: applications || [],
    isLoading,
    error,
    createApplication,
    updateApplication,
    submitApplication,
    addGuarantor,
  };
};

// Hook for admin to fetch all applications
export const useAdminLoanApplications = () => {
  const { adminRole } = useAuth();
  const queryClient = useQueryClient();

  const { data: applications, isLoading, error, refetch } = useQuery({
    queryKey: ['admin-loan-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('loan_applications')
        .select('*, guarantors(*), profiles!loan_applications_user_id_fkey(full_name, email, phone)')
        .neq('status', 'draft')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!adminRole && ['credit', 'audit', 'coo', 'md'].includes(adminRole),
  });

  const updateApplicationStatus = useMutation({
    mutationFn: async ({ 
      id, 
      action, 
      notes,
      declineReason,
      approvedAmount 
    }: { 
      id: string; 
      action: 'approve' | 'decline' | 'further_review';
      notes?: string;
      declineReason?: string;
      approvedAmount?: number;
    }) => {
      const updates: any = {};
      
      if (adminRole === 'credit') {
        updates.credit_approved = action === 'approve';
        updates.credit_notes = notes;
        updates.credit_approved_at = new Date().toISOString();
      } else if (adminRole === 'audit') {
        updates.audit_approved = action === 'approve';
        updates.audit_notes = notes;
        updates.audit_approved_at = new Date().toISOString();
      } else if (adminRole === 'coo') {
        updates.coo_approved = action === 'approve';
        updates.coo_notes = notes;
        updates.coo_approved_at = new Date().toISOString();
      }

      if (action === 'decline') {
        updates.status = 'declined';
        updates.decline_reason = declineReason;
      } else if (action === 'further_review') {
        updates.status = 'further_review';
      } else if (action === 'approve') {
        // Check if 2 of 3 have approved
        const { data: current } = await supabase
          .from('loan_applications')
          .select('credit_approved, audit_approved, coo_approved')
          .eq('id', id)
          .single();

        if (current) {
          let approvalCount = 0;
          if (current.credit_approved) approvalCount++;
          if (current.audit_approved) approvalCount++;
          if (current.coo_approved) approvalCount++;
          // Add current approval
          if (adminRole === 'credit' && !current.credit_approved) approvalCount++;
          if (adminRole === 'audit' && !current.audit_approved) approvalCount++;
          if (adminRole === 'coo' && !current.coo_approved) approvalCount++;

          if (approvalCount >= 2) {
            updates.status = 'approved';
            updates.approved_amount = approvedAmount;
          } else {
            updates.status = 'under_review';
          }
        }
      }

      const { data: updated, error } = await supabase
        .from('loan_applications')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return updated;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-loan-applications'] });
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
