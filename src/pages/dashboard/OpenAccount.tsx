import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import MainLayout from '@/components/layout/MainLayout';
import { toast } from 'sonner';
import { ArrowLeft, Upload, Loader2 } from 'lucide-react';

const OpenAccount: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    passportPhoto: null as File | null,
    passportPhotoPreview: '',
    name: '',
    phone: '',
    email: '',
    address: '',
    bvn: '',
    nin: '',
    ninPhoto: null as File | null,
    refereeName: '',
    refereePhone: '',
    refereeAddress: '',
    refereeRelationship: '',
  });

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: string, file: File | null) => {
    handleChange(field, file);
    if (field === 'passportPhoto' && file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleChange('passportPhotoPreview', e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    toast.success('Account application submitted! Your account number will be ready in 2 working days.');
    navigate('/dashboard');
  };

  const renderFileUpload = (
    label: string,
    field: string,
    accept: string = 'image/*'
  ) => (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
        <input
          type="file"
          accept={accept}
          onChange={(e) => handleFileChange(field, e.target.files?.[0] || null)}
          className="hidden"
          id={field}
        />
        <label htmlFor={field} className="cursor-pointer">
          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">
            {(formData as any)[field]?.name || 'Click to upload (max 2MB)'}
          </p>
        </label>
      </div>
    </div>
  );

  return (
    <MainLayout>
      <div className="min-h-screen bg-muted/30 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="bg-card rounded-xl border border-border p-6 md:p-8 shadow-sm">
            <div className="text-center mb-8">
              <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
                YMFB Account Opening Form
              </h1>
              <p className="text-muted-foreground">
                Open a Yobe Microfinance Bank account to receive your loan
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Passport Photo */}
              <div className="flex flex-col items-center gap-4">
                {formData.passportPhotoPreview ? (
                  <div className="relative">
                    <img 
                      src={formData.passportPhotoPreview} 
                      alt="Passport" 
                      className="w-32 h-32 rounded-lg object-cover border-2 border-border"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        handleChange('passportPhoto', null);
                        handleChange('passportPhotoPreview', '');
                      }}
                      className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  renderFileUpload('Passport Photograph', 'passportPhoto')
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="h-12"
                  placeholder="Enter your full name"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                    className="h-12"
                    placeholder="e.g., 08012345678"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="h-12"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  className="h-12"
                  placeholder="Enter your address"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="bvn">BVN</Label>
                  <Input
                    id="bvn"
                    value={formData.bvn}
                    onChange={(e) => handleChange('bvn', e.target.value)}
                    className="h-12"
                    placeholder="Bank Verification Number"
                    maxLength={11}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nin">NIN</Label>
                  <Input
                    id="nin"
                    value={formData.nin}
                    onChange={(e) => handleChange('nin', e.target.value)}
                    className="h-12"
                    placeholder="National Identity Number"
                    maxLength={11}
                    required
                  />
                </div>
              </div>

              {renderFileUpload('Upload NIN Card', 'ninPhoto')}

              {/* Referee Information */}
              <div className="pt-6 border-t border-border">
                <h2 className="font-serif text-xl font-semibold text-foreground mb-4">
                  Referee Information
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="refereeName">Referee Name</Label>
                    <Input
                      id="refereeName"
                      value={formData.refereeName}
                      onChange={(e) => handleChange('refereeName', e.target.value)}
                      className="h-12"
                      placeholder="Full name of referee"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="refereePhone">Referee Phone</Label>
                    <Input
                      id="refereePhone"
                      value={formData.refereePhone}
                      onChange={(e) => handleChange('refereePhone', e.target.value)}
                      className="h-12"
                      placeholder="Phone number"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="space-y-2">
                    <Label htmlFor="refereeAddress">Referee Address</Label>
                    <Input
                      id="refereeAddress"
                      value={formData.refereeAddress}
                      onChange={(e) => handleChange('refereeAddress', e.target.value)}
                      className="h-12"
                      placeholder="Referee's address"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="refereeRelationship">Relationship</Label>
                    <Input
                      id="refereeRelationship"
                      value={formData.refereeRelationship}
                      onChange={(e) => handleChange('refereeRelationship', e.target.value)}
                      className="h-12"
                      placeholder="e.g., Colleague, Friend"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">
                  <strong>Note:</strong> After submitting this form, your account number will be 
                  ready within 2 working business days. You will be notified via email and SMS.
                </p>
              </div>

              <Button 
                type="submit" 
                variant="hero" 
                size="lg" 
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default OpenAccount;
