import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { 
  FileText, 
  Users, 
  CheckCircle2, 
  XCircle, 
  Clock,
  TrendingUp,
  DollarSign,
  BarChart3,
  Search,
  Filter,
  LogOut,
  Eye,
  MoreHorizontal,
  Building2,
  AlertCircle,
  Download,
  Share2,
  Printer
} from 'lucide-react';
import Logo from '@/components/layout/Logo';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// Mock applications data
const mockApplications = [
  {
    id: '1',
    applicationNumber: 'YMFB-2024-001',
    name: 'Abubakar Mohammed',
    amount: 500000,
    status: 'pending',
    type: 'internal',
    paymentStatus: 'paid',
    date: '2024-01-15',
    ministry: 'Ministry of Education',
  },
  {
    id: '2',
    applicationNumber: 'YMFB-2024-002',
    name: 'Fatima Ibrahim',
    amount: 300000,
    status: 'pre_approved',
    type: 'external',
    paymentStatus: 'paid',
    date: '2024-01-18',
    ministry: 'Ministry of Health',
  },
  {
    id: '3',
    applicationNumber: 'YMFB-2024-003',
    name: 'Yusuf Abdullahi',
    amount: 750000,
    status: 'approved',
    type: 'internal',
    paymentStatus: 'paid',
    date: '2024-01-20',
    ministry: 'Ministry of Finance',
  },
  {
    id: '4',
    applicationNumber: 'YMFB-2024-004',
    name: 'Amina Suleiman',
    amount: 200000,
    status: 'declined',
    type: 'external',
    paymentStatus: 'paid',
    date: '2024-01-22',
    ministry: 'Ministry of Agriculture',
  },
];

const AdminDashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const isAudit = user?.role === 'audit';
  const isCredit = user?.role === 'credit';

  const stats = [
    {
      label: 'Total Applications',
      value: '156',
      icon: FileText,
      change: '+12%',
      color: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      label: 'Pending Review',
      value: '24',
      icon: Clock,
      change: '-5%',
      color: 'text-warning',
      bgColor: 'bg-warning/10',
    },
    {
      label: 'Approved',
      value: '98',
      icon: CheckCircle2,
      change: '+18%',
      color: 'text-success',
      bgColor: 'bg-success/10',
    },
    {
      label: 'Total Amount',
      value: '₦45.2M',
      icon: DollarSign,
      change: '+8%',
      color: 'text-accent',
      bgColor: 'bg-accent/10',
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-success/20 text-success border-success/30">Approved</Badge>;
      case 'declined':
        return <Badge className="bg-destructive/20 text-destructive border-destructive/30">Declined</Badge>;
      case 'pre_approved':
        return <Badge className="bg-info/20 text-info border-info/30">Pre-Approved</Badge>;
      case 'further_review':
        return <Badge className="bg-warning/20 text-warning border-warning/30">Further Review</Badge>;
      default:
        return <Badge className="bg-muted text-muted-foreground">Pending</Badge>;
    }
  };

  const getPaymentBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge variant="outline" className="border-success text-success">Paid</Badge>;
      case 'processing':
        return <Badge variant="outline" className="border-warning text-warning">Processing</Badge>;
      case 'error':
        return <Badge variant="outline" className="border-destructive text-destructive">Error</Badge>;
      default:
        return <Badge variant="outline">Unpaid</Badge>;
    }
  };

  const filteredApplications = mockApplications.filter(app => {
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         app.applicationNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* Header */}
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Logo />
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-lg">
              <Badge variant="secondary" className="capitalize">
                {user?.role} Department
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium hidden md:block">{user?.name}</span>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome */}
        <div className="mb-8">
          <h1 className="font-serif text-3xl font-bold text-foreground mb-2">
            {isAudit ? 'Internal Audit Dashboard' : 'Credit Department Dashboard'}
          </h1>
          <p className="text-muted-foreground">
            {isAudit 
              ? 'Review and approve pre-approved loan applications'
              : 'Review loan applications and manage account openings'
            }
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <div 
              key={stat.label}
              className="bg-card rounded-xl border border-border p-6 shadow-sm"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`h-6 w-6 ${stat.color}`} />
                </div>
                <span className={`text-sm font-medium ${
                  stat.change.startsWith('+') ? 'text-success' : 'text-destructive'
                }`}>
                  {stat.change}
                </span>
              </div>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {isCredit && (
            <>
              <Link to="/admin/apply-on-behalf" className="block">
                <div className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Apply on Behalf</h3>
                      <p className="text-sm text-muted-foreground">Create application for applicant</p>
                    </div>
                  </div>
                </div>
              </Link>
              <Link to="/admin/account-openings" className="block">
                <div className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Account Openings</h3>
                      <p className="text-sm text-muted-foreground">View account applications</p>
                    </div>
                  </div>
                </div>
              </Link>
            </>
          )}
          {isAudit && (
            <Link to="/admin/reports" className="block">
              <div className="bg-card rounded-xl border border-border p-6 shadow-sm hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-success/10 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Reports & Analytics</h3>
                    <p className="text-sm text-muted-foreground">Generate detailed reports</p>
                  </div>
                </div>
              </div>
            </Link>
          )}
        </div>

        {/* Applications Table */}
        <div className="bg-card rounded-xl border border-border shadow-sm">
          <div className="p-6 border-b border-border">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h2 className="font-serif text-xl font-semibold text-foreground">
                {isAudit ? 'Pre-Approved Applications' : 'Loan Applications'}
              </h2>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by name or ID..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 w-full sm:w-64"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Filter status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="pre_approved">Pre-Approved</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="declined">Declined</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left p-4 font-medium text-muted-foreground">Application</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Applicant</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Amount</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Type</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Payment</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-left p-4 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((app) => (
                  <tr key={app.id} className="border-b border-border hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-foreground">{app.applicationNumber}</p>
                        <p className="text-sm text-muted-foreground">{app.date}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-foreground">{app.name}</p>
                        <p className="text-sm text-muted-foreground">{app.ministry}</p>
                      </div>
                    </td>
                    <td className="p-4 font-medium">₦{app.amount.toLocaleString()}</td>
                    <td className="p-4">
                      <Badge variant="outline" className="capitalize">{app.type}</Badge>
                    </td>
                    <td className="p-4">{getPaymentBadge(app.paymentStatus)}</td>
                    <td className="p-4">{getStatusBadge(app.status)}</td>
                    <td className="p-4">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" /> View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Download className="h-4 w-4 mr-2" /> Download PDF
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Printer className="h-4 w-4 mr-2" /> Print
                          </DropdownMenuItem>
                          {isCredit && app.status === 'pending' && (
                            <>
                              <DropdownMenuItem className="text-success">
                                <CheckCircle2 className="h-4 w-4 mr-2" /> Pre-Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <XCircle className="h-4 w-4 mr-2" /> Decline
                              </DropdownMenuItem>
                            </>
                          )}
                          {isAudit && app.status === 'pre_approved' && (
                            <>
                              <DropdownMenuItem className="text-success">
                                <CheckCircle2 className="h-4 w-4 mr-2" /> Approve
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-destructive">
                                <XCircle className="h-4 w-4 mr-2" /> Decline
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-warning">
                                <AlertCircle className="h-4 w-4 mr-2" /> Further Review
                              </DropdownMenuItem>
                            </>
                          )}
                          {isCredit && (
                            <DropdownMenuItem>
                              <Share2 className="h-4 w-4 mr-2" /> Share with Account Opening
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredApplications.length === 0 && (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground/50 mx-auto mb-4" />
              <p className="text-muted-foreground">No applications found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
