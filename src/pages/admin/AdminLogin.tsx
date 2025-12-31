import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader2, Shield, ArrowLeft } from 'lucide-react';

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { loginAdmin, isLoading } = useAuth();
  
  const [formData, setFormData] = useState({
    phone: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLocked, setIsLocked] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.phone || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    const result = await loginAdmin(formData.phone, formData.password);
    
    if (result.success) {
      toast.success('Welcome, Admin!');
      navigate('/admin/dashboard');
    } else {
      if (result.locked) {
        setIsLocked(true);
      }
      toast.error(result.error || 'Invalid credentials');
    }
  };

  if (isLocked) {
    return (
      <MainLayout showFooter={false}>
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-md animate-scale-in">
            <div className="bg-card rounded-2xl shadow-elegant border border-border p-8 text-center">
              <Shield className="h-16 w-16 text-destructive mx-auto mb-4" />
              <h1 className="font-serif text-2xl font-bold text-foreground mb-2">
                Account Locked
              </h1>
              <p className="text-muted-foreground mb-6">
                Too many failed login attempts. Please contact the developer to reset your access.
              </p>
              <Link to="/">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout showFooter={false}>
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md animate-scale-in">
          <div className="bg-card rounded-2xl shadow-elegant border border-border p-8">
            <Link 
              to="/login" 
              className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to User Login
            </Link>

            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
                Admin Login
              </h1>
              <p className="text-muted-foreground">
                Access the admin dashboard
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    className="h-12 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <Button 
                type="submit" 
                variant="hero" 
                size="lg" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              Forgot your password? Contact the developer for assistance.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AdminLogin;
