import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/MainLayout';
import { useAuth } from '@/contexts/AuthContext';
import { 
  FileText, 
  CreditCard, 
  Clock, 
  CheckCircle2, 
  XCircle,
  ArrowRight,
  Plus,
  Building2
} from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();

  // Mock application data
  const applications = [
    {
      id: '1',
      applicationNumber: 'YMFB-2024-001',
      amount: 500000,
      status: 'approved',
      date: '2024-01-15',
    },
    {
      id: '2',
      applicationNumber: 'YMFB-2024-002',
      amount: 300000,
      status: 'pending',
      date: '2024-01-20',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="h-5 w-5 text-success" />;
      case 'declined':
        return <XCircle className="h-5 w-5 text-destructive" />;
      default:
        return <Clock className="h-5 w-5 text-warning" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'declined':
        return 'Declined';
      case 'pending':
        return 'Under Review';
      default:
        return 'Draft';
    }
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-muted/30 py-8">
        <div className="container mx-auto px-4">
          {/* Welcome Section */}
          <div className="mb-8 animate-fade-in">
            <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
              Welcome, {user?.name}!
            </h1>
            <p className="text-muted-foreground">
              Manage your loan applications and account from here.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-card rounded-xl border border-border p-6 shadow-sm animate-slide-up">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h2 className="font-serif text-xl font-semibold text-foreground mb-2">
                    Apply for a Loan
                  </h2>
                  <p className="text-muted-foreground text-sm mb-4">
                    Start a new loan application. Quick processing for Yobe State civil servants.
                  </p>
                  <Link to="/apply">
                    <Button variant="hero" className="gap-2">
                      <Plus className="h-4 w-4" />
                      Start Application
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl border border-border p-6 shadow-sm animate-slide-up animation-delay-100">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                  <Building2 className="h-6 w-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h2 className="font-serif text-xl font-semibold text-foreground mb-2">
                    Open Bank Account
                  </h2>
                  <p className="text-muted-foreground text-sm mb-4">
                    Don't have a YMFB account? Open one to receive your loan disbursement.
                  </p>
                  <Link to="/open-account">
                    <Button variant="outline" className="gap-2">
                      <CreditCard className="h-4 w-4" />
                      Open Account
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Application Prompt */}
          <div className="bg-gradient-primary rounded-xl p-6 md:p-8 text-primary-foreground mb-8 animate-scale-in animation-delay-200">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold mb-2">
                  Let's start your application
                </h2>
                <p className="text-primary-foreground/80">
                  First, do you have an account with Yobe Microfinance Bank?
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <Link to="/apply" className="w-full sm:w-auto">
                  <Button variant="accent" size="lg" className="gap-2 w-full">
                    Yes, Continue
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/open-account" className="w-full sm:w-auto">
                  <Button 
                    size="lg" 
                    className="gap-2 w-full bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/30"
                  >
                    No, Open Account
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Recent Applications */}
          <div className="bg-card rounded-xl border border-border p-6 shadow-sm animate-slide-up animation-delay-300">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif text-xl font-semibold text-foreground">
                Your Applications
              </h2>
              <Link to="/applications" className="text-primary text-sm hover:underline">
                View All
              </Link>
            </div>

            {applications.length > 0 ? (
              <div className="space-y-4">
                {applications.map(app => (
                  <div 
                    key={app.id}
                    className="flex items-center justify-between p-4 bg-muted/50 rounded-lg hover:bg-muted transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      {getStatusIcon(app.status)}
                      <div>
                        <p className="font-medium text-foreground">{app.applicationNumber}</p>
                        <p className="text-sm text-muted-foreground">
                          ₦{app.amount.toLocaleString()} • {app.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`text-sm font-medium ${
                        app.status === 'approved' ? 'text-success' :
                        app.status === 'declined' ? 'text-destructive' :
                        'text-warning'
                      }`}>
                        {getStatusLabel(app.status)}
                      </span>
                      <Link to={`/applications/${app.id}`}>
                        <Button variant="ghost" size="sm">
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No applications yet</p>
                <Link to="/apply">
                  <Button variant="hero">Start Your First Application</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Dashboard;
