import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUserAuth } from '@/contexts/UserAuthContext';
import { useNotifications } from '@/contexts/NotificationContext';
import axios from 'axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  User, 
  LogOut, 
  Clock, 
  Sparkles, 
  ArrowRight,
  CalendarCheck,
  CalendarX,
  CheckCircle2,
  XCircle,
  Bell
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const API_URL = import.meta.env.VITE_BACKEND_URL || '';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation('common');
  const { user, logout } = useUserAuth();
  const { refreshNotifications } = useNotifications();
  const [stats, setStats] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('upcoming'); // 'upcoming', 'past', 'all'
  const [cancellingId, setCancellingId] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, appointmentsRes] = await Promise.all([
        axios.get(`${API_URL}/api/user/stats`, { withCredentials: true }),
        axios.get(`${API_URL}/api/user/appointments`, { withCredentials: true })
      ]);

      setStats(statsRes.data);
      setAppointments(appointmentsRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error(t('dashboard.errorFetching'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancelAppointment = async (appointmentId) => {
    if (!confirm(t('dashboard.confirmCancel'))) {
      return;
    }

    setCancellingId(appointmentId);
    try {
      await axios.post(
        `${API_URL}/api/user/appointments/${appointmentId}/cancel`,
        {},
        { withCredentials: true }
      );

      toast.success(t('dashboard.cancelSuccess'));
      
      // Refresh data
      await fetchDashboardData();
      
      // Refresh notifications
      refreshNotifications();
    } catch (error) {
      console.error('Error cancelling appointment:', error);
      toast.error(error.response?.data?.detail || t('dashboard.cancelError'));
    } finally {
      setCancellingId(null);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Calculate stats from API data
  const displayStats = stats || {
    total_appointments: 0,
    upcoming_appointments: 0,
    completed_appointments: 0,
    cancelled_appointments: 0
  };

  // Filter appointments based on selected filter
  const filteredAppointments = React.useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (filter === 'upcoming') {
      return appointments.filter(appt => {
        const apptDate = new Date(appt.appointment_date);
        return apptDate >= today && (appt.status === 'pending' || appt.status === 'confirmed');
      });
    } else if (filter === 'past') {
      return appointments.filter(appt => {
        const apptDate = new Date(appt.appointment_date);
        return apptDate < today || appt.status === 'completed' || appt.status === 'cancelled';
      });
    }
    return appointments;
  }, [appointments, filter]);

  const getStatusBadge = (status) => {
    const config = {
      pending: { label: t('dashboard.pending'), className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
      confirmed: { label: t('dashboard.confirmed'), className: 'bg-green-100 text-green-800 border-green-200' },
      completed: { label: t('dashboard.completed'), className: 'bg-blue-100 text-blue-800 border-blue-200' },
      cancelled: { label: t('dashboard.cancelled'), className: 'bg-red-100 text-red-800 border-red-200' }
    };
    const { label, className } = config[status] || config.pending;
    return (
      <Badge variant="outline" className={`${className} font-medium`}>
        {label}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#F8E6E9] via-white to-[#F8E6E9]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#F4C2C2] border-t-[#D4AF76] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#8B6F8E] font-medium">{t('dashboard.loadingDashboard')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8E6E9] via-white to-[#F8E6E9] pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#8B6F8E] via-[#F4C2C2] to-[#D4AF76] bg-clip-text text-transparent" style={{ fontFamily: 'Playfair Display, serif' }}>
                {t('dashboard.welcomeBack')}, {user?.name?.split(' ')[0]}!
              </h1>
              <Sparkles className="w-8 h-8 text-[#D4AF76] animate-pulse" />
            </div>
            <p className="text-gray-600">{t('dashboard.subtitle')}</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="border-2 border-red-200 text-red-600 hover:bg-red-50 rounded-full px-6"
            data-testid="logout-button"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {t('auth.logout')}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="border-2 border-[#F8E6E9] shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">{t('dashboard.totalBookings')}</p>
                  <p className="text-4xl font-bold text-[#8B6F8E]">
                    {displayStats.total_appointments}
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-[#F4C2C2] to-[#D4AF76] rounded-2xl flex items-center justify-center shadow-lg">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#F8E6E9] shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">{t('dashboard.upcoming')}</p>
                  <p className="text-4xl font-bold text-[#D4AF76]">
                    {displayStats.upcoming_appointments}
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-[#D4AF76] to-[#F4C2C2] rounded-2xl flex items-center justify-center shadow-lg">
                  <Clock className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-[#F8E6E9] shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium mb-1">{t('dashboard.completed')}</p>
                  <p className="text-4xl font-bold text-green-600">
                    {displayStats.completed_appointments}
                  </p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-7 h-7 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card 
            className="border-2 border-[#F8E6E9] shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group bg-gradient-to-br from-[#F4C2C2]/10 to-[#D4AF76]/10"
            onClick={() => navigate('/booking')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#8B6F8E] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {t('dashboard.bookNew')}
                  </h3>
                  <p className="text-gray-600 text-sm">{t('dashboard.bookNewSubtitle')}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-[#F4C2C2] to-[#D4AF76] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <ArrowRight className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card 
            className="border-2 border-[#F8E6E9] shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group bg-gradient-to-br from-[#8B6F8E]/10 to-[#F4C2C2]/10"
            onClick={() => navigate('/services')}
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#8B6F8E] mb-2" style={{ fontFamily: 'Playfair Display, serif' }}>
                    {t('dashboard.browseServices')}
                  </h3>
                  <p className="text-gray-600 text-sm">{t('dashboard.browseServicesSubtitle')}</p>
                </div>
                <div className="w-12 h-12 bg-gradient-to-r from-[#8B6F8E] to-[#F4C2C2] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Appointments Section */}
        <Card className="border-2 border-[#F8E6E9] shadow-lg bg-white">
          <CardHeader className="border-b border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <CardTitle className="text-2xl font-bold text-[#8B6F8E]" style={{ fontFamily: 'Playfair Display, serif' }}>
                {t('dashboard.myAppointments')}
              </CardTitle>
              
              {/* Filter Buttons */}
              <div className="flex gap-2">
                <Button
                  variant={filter === 'upcoming' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('upcoming')}
                  className={filter === 'upcoming' 
                    ? 'bg-gradient-to-r from-[#F4C2C2] to-[#D4AF76] text-white' 
                    : 'border-[#F4C2C2] text-[#8B6F8E]'}
                >
                  <CalendarCheck className="w-4 h-4 mr-2" />
                  {t('dashboard.upcomingFilter')}
                </Button>
                <Button
                  variant={filter === 'past' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('past')}
                  className={filter === 'past' 
                    ? 'bg-gradient-to-r from-[#8B6F8E] to-[#F4C2C2] text-white' 
                    : 'border-[#8B6F8E] text-[#8B6F8E]'}
                >
                  <CalendarX className="w-4 h-4 mr-2" />
                  {t('dashboard.pastFilter')}
                </Button>
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('all')}
                  className={filter === 'all' 
                    ? 'bg-[#8B6F8E] text-white' 
                    : 'border-[#8B6F8E] text-[#8B6F8E]'}
                >
                  {t('dashboard.allFilter')}
                </Button>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            {filteredAppointments.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-[#F4C2C2]/20 to-[#D4AF76]/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-10 h-10 text-[#D4AF76]" />
                </div>
                <h3 className="text-xl font-semibold text-[#8B6F8E] mb-2">{t('dashboard.noAppointments')} {filter !== 'all' ? filter : ''}</h3>
                <p className="text-gray-600 mb-6">
                  {filter === 'upcoming' 
                    ? t('dashboard.noUpcomingMessage')
                    : t('dashboard.noPastMessage')}
                </p>
                {filter === 'upcoming' && (
                  <Button
                    onClick={() => navigate('/booking')}
                    className="bg-gradient-to-r from-[#F4C2C2] to-[#D4AF76] hover:opacity-90 text-white rounded-full px-8"
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    {t('dashboard.bookAppointment')}
                  </Button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map((appt) => (
                  <Card
                    key={appt.id}
                    className="border-2 border-gray-100 hover:border-[#F4C2C2] transition-all duration-300 hover:shadow-md"
                  >
                    <CardContent className="p-5">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h3 className="text-lg font-semibold text-[#8B6F8E]">
                                {appt.service_name_en || 'Service'}
                              </h3>
                              <p className="text-sm text-gray-600 mt-1">
                                <span className="font-medium">{t('dashboard.artist')}:</span> {appt.artist_name || 'N/A'}
                              </p>
                            </div>
                            {getStatusBadge(appt.status)}
                          </div>
                          
                          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="w-4 h-4 text-[#D4AF76]" />
                              <span className="font-medium">{appt.appointment_date}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4 text-[#D4AF76]" />
                              <span className="font-medium">{appt.appointment_time}</span>
                            </div>
                            {appt.service_duration && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs px-2 py-1 bg-[#F8E6E9] rounded-full text-[#8B6F8E]">
                                  {appt.service_duration}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Cancel Button - Only show for pending/confirmed appointments */}
                        {(appt.status === 'pending' || appt.status === 'confirmed') && (
                          <div className="flex-shrink-0">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleCancelAppointment(appt.id)}
                              disabled={cancellingId === appt.id}
                              className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                              data-testid={`cancel-appointment-${appt.id}`}
                            >
                              {cancellingId === appt.id ? (
                                <>
                                  <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-2"></div>
                                  {t('dashboard.cancelling')}
                                </>
                              ) : (
                                <>
                                  <XCircle className="w-4 h-4 mr-2" />
                                  {t('dashboard.cancel')}
                                </>
                              )}
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Member Info */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            {t('dashboard.memberSince')} {new Date(user?.created_at).toLocaleDateString('en-US', { 
              month: 'long', 
              year: 'numeric' 
            })}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;