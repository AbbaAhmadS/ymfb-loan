export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      account_applications: {
        Row: {
          account_type: Database["public"]["Enums"]["account_type"]
          application_number: string
          bvn: string
          created_at: string
          email: string
          full_name: string
          id: string
          nin: string
          nin_photo_url: string | null
          notes: string | null
          passport_photo_url: string | null
          phone: string
          residential_address: string
          reviewed_at: string | null
          reviewed_by: string | null
          signature_url: string | null
          status: Database["public"]["Enums"]["account_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          account_type?: Database["public"]["Enums"]["account_type"]
          application_number: string
          bvn: string
          created_at?: string
          email: string
          full_name: string
          id?: string
          nin: string
          nin_photo_url?: string | null
          notes?: string | null
          passport_photo_url?: string | null
          phone: string
          residential_address: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          signature_url?: string | null
          status?: Database["public"]["Enums"]["account_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          account_type?: Database["public"]["Enums"]["account_type"]
          application_number?: string
          bvn?: string
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          nin?: string
          nin_photo_url?: string | null
          notes?: string | null
          passport_photo_url?: string | null
          phone?: string
          residential_address?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          signature_url?: string | null
          status?: Database["public"]["Enums"]["account_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      admin_login_attempts: {
        Row: {
          failed_attempts: number
          id: string
          last_attempt_at: string
          locked_until: string | null
          phone: string
        }
        Insert: {
          failed_attempts?: number
          id?: string
          last_attempt_at?: string
          locked_until?: string | null
          phone: string
        }
        Update: {
          failed_attempts?: number
          id?: string
          last_attempt_at?: string
          locked_until?: string | null
          phone?: string
        }
        Relationships: []
      }
      guarantors: {
        Row: {
          accepted_terms: boolean
          address: string
          allowances: number | null
          basic_salary: number
          bvn: string
          created_at: string
          employee_id: string
          full_name: string
          id: string
          known_for: string
          loan_application_id: string
          organization: string
          other_income: number | null
          phone: string
          position: string
          signature_url: string | null
          updated_at: string
        }
        Insert: {
          accepted_terms?: boolean
          address: string
          allowances?: number | null
          basic_salary: number
          bvn: string
          created_at?: string
          employee_id: string
          full_name: string
          id?: string
          known_for: string
          loan_application_id: string
          organization: string
          other_income?: number | null
          phone: string
          position: string
          signature_url?: string | null
          updated_at?: string
        }
        Update: {
          accepted_terms?: boolean
          address?: string
          allowances?: number | null
          basic_salary?: number
          bvn?: string
          created_at?: string
          employee_id?: string
          full_name?: string
          id?: string
          known_for?: string
          loan_application_id?: string
          organization?: string
          other_income?: number | null
          phone?: string
          position?: string
          signature_url?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "guarantors_loan_application_id_fkey"
            columns: ["loan_application_id"]
            isOneToOne: false
            referencedRelation: "loan_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      loan_applications: {
        Row: {
          accepted_terms: boolean
          account_balance: number | null
          account_type: Database["public"]["Enums"]["account_type"]
          address: string
          amount_range: Database["public"]["Enums"]["loan_amount_range"]
          application_number: string
          application_type: Database["public"]["Enums"]["application_type"]
          approved_amount: number | null
          audit_approved: boolean | null
          audit_approved_at: string | null
          audit_approved_by: string | null
          audit_notes: string | null
          bvn: string
          coo_approved: boolean | null
          coo_approved_at: string | null
          coo_approved_by: string | null
          coo_notes: string | null
          created_at: string
          credit_approved: boolean | null
          credit_approved_at: string | null
          credit_approved_by: string | null
          credit_notes: string | null
          date_opened: string | null
          decline_reason: string | null
          employee_id: string
          full_name: string
          id: string
          ministry: string
          nin: string
          nin_photo_url: string | null
          other_bank_account: string | null
          passport_photo_url: string | null
          payment_slip_url: string | null
          period: number
          phone: string
          product: Database["public"]["Enums"]["loan_product"]
          signature_url: string | null
          status: Database["public"]["Enums"]["loan_status"]
          submitted_at: string | null
          updated_at: string
          user_id: string
          ymfb_account_number: string | null
        }
        Insert: {
          accepted_terms?: boolean
          account_balance?: number | null
          account_type?: Database["public"]["Enums"]["account_type"]
          address: string
          amount_range: Database["public"]["Enums"]["loan_amount_range"]
          application_number: string
          application_type?: Database["public"]["Enums"]["application_type"]
          approved_amount?: number | null
          audit_approved?: boolean | null
          audit_approved_at?: string | null
          audit_approved_by?: string | null
          audit_notes?: string | null
          bvn: string
          coo_approved?: boolean | null
          coo_approved_at?: string | null
          coo_approved_by?: string | null
          coo_notes?: string | null
          created_at?: string
          credit_approved?: boolean | null
          credit_approved_at?: string | null
          credit_approved_by?: string | null
          credit_notes?: string | null
          date_opened?: string | null
          decline_reason?: string | null
          employee_id: string
          full_name: string
          id?: string
          ministry: string
          nin: string
          nin_photo_url?: string | null
          other_bank_account?: string | null
          passport_photo_url?: string | null
          payment_slip_url?: string | null
          period: number
          phone: string
          product?: Database["public"]["Enums"]["loan_product"]
          signature_url?: string | null
          status?: Database["public"]["Enums"]["loan_status"]
          submitted_at?: string | null
          updated_at?: string
          user_id: string
          ymfb_account_number?: string | null
        }
        Update: {
          accepted_terms?: boolean
          account_balance?: number | null
          account_type?: Database["public"]["Enums"]["account_type"]
          address?: string
          amount_range?: Database["public"]["Enums"]["loan_amount_range"]
          application_number?: string
          application_type?: Database["public"]["Enums"]["application_type"]
          approved_amount?: number | null
          audit_approved?: boolean | null
          audit_approved_at?: string | null
          audit_approved_by?: string | null
          audit_notes?: string | null
          bvn?: string
          coo_approved?: boolean | null
          coo_approved_at?: string | null
          coo_approved_by?: string | null
          coo_notes?: string | null
          created_at?: string
          credit_approved?: boolean | null
          credit_approved_at?: string | null
          credit_approved_by?: string | null
          credit_notes?: string | null
          date_opened?: string | null
          decline_reason?: string | null
          employee_id?: string
          full_name?: string
          id?: string
          ministry?: string
          nin?: string
          nin_photo_url?: string | null
          other_bank_account?: string | null
          passport_photo_url?: string | null
          payment_slip_url?: string | null
          period?: number
          phone?: string
          product?: Database["public"]["Enums"]["loan_product"]
          signature_url?: string | null
          status?: Database["public"]["Enums"]["loan_status"]
          submitted_at?: string | null
          updated_at?: string
          user_id?: string
          ymfb_account_number?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name: string
          id: string
          phone: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          phone?: string
          updated_at?: string
        }
        Relationships: []
      }
      referees: {
        Row: {
          account_application_id: string
          address: string
          created_at: string
          full_name: string
          id: string
          phone: string
          relationship: string
        }
        Insert: {
          account_application_id: string
          address: string
          created_at?: string
          full_name: string
          id?: string
          phone: string
          relationship: string
        }
        Update: {
          account_application_id?: string
          address?: string
          created_at?: string
          full_name?: string
          id?: string
          phone?: string
          relationship?: string
        }
        Relationships: [
          {
            foreignKeyName: "referees_account_application_id_fkey"
            columns: ["account_application_id"]
            isOneToOne: false
            referencedRelation: "account_applications"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          phone: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          phone: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          phone?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      generate_application_number: { Args: { prefix: string }; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      account_status: "pending" | "approved" | "declined" | "further_review"
      account_type: "savings" | "current" | "cooperate"
      app_role: "credit" | "audit" | "coo" | "operations" | "md"
      application_type: "internal" | "external"
      loan_amount_range: "100k_300k" | "300k_600k" | "600k_1m" | "above_1m"
      loan_product: "short_term" | "long_term"
      loan_status:
        | "draft"
        | "submitted"
        | "under_review"
        | "further_review"
        | "approved"
        | "declined"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      account_status: ["pending", "approved", "declined", "further_review"],
      account_type: ["savings", "current", "cooperate"],
      app_role: ["credit", "audit", "coo", "operations", "md"],
      application_type: ["internal", "external"],
      loan_amount_range: ["100k_300k", "300k_600k", "600k_1m", "above_1m"],
      loan_product: ["short_term", "long_term"],
      loan_status: [
        "draft",
        "submitted",
        "under_review",
        "further_review",
        "approved",
        "declined",
      ],
    },
  },
} as const
