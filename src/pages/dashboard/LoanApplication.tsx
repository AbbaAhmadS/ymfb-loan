import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import MainLayout from '@/components/layout/MainLayout';
import { toast } from 'sonner';
import { 
  ArrowLeft, 
  ArrowRight, 
  Upload, 
  CheckCircle2,
  User,
  FileText,
  Users,
  CreditCard,
  Loader2
} from 'lucide-react';
import { ApplicationType, AccountType, LoanPurpose } from '@/types';

type Step = 'personal' | 'loan' | 'guarantor' | 'review';

const steps: { id: Step; label: string; icon: React.ElementType }[] = [
  { id: 'personal', label: 'Personal Info', icon: User },
  { id: 'loan', label: 'Loan Details', icon: FileText },
  { id: 'guarantor', label: 'Guarantor', icon: Users },
  { id: 'review', label: 'Review', icon: CreditCard },
];

const LoanApplication: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('personal');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    // Personal
    passportPhoto: null as File | null,
    passportPhotoPreview: '',
    applicationType: '' as ApplicationType | '',
    name: '',
    ministry: '',
    employeeId: '',
    bvn: '',
    nin: '',
    ninPhoto: null as File | null,
    phone: '',
    address: '',
    signature: null as File | null,
    
    // Loan
    amount: '',
    period: '',
    monthsToDeduct: '',
    paymentSlip: null as File | null,
    ymfbAccountNumber: '',
    otherBankAccount: '',
    accountType: '' as AccountType | '',
    accountBalance: '',
    dateOpened: '',
    purpose: '' as LoanPurpose | '',
    acceptedTerms: false,
    
    // Guarantor
    guarantorName: '',
    guarantorKnownFor: '',
    guarantorBasicSalary: '',
    guarantorAllowances: '',
    guarantorOtherIncome: '',
    guarantorEmployeeId: '',
    guarantorBvn: '',
    guarantorPhone: '',
    guarantorAddress: '',
    guarantorOrganization: '',
    guarantorPosition: '',
    guarantorSignature: null as File | null,
    guarantorAcceptedTerms: false,
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

  const getCurrentStepIndex = () => steps.findIndex(s => s.id === currentStep);

  const goToNextStep = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].id);
    }
  };

  const goToPrevStep = () => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex > 0) {
      setCurrentStep(steps[currentIndex - 1].id);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    toast.success('Application submitted! Proceed to payment.');
    // Navigate to payment page
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center gap-2 mb-8 overflow-x-auto py-2">
      {steps.map((step, index) => {
        const isActive = step.id === currentStep;
        const isCompleted = index < getCurrentStepIndex();
        const Icon = step.icon;

        return (
          <React.Fragment key={step.id}>
            <button
              onClick={() => index <= getCurrentStepIndex() && setCurrentStep(step.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap ${
                isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : isCompleted
                  ? 'bg-success/20 text-success'
                  : 'bg-muted text-muted-foreground'
              } ${index <= getCurrentStepIndex() ? 'cursor-pointer hover:opacity-80' : 'cursor-not-allowed'}`}
              disabled={index > getCurrentStepIndex()}
            >
              {isCompleted ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <Icon className="h-4 w-4" />
              )}
              <span className="text-sm font-medium hidden sm:inline">{step.label}</span>
            </button>
            {index < steps.length - 1 && (
              <div className={`w-8 h-0.5 ${isCompleted ? 'bg-success' : 'bg-border'}`} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );

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

  const renderPersonalStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="font-serif text-2xl font-bold text-foreground">Personal Information</h2>
        <p className="text-muted-foreground">Fill in your personal details</p>
      </div>

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
        <Label>Application Type</Label>
        <Select
          value={formData.applicationType}
          onValueChange={(value) => handleChange('applicationType', value)}
        >
          <SelectTrigger className="h-12">
            <SelectValue placeholder="Select application type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="internal">
              Internal Applicant (Salary account with YMFB)
            </SelectItem>
            <SelectItem value="external">
              External Applicant (Salary account with other banks)
            </SelectItem>
          </SelectContent>
        </Select>
        <p className="text-xs text-muted-foreground">
          Internal applicants receive their salary from YMFB. External applicants receive salary from other banks.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className="h-12"
            placeholder="Enter your full name"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="ministry">Ministry/Department</Label>
          <Input
            id="ministry"
            value={formData.ministry}
            onChange={(e) => handleChange('ministry', e.target.value)}
            className="h-12"
            placeholder="Enter your ministry/department"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="employeeId">Employee ID Number</Label>
          <Input
            id="employeeId"
            value={formData.employeeId}
            onChange={(e) => handleChange('employeeId', e.target.value)}
            className="h-12"
            placeholder="State government employee ID"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="bvn">BVN</Label>
          <Input
            id="bvn"
            value={formData.bvn}
            onChange={(e) => handleChange('bvn', e.target.value)}
            className="h-12"
            placeholder="Bank Verification Number"
            maxLength={11}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="nin">National Identity Number (NIN)</Label>
          <Input
            id="nin"
            value={formData.nin}
            onChange={(e) => handleChange('nin', e.target.value)}
            className="h-12"
            placeholder="Enter your NIN"
            maxLength={11}
          />
        </div>
        <div>
          {renderFileUpload('Upload NIN Card', 'ninPhoto')}
        </div>
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
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => handleChange('address', e.target.value)}
            className="h-12"
            placeholder="Enter your address"
          />
        </div>
      </div>

      {renderFileUpload('Upload Signature', 'signature')}
    </div>
  );

  const renderLoanStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="font-serif text-2xl font-bold text-foreground">Loan Details</h2>
        <p className="text-muted-foreground">Specify your loan requirements</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="amount">Loan Amount (₦)</Label>
          <Input
            id="amount"
            type="number"
            value={formData.amount}
            onChange={(e) => handleChange('amount', e.target.value)}
            className="h-12"
            placeholder="Enter amount"
          />
        </div>
        <div className="space-y-2">
          <Label>Repayment Period</Label>
          <Select
            value={formData.period}
            onValueChange={(value) => handleChange('period', value)}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="3">3 Months (Short term)</SelectItem>
              <SelectItem value="6">6 Months (Short term)</SelectItem>
              <SelectItem value="12">12 Months (Medium term)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="monthsToDeduct">Months to be Deducted</Label>
        <Input
          id="monthsToDeduct"
          value={formData.monthsToDeduct}
          onChange={(e) => handleChange('monthsToDeduct', e.target.value)}
          className="h-12"
          placeholder="e.g., January to June 2024"
        />
      </div>

      {renderFileUpload('Upload Payment Slip (Previous month)', 'paymentSlip')}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="ymfbAccountNumber">YMFB Account Number</Label>
          <Input
            id="ymfbAccountNumber"
            value={formData.ymfbAccountNumber}
            onChange={(e) => handleChange('ymfbAccountNumber', e.target.value)}
            className="h-12"
            placeholder="Your YMFB account number"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="otherBankAccount">Other Bank Account (if any)</Label>
          <Input
            id="otherBankAccount"
            value={formData.otherBankAccount}
            onChange={(e) => handleChange('otherBankAccount', e.target.value)}
            className="h-12"
            placeholder="Other bank account"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Account Type</Label>
          <Select
            value={formData.accountType}
            onValueChange={(value) => handleChange('accountType', value)}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select account type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Account</SelectItem>
              <SelectItem value="savings">Savings Account</SelectItem>
              <SelectItem value="cooperate">Cooperate Account</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="accountBalance">Account Balance (₦)</Label>
          <Input
            id="accountBalance"
            type="number"
            value={formData.accountBalance}
            onChange={(e) => handleChange('accountBalance', e.target.value)}
            className="h-12"
            placeholder="Current balance"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dateOpened">Date Account Opened</Label>
          <Input
            id="dateOpened"
            type="date"
            value={formData.dateOpened}
            onChange={(e) => handleChange('dateOpened', e.target.value)}
            className="h-12"
          />
        </div>
        <div className="space-y-2">
          <Label>Purpose of Loan</Label>
          <Select
            value={formData.purpose}
            onValueChange={(value) => handleChange('purpose', value)}
          >
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select purpose" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="medical">Medical</SelectItem>
              <SelectItem value="consumption">Consumption</SelectItem>
              <SelectItem value="investment">Investment</SelectItem>
              <SelectItem value="education">Education</SelectItem>
              <SelectItem value="others">Others</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
        <Checkbox
          id="terms"
          checked={formData.acceptedTerms}
          onCheckedChange={(checked) => handleChange('acceptedTerms', checked)}
        />
        <Label htmlFor="terms" className="text-sm cursor-pointer">
          I accept the loan terms and conditions. I understand that the loan will be 
          deducted from my monthly salary and disbursed to my YMFB account.
        </Label>
      </div>
    </div>
  );

  const renderGuarantorStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="font-serif text-2xl font-bold text-foreground">Guarantor Information</h2>
        <p className="text-muted-foreground">Undertaking by the guarantor</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="guarantorName">Guarantor's Full Name</Label>
          <Input
            id="guarantorName"
            value={formData.guarantorName}
            onChange={(e) => handleChange('guarantorName', e.target.value)}
            className="h-12"
            placeholder="Full name of guarantor"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="guarantorKnownFor">I have known applicant for</Label>
          <Input
            id="guarantorKnownFor"
            value={formData.guarantorKnownFor}
            onChange={(e) => handleChange('guarantorKnownFor', e.target.value)}
            className="h-12"
            placeholder="e.g., 5 years"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="guarantorBasicSalary">Basic Salary (₦)</Label>
          <Input
            id="guarantorBasicSalary"
            type="number"
            value={formData.guarantorBasicSalary}
            onChange={(e) => handleChange('guarantorBasicSalary', e.target.value)}
            className="h-12"
            placeholder="Basic salary"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="guarantorAllowances">Allowances (₦)</Label>
          <Input
            id="guarantorAllowances"
            type="number"
            value={formData.guarantorAllowances}
            onChange={(e) => handleChange('guarantorAllowances', e.target.value)}
            className="h-12"
            placeholder="Allowances"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="guarantorOtherIncome">Other Income (₦)</Label>
          <Input
            id="guarantorOtherIncome"
            type="number"
            value={formData.guarantorOtherIncome}
            onChange={(e) => handleChange('guarantorOtherIncome', e.target.value)}
            className="h-12"
            placeholder="Other income"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="guarantorEmployeeId">Employee ID Number</Label>
          <Input
            id="guarantorEmployeeId"
            value={formData.guarantorEmployeeId}
            onChange={(e) => handleChange('guarantorEmployeeId', e.target.value)}
            className="h-12"
            placeholder="Employee ID"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="guarantorBvn">BVN</Label>
          <Input
            id="guarantorBvn"
            value={formData.guarantorBvn}
            onChange={(e) => handleChange('guarantorBvn', e.target.value)}
            className="h-12"
            placeholder="BVN"
            maxLength={11}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="guarantorPhone">Phone Number</Label>
          <Input
            id="guarantorPhone"
            value={formData.guarantorPhone}
            onChange={(e) => handleChange('guarantorPhone', e.target.value)}
            className="h-12"
            placeholder="Phone number"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="guarantorAddress">Address</Label>
          <Input
            id="guarantorAddress"
            value={formData.guarantorAddress}
            onChange={(e) => handleChange('guarantorAddress', e.target.value)}
            className="h-12"
            placeholder="Address"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="guarantorOrganization">Organization</Label>
          <Input
            id="guarantorOrganization"
            value={formData.guarantorOrganization}
            onChange={(e) => handleChange('guarantorOrganization', e.target.value)}
            className="h-12"
            placeholder="Organization"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="guarantorPosition">Position</Label>
          <Input
            id="guarantorPosition"
            value={formData.guarantorPosition}
            onChange={(e) => handleChange('guarantorPosition', e.target.value)}
            className="h-12"
            placeholder="Position"
          />
        </div>
      </div>

      {renderFileUpload('Guarantor Signature', 'guarantorSignature')}

      <div className="flex items-start gap-3 p-4 bg-muted rounded-lg">
        <Checkbox
          id="guarantorTerms"
          checked={formData.guarantorAcceptedTerms}
          onCheckedChange={(checked) => handleChange('guarantorAcceptedTerms', checked)}
        />
        <Label htmlFor="guarantorTerms" className="text-sm cursor-pointer">
          I accept the undertaking and terms. I guarantee this applicant and agree 
          to be responsible for the repayment of this loan if the applicant defaults.
        </Label>
      </div>
    </div>
  );

  const renderReviewStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="font-serif text-2xl font-bold text-foreground">Review Application</h2>
        <p className="text-muted-foreground">Please review your application before submitting</p>
      </div>

      <div className="bg-muted/50 rounded-xl p-6 space-y-6">
        {/* Personal Info Summary */}
        <div>
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <User className="h-4 w-4" /> Personal Information
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><span className="text-muted-foreground">Name:</span> {formData.name}</div>
            <div><span className="text-muted-foreground">Ministry:</span> {formData.ministry}</div>
            <div><span className="text-muted-foreground">Employee ID:</span> {formData.employeeId}</div>
            <div><span className="text-muted-foreground">Phone:</span> {formData.phone}</div>
          </div>
        </div>

        {/* Loan Details Summary */}
        <div className="pt-4 border-t border-border">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4" /> Loan Details
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><span className="text-muted-foreground">Amount:</span> ₦{Number(formData.amount).toLocaleString()}</div>
            <div><span className="text-muted-foreground">Period:</span> {formData.period} months</div>
            <div><span className="text-muted-foreground">Purpose:</span> {formData.purpose}</div>
            <div><span className="text-muted-foreground">YMFB Account:</span> {formData.ymfbAccountNumber}</div>
          </div>
        </div>

        {/* Guarantor Summary */}
        <div className="pt-4 border-t border-border">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <Users className="h-4 w-4" /> Guarantor
          </h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div><span className="text-muted-foreground">Name:</span> {formData.guarantorName}</div>
            <div><span className="text-muted-foreground">Phone:</span> {formData.guarantorPhone}</div>
            <div><span className="text-muted-foreground">Organization:</span> {formData.guarantorOrganization}</div>
            <div><span className="text-muted-foreground">Position:</span> {formData.guarantorPosition}</div>
          </div>
        </div>
      </div>

      <div className="bg-accent/10 border border-accent/30 rounded-lg p-4">
        <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
          <CreditCard className="h-4 w-4" /> Application Fee
        </h4>
        <p className="text-sm text-muted-foreground mb-2">
          A non-refundable application fee of <strong>₦1,000</strong> is required to submit your application.
        </p>
        <p className="text-sm text-muted-foreground">
          Payment will be processed via Paystack after you click submit.
        </p>
      </div>
    </div>
  );

  return (
    <MainLayout>
      <div className="min-h-screen bg-muted/30 py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link 
            to="/dashboard" 
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Link>

          <div className="bg-card rounded-xl border border-border p-6 md:p-8 shadow-sm">
            <h1 className="font-serif text-3xl font-bold text-foreground text-center mb-2">
              Loan Application Form
            </h1>
            <p className="text-muted-foreground text-center mb-8">
              Your application is auto-saved at every stage
            </p>

            {renderStepIndicator()}

            <div className="mt-8">
              {currentStep === 'personal' && renderPersonalStep()}
              {currentStep === 'loan' && renderLoanStep()}
              {currentStep === 'guarantor' && renderGuarantorStep()}
              {currentStep === 'review' && renderReviewStep()}
            </div>

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <Button
                variant="outline"
                onClick={goToPrevStep}
                disabled={getCurrentStepIndex() === 0}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>
              
              {currentStep === 'review' ? (
                <Button
                  variant="hero"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Submit & Pay ₦1,000
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  variant="hero"
                  onClick={goToNextStep}
                  className="gap-2"
                >
                  Next
                  <ArrowRight className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default LoanApplication;
