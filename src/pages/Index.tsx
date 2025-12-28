import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/MainLayout';
import { 
  ArrowRight, 
  Shield, 
  Clock, 
  Percent, 
  CheckCircle2,
  FileText,
  CreditCard,
  BadgeCheck
} from 'lucide-react';

const Index: React.FC = () => {
  const features = [
    {
      icon: Clock,
      title: 'Quick Processing',
      description: 'Get your loan processed within days, not weeks. Fast approval for qualified applicants.',
    },
    {
      icon: Percent,
      title: 'Competitive Rates',
      description: 'Enjoy some of the most competitive interest rates available for civil servants.',
    },
    {
      icon: Shield,
      title: 'Secure & Trusted',
      description: 'Your data is protected with bank-level security. Trusted by thousands of civil servants.',
    },
    {
      icon: CreditCard,
      title: 'Easy Repayment',
      description: 'Automatic salary deduction makes repayment effortless. No missed payments.',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Create Account',
      description: 'Sign up with your basic details to get started.',
    },
    {
      number: '02',
      title: 'Submit Application',
      description: 'Fill out the loan application form with required documents.',
    },
    {
      number: '03',
      title: 'Pay Application Fee',
      description: 'Complete the ₦1,000 non-refundable application fee.',
    },
    {
      number: '04',
      title: 'Get Approved',
      description: 'Receive your loan after approval from our credit team.',
    },
  ];

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-gradient-hero min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 right-20 w-96 h-96 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-80 h-80 bg-accent rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 py-20 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6 animate-fade-in">
              <BadgeCheck className="h-4 w-4" />
              Trusted by Yobe State Civil Servants
            </div>
            
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6 animate-slide-up">
              Quick Loans for{' '}
              <span className="text-gradient-primary">Yobe State</span>{' '}
              Civil Servants
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl animate-slide-up animation-delay-100">
              Apply for a loan online and get funded directly to your bank account. 
              Easy repayment through monthly salary deductions.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 animate-slide-up animation-delay-200">
              <Link to="/signup">
                <Button variant="hero" size="xl" className="gap-2 w-full sm:w-auto">
                  Start Your Application
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="xl" className="w-full sm:w-auto">
                  Already have an account?
                </Button>
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="mt-12 flex flex-wrap gap-6 animate-fade-in animation-delay-300">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <span>No hidden fees</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <span>3-12 months repayment</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-5 w-5 text-success" />
                <span>100% Online application</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose YMFB?
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We understand the needs of civil servants and offer tailored loan solutions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div 
                key={feature.title}
                className="bg-card p-6 rounded-xl border border-border hover:shadow-elegant transition-all duration-300 hover:-translate-y-1 group animate-scale-in"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Get your loan in four simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div 
                key={step.number}
                className="relative"
              >
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-0.5 bg-border" />
                )}
                <div className="relative z-10 text-center">
                  <div className="w-16 h-16 bg-gradient-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="font-serif text-xl font-bold">{step.number}</span>
                  </div>
                  <h3 className="font-serif text-lg font-semibold text-foreground mb-2">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/signup">
              <Button variant="hero" size="lg" className="gap-2">
                <FileText className="h-5 w-5" />
                Start Application Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-primary-foreground/80 max-w-2xl mx-auto mb-8">
            Join thousands of Yobe State civil servants who have benefited from our loan services. 
            Apply today and get funded quickly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button variant="accent" size="xl" className="gap-2">
                Create Your Account
                <ArrowRight className="h-5 w-5" />
              </Button>
            </Link>
            <Link to="/contact">
              <Button 
                variant="outline" 
                size="xl" 
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
