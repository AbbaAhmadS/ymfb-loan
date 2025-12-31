-- Create enum types
CREATE TYPE public.app_role AS ENUM ('credit', 'audit', 'coo', 'operations', 'md');
CREATE TYPE public.application_type AS ENUM ('internal', 'external');
CREATE TYPE public.account_type AS ENUM ('savings', 'current', 'cooperate');
CREATE TYPE public.loan_product AS ENUM ('short_term', 'long_term');
CREATE TYPE public.loan_amount_range AS ENUM ('100k_300k', '300k_600k', '600k_1m', 'above_1m');
CREATE TYPE public.loan_status AS ENUM ('draft', 'submitted', 'under_review', 'further_review', 'approved', 'declined');
CREATE TYPE public.account_status AS ENUM ('pending', 'approved', 'declined', 'further_review');

-- Create profiles table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create user_roles table (separate from profiles for security)
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  phone TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, role),
  UNIQUE(phone)
);

-- Create loan_applications table
CREATE TABLE public.loan_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  application_number TEXT UNIQUE NOT NULL,
  
  -- Application info
  product loan_product NOT NULL DEFAULT 'short_term',
  application_type application_type NOT NULL DEFAULT 'internal',
  
  -- Personal info
  passport_photo_url TEXT,
  full_name TEXT NOT NULL,
  ministry TEXT NOT NULL,
  employee_id TEXT NOT NULL,
  bvn TEXT NOT NULL,
  nin TEXT NOT NULL,
  nin_photo_url TEXT,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  signature_url TEXT,
  
  -- Payment slip
  payment_slip_url TEXT,
  
  -- Loan details
  amount_range loan_amount_range NOT NULL,
  period INTEGER NOT NULL CHECK (period > 0 AND period <= 12),
  
  -- Bank details
  ymfb_account_number TEXT,
  other_bank_account TEXT,
  account_type account_type NOT NULL DEFAULT 'savings',
  account_balance DECIMAL(15,2),
  date_opened DATE,
  
  -- Terms
  accepted_terms BOOLEAN NOT NULL DEFAULT false,
  
  -- Status
  status loan_status NOT NULL DEFAULT 'draft',
  
  -- Review fields
  credit_approved BOOLEAN,
  credit_approved_by UUID REFERENCES auth.users(id),
  credit_approved_at TIMESTAMPTZ,
  credit_notes TEXT,
  
  audit_approved BOOLEAN,
  audit_approved_by UUID REFERENCES auth.users(id),
  audit_approved_at TIMESTAMPTZ,
  audit_notes TEXT,
  
  coo_approved BOOLEAN,
  coo_approved_by UUID REFERENCES auth.users(id),
  coo_approved_at TIMESTAMPTZ,
  coo_notes TEXT,
  
  decline_reason TEXT,
  approved_amount DECIMAL(15,2),
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  submitted_at TIMESTAMPTZ
);

-- Create guarantors table
CREATE TABLE public.guarantors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  loan_application_id UUID NOT NULL REFERENCES public.loan_applications(id) ON DELETE CASCADE,
  
  full_name TEXT NOT NULL,
  known_for TEXT NOT NULL,
  basic_salary DECIMAL(15,2) NOT NULL,
  allowances DECIMAL(15,2) DEFAULT 0,
  other_income DECIMAL(15,2) DEFAULT 0,
  employee_id TEXT NOT NULL,
  bvn TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  organization TEXT NOT NULL,
  position TEXT NOT NULL,
  signature_url TEXT,
  accepted_terms BOOLEAN NOT NULL DEFAULT false,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create account_applications table
CREATE TABLE public.account_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  application_number TEXT UNIQUE NOT NULL,
  
  -- Personal info
  passport_photo_url TEXT,
  account_type account_type NOT NULL DEFAULT 'savings',
  full_name TEXT NOT NULL,
  nin TEXT NOT NULL,
  nin_photo_url TEXT,
  bvn TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,
  residential_address TEXT NOT NULL,
  signature_url TEXT,
  
  -- Status
  status account_status NOT NULL DEFAULT 'pending',
  notes TEXT,
  reviewed_by UUID REFERENCES auth.users(id),
  reviewed_at TIMESTAMPTZ,
  
  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create referees table
CREATE TABLE public.referees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  account_application_id UUID NOT NULL REFERENCES public.account_applications(id) ON DELETE CASCADE,
  
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  relationship TEXT NOT NULL,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create admin_login_attempts table for lockout functionality
CREATE TABLE public.admin_login_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone TEXT NOT NULL,
  failed_attempts INTEGER NOT NULL DEFAULT 0,
  locked_until TIMESTAMPTZ,
  last_attempt_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(phone)
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.loan_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.guarantors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.account_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.referees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_login_attempts ENABLE ROW LEVEL SECURITY;

