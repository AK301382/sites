import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserAuth } from '@/contexts/UserAuthContext';
import axios from 'axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, User, LogOut, Clock } from 'lucide-react';

const API_URL = import.meta.env.VITE_BACKEND_URL || '';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useUserAuth();
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [profileRes, appointmentsRes] = await Promise.all([
        axios.get(`${API_URL}/api/user/profile`, { withCredentials: true }),
        axios.get(`${API_URL}/api/user/appointments`, { withCredentials: true })
      ]);

      setProfile(profileRes.data);
      
      // Filter upcoming appointments
      const upcoming = appointmentsRes.data.filter(appt => 
        appt.status === 'pending' || appt.status === 'confirmed'
      );
      setAppointments(upcoming);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F4C2C2]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F8E6E9] to-white pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-[#8B6F8E]" style={{ fontFamily: 'Playfair Display, serif' }}>
              Welcome, {user?.name?.split(' ')[0]}! 👋
            </h1>
            <p className="text-gray-600 mt-2">Manage your appointments and profile</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-2"
            data-testid="logout-button"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-[#F8E6E9]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Appointments</p>
                  <p className="text-3xl font-bold text-[#8B6F8E] mt-1">
                    {profile?.stats?.total_appointments || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-[#F4C2C2] to-[#D4AF76] rounded-full flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#F8E6E9]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Upcoming</p>
                  <p className="text-3xl font-bold text-[#8B6F8E] mt-1">
                    {appointments.length}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-[#D4AF76] to-[#F4C2C2] rounded-full flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#F8E6E9]">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Member Since</p>
                  <p className="text-lg font-bold text-[#8B6F8E] mt-1">
                    {new Date(user?.created_at).toLocaleDateString('en-US', { 
                      month: 'short', 
                      year: 'numeric' 
                    })}
                  </p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-[#8B6F8E] to-[#F4C2C2] rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Button
            onClick={() => navigate('/booking')}
            className="bg-gradient-to-r from-[#F4C2C2] to-[#D4AF76] hover:opacity-90 text-white rounded-full py-6 text-lg"
            data-testid="book-appointment-button"
          >
            <Calendar className="w-5 h-5 mr-2" />
            Book New Appointment
          </Button>

          <Button
            onClick={() => navigate('/user/appointments')}
            variant="outline"
            className="border-2 border-[#8B6F8E] text-[#8B6F8E] hover:bg-[#8B6F8E] hover:text-white rounded-full py-6 text-lg"
            data-testid="view-appointments-button"
          >
            View All Appointments
          </Button>
        </div>

        {/* Upcoming Appointments */}
        <Card className="border-2 border-[#F8E6E9]">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-[#8B6F8E] mb-4" style={{ fontFamily: 'Playfair Display, serif' }}>
              Upcoming Appointments
            </h2>

            {appointments.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">No upcoming appointments</p>
                <Button
                  onClick={() => navigate('/booking')}
                  className="bg-gradient-to-r from-[#F4C2C2] to-[#D4AF76] hover:opacity-90 text-white rounded-full"
                >
                  Book Your First Appointment
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {appointments.map((appt) => (
                  <div
                    key={appt.id}
                    className="border-2 border-gray-200 rounded-lg p-4 hover:border-[#F4C2C2] transition-colors"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-[#8B6F8E]">
                          {appt.service_name_en || 'Service'}
                        </h3>
                        <p className="text-gray-600 mt-1">
                          Artist: {appt.artist_name || 'N/A'}
                        </p>
                        <p className="text-gray-600 flex items-center gap-2 mt-2">
                          <Calendar className="w-4 h-4" />
                          {appt.appointment_date} at {appt.appointment_time}
                        </p>
                      </div>
                      <div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          appt.status === 'confirmed' 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {appt.status}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default UserDashboard;
