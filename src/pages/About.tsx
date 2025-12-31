import React from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Building2, Users, Target, Award } from 'lucide-react';

const About: React.FC = () => {
  return (
    <MainLayout>
      <div className="min-h-screen bg-muted/30">
        {/* Hero Section */}
        <section className="bg-gradient-primary text-primary-foreground py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 animate-fade-in">
              About Yobe Microfinance Bank
            </h1>
            <p className="text-xl text-primary-foreground/80 max-w-3xl mx-auto animate-slide-up">
              Committed to expanding financial inclusion and supporting economic growth across Yobe State and beyond.
            </p>
          </div>
        </section>

        {/* History Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="bg-card rounded-xl border border-border p-8 shadow-sm">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="font-serif text-2xl font-bold text-foreground">Our History</h2>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  Yobe Microfinance Bank Limited is a licensed microfinance institution in Nigeria, committed to expanding financial inclusion and supporting economic growth across Yobe State and beyond.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-4">
                  The bank was originally incorporated as <strong>Yobe Savings and Loans Limited</strong> on <strong>28th September 1992</strong>, and in June 2014 it successfully converted to a state-licensed microfinance bank with authorization from the Central Bank of Nigeria (CBN).
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  For over <strong>30 years</strong>, Yobe Microfinance Bank has been providing financial services to individuals, civil servants, small businesses, and underserved communities.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="font-serif text-3xl font-bold text-center text-foreground mb-12">
              Our Services
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="bg-card rounded-xl border border-border p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-2">Savings Accounts</h3>
                <p className="text-muted-foreground">
                  Secure savings accounts with competitive interest rates for individuals and businesses.
                </p>
              </div>
              <div className="bg-card rounded-xl border border-border p-6 text-center">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Target className="h-8 w-8 text-accent" />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-2">Loan Products</h3>
                <p className="text-muted-foreground">
                  Flexible loan facilities for civil servants with easy repayment through salary deductions.
                </p>
              </div>
              <div className="bg-card rounded-xl border border-border p-6 text-center">
                <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-success" />
                </div>
                <h3 className="font-serif text-xl font-semibold mb-2">Credit Facilities</h3>
                <p className="text-muted-foreground">
                  Specialized credit facilities designed to meet local needs and promote economic empowerment.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="font-serif text-3xl font-bold text-foreground mb-6">Our Mission</h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                The bank plays an active role in promoting financial inclusion, supporting entrepreneurship, and enhancing livelihoods. Headquartered in <strong>Damaturu, Yobe State</strong>, the bank continues to pursue strategic growth while upholding its mission of delivering accessible and sustainable financial services.
              </p>
            </div>
          </div>
        </section>
      </div>
    </MainLayout>
  );
};

export default About;