-- Security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Function to check if user is any admin
CREATE OR REPLACE FUNCTION public.is_admin(_user_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id
  )
$$;

-- Function to generate application numbers
CREATE OR REPLACE FUNCTION public.generate_application_number(prefix TEXT)
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  new_number TEXT;
  year_str TEXT;
BEGIN
  year_str := to_char(now(), 'YYYY');
  new_number := prefix || year_str || '-' || LPAD(FLOOR(RANDOM() * 999999)::TEXT, 6, '0');
  RETURN new_number;
END;
$$;

-- Profiles RLS policies
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Admins can view all profiles
CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (public.is_admin(auth.uid()));

-- User roles RLS policies
CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "MD can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'md'));

-- Loan applications RLS policies
CREATE POLICY "Users can view own loan applications"
  ON public.loan_applications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own loan applications"
  ON public.loan_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own draft applications"
  ON public.loan_applications FOR UPDATE
  USING (auth.uid() = user_id AND status = 'draft');

-- Credit, Audit, COO, MD can view all loan applications
CREATE POLICY "Loan admins can view all applications"
  ON public.loan_applications FOR SELECT
  USING (
    public.has_role(auth.uid(), 'credit') OR 
    public.has_role(auth.uid(), 'audit') OR 
    public.has_role(auth.uid(), 'coo') OR 
    public.has_role(auth.uid(), 'md')
  );

-- Credit, Audit, COO can update loan applications
CREATE POLICY "Loan admins can update applications"
  ON public.loan_applications FOR UPDATE
  USING (
    public.has_role(auth.uid(), 'credit') OR 
    public.has_role(auth.uid(), 'audit') OR 
    public.has_role(auth.uid(), 'coo')
  );

-- Credit can insert on behalf
CREATE POLICY "Credit can create applications on behalf"
  ON public.loan_applications FOR INSERT
  WITH CHECK (public.has_role(auth.uid(), 'credit'));

-- Guarantors RLS policies
CREATE POLICY "Users can view own guarantors"
  ON public.guarantors FOR SELECT
  USING (
    loan_application_id IN (
      SELECT id FROM public.loan_applications WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage own guarantors"
  ON public.guarantors FOR ALL
  USING (
    loan_application_id IN (
      SELECT id FROM public.loan_applications WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Loan admins can view all guarantors"
  ON public.guarantors FOR SELECT
  USING (
    public.has_role(auth.uid(), 'credit') OR 
    public.has_role(auth.uid(), 'audit') OR 
    public.has_role(auth.uid(), 'coo') OR 
    public.has_role(auth.uid(), 'md')
  );

-- Account applications RLS policies
CREATE POLICY "Users can view own account applications"
  ON public.account_applications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own account applications"
  ON public.account_applications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own pending account applications"
  ON public.account_applications FOR UPDATE
  USING (auth.uid() = user_id AND status = 'pending');

-- Operations and MD can view all account applications
CREATE POLICY "Operations can view all account applications"
  ON public.account_applications FOR SELECT
  USING (
    public.has_role(auth.uid(), 'operations') OR 
    public.has_role(auth.uid(), 'md')
  );

CREATE POLICY "Operations can update account applications"
  ON public.account_applications FOR UPDATE
  USING (public.has_role(auth.uid(), 'operations'));

-- Referees RLS policies
CREATE POLICY "Users can manage own referees"
  ON public.referees FOR ALL
  USING (
    account_application_id IN (
      SELECT id FROM public.account_applications WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Operations can view all referees"
  ON public.referees FOR SELECT
  USING (
    public.has_role(auth.uid(), 'operations') OR 
    public.has_role(auth.uid(), 'md')
  );

-- Admin login attempts - public access for tracking
CREATE POLICY "Anyone can read login attempts"
  ON public.admin_login_attempts FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert login attempts"
  ON public.admin_login_attempts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update login attempts"
  ON public.admin_login_attempts FOR UPDATE
  USING (true);

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.email, ''),
    COALESCE(NEW.raw_user_meta_data->>'phone', '')
  );
  RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_loan_applications_updated_at
  BEFORE UPDATE ON public.loan_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_guarantors_updated_at
  BEFORE UPDATE ON public.guarantors
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_account_applications_updated_at
  BEFORE UPDATE ON public.account_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();