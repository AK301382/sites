import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  TrendingUp, 
  Clock, 
  Settings, 
  LogOut,
  Plus,
  BarChart3,
  Calendar,
  Bell,
  Search
} from 'lucide-react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8001';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadDashboard();
  }, []);

  const loadDashboard = async () => {
    const token = localStorage.getItem('customer_token');
    const storedCustomer = localStorage.getItem('customer_data');

    if (!token) {
      navigate('/customer/login');
      return;
    }

    if (storedCustomer) {
      setCustomer(JSON.parse(storedCustomer));
    }

    try {
      // Fetch dashboard stats
      const statsResponse = await fetch(`${BACKEND_URL}/api/customers/dashboard/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Refresh customer profile
      const profileResponse = await fetch(`${BACKEND_URL}/api/customers/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setCustomer(profileData);
        localStorage.setItem('customer_data', JSON.stringify(profileData));
      }
    } catch (err) {
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('customer_token');
    localStorage.removeItem('customer_data');
    navigate('/customer/login');
  };

  const getTrialDaysRemaining = () => {
    if (!customer?.trial_end_date) return 0;
    const trialEnd = new Date(customer.trial_end_date);
    const now = new Date();
    const diffTime = trialEnd - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  const trialDays = getTrialDaysRemaining();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {customer?.company_name?.charAt(0) || 'C'}
                </span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-gray-900">{customer?.company_name}</h1>
                <p className="text-xs text-gray-500">{customer?.subscription_plan} plan</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Bell className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg">
                <Search className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => navigate('/customer/settings')}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Settings className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Trial Banner */}
        {customer?.subscription_status === 'trial' && (
          <div className="mb-6 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold mb-1">Free Trial Active</h3>
                <p className="text-blue-100">
                  {trialDays} days remaining in your trial period
                </p>
              </div>
              <button className="bg-white text-blue-600 px-6 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors">
                Upgrade Now
              </button>
            </div>
          </div>
        )}

        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, {customer?.contact_name}! 👋
          </h2>
          <p className="text-gray-600">Here's what's happening with your account today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-sm text-green-600 font-medium">+12%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {stats?.total_accounts || 0}
            </h3>
            <p className="text-sm text-gray-600">Team Members</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-sm text-green-600 font-medium">+8%</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {stats?.active_projects || 0}
            </h3>
            <p className="text-sm text-gray-600">Active Projects</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-sm text-gray-600">This month</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {stats?.monthly_usage || 0}
            </h3>
            <p className="text-sm text-gray-600">API Calls</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-orange-50 rounded-lg">
                <Clock className="w-6 h-6 text-orange-600" />
              </div>
              <span className="text-sm text-gray-600">Average</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {stats?.avg_response_time || '0'}ms
            </h3>
            <p className="text-sm text-gray-600">Response Time</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Quick Actions Card */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/customer/accounts')}
                className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">Manage Team</p>
                  <p className="text-sm text-gray-600">View and invite team members</p>
                </div>
              </button>

              <button className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Plus className="w-5 h-5 text-green-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">New Project</p>
                  <p className="text-sm text-gray-600">Start a new project</p>
                </div>
              </button>

              <button className="w-full flex items-center gap-3 p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Settings className="w-5 h-5 text-purple-600" />
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium text-gray-900">Account Settings</p>
                  <p className="text-sm text-gray-600">Update your preferences</p>
                </div>
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-50 rounded-lg mt-1">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">Account created</p>
                  <p className="text-xs text-gray-600 mt-1">
                    {new Date(customer?.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {stats?.recent_activity && stats.recent_activity.length > 0 ? (
                stats.recent_activity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="p-2 bg-gray-50 rounded-lg mt-1">
                      <Bell className="w-4 h-4 text-gray-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-xs text-gray-600 mt-1">{activity.date}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 text-sm">
                  No recent activity
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CustomerDashboard;