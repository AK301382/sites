import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Search, Send, Users as UsersIcon, Award, Calendar, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import AdminLayout from '@/components/admin/AdminLayout';
import SendNotificationModal from '@/components/admin/SendNotificationModal';
import { useToast } from '@/hooks/use-toast';
import api from '@/utils/api';

const AdminUsers = () => {
  const { t } = useTranslation(['admin', 'common']);
  const { toast } = useToast();
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [selectAll, setSelectAll] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, users]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/users');
      setUsers(response.data.users);
      setFilteredUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: t('common:error'),
        description: t('users.errorFetching'),
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }

    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  };

  const handleSelectUser = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id));
    }
    setSelectAll(!selectAll);
  };

  const handleSendNotification = () => {
    setShowNotificationModal(true);
  };

  const handleNotificationSent = () => {
    setSelectedUsers([]);
    setSelectAll(false);
    setShowNotificationModal(false);
  };

  const getRankBadge = (completedBookings) => {
    if (completedBookings === 0) {
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-700">
          <UsersIcon className="w-3 h-3 mr-1" />
          {t('users.rankNew')}
        </Badge>
      );
    } else if (completedBookings <= 3) {
      return (
        <Badge variant="outline" className="bg-orange-100 text-orange-700">
          <Award className="w-3 h-3 mr-1" />
          {t('users.rankBronze')}
        </Badge>
      );
    } else if (completedBookings <= 7) {
      return (
        <Badge variant="outline" className="bg-gray-300 text-gray-800">
          <Award className="w-3 h-3 mr-1" />
          {t('users.rankSilver')}
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
          <Award className="w-3 h-3 mr-1" />
          {t('users.rankGold')}
        </Badge>
      );
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#8B6F8E]"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold" style={{ color: '#8B6F8E' }}>
            {t('users.title')}
          </h1>
          <p className="text-sm sm:text-base text-gray-500 mt-1">
            {t('users.subtitle', { count: users.length })}
          </p>
        </div>
        <Button
          onClick={handleSendNotification}
          disabled={selectedUsers.length === 0}
          className="bg-[#F4C2C2] hover:bg-[#F4C2C2]/90 text-white w-full sm:w-auto"
          data-testid="send-notification-button"
        >
          <Send className="w-4 h-4 mr-2" />
          {selectedUsers.length > 0
            ? t('users.sendToSelected', { count: selectedUsers.length })
            : t('users.sendNotification')}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <Card className="p-3 sm:p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-500 truncate">{t('users.totalUsers')}</p>
              <p className="text-xl sm:text-2xl font-bold truncate" style={{ color: '#8B6F8E' }}>
                {users.length}
              </p>
            </div>
            <UsersIcon className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0" style={{ color: '#8B6F8E' }} />
          </div>
        </Card>

        <Card className="p-3 sm:p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-500 truncate">{t('users.activeUsers')}</p>
              <p className="text-xl sm:text-2xl font-bold text-green-600 truncate">
                {users.filter((u) => u.total_bookings > 0).length}
              </p>
            </div>
            <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0 text-green-600" />
          </div>
        </Card>

        <Card className="p-3 sm:p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-500 truncate">{t('users.totalBookings')}</p>
              <p className="text-xl sm:text-2xl font-bold text-blue-600 truncate">
                {users.reduce((acc, u) => acc + u.total_bookings, 0)}
              </p>
            </div>
            <Calendar className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0 text-blue-600" />
          </div>
        </Card>

        <Card className="p-3 sm:p-4">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-xs sm:text-sm text-gray-500 truncate">{t('users.completedBookings')}</p>
              <p className="text-xl sm:text-2xl font-bold text-purple-600 truncate">
                {users.reduce((acc, u) => acc + u.completed_bookings, 0)}
              </p>
            </div>
            <Award className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Search */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder={t('users.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="search-users-input"
          />
        </div>
      </div>

      {/* Desktop Users Table */}
      <Card className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectAll}
                  onCheckedChange={handleSelectAll}
                  data-testid="select-all-checkbox"
                />
              </TableHead>
              <TableHead>{t('users.name')}</TableHead>
              <TableHead>{t('users.email')}</TableHead>
              <TableHead>{t('users.joinedDate')}</TableHead>
              <TableHead className="text-center">{t('users.totalBookings')}</TableHead>
              <TableHead className="text-center">{t('users.completedBookings')}</TableHead>
              <TableHead className="text-center">{t('users.rank')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-gray-500 py-8">
                  {searchTerm ? t('users.noResults') : t('users.noUsers')}
                </TableCell>
              </TableRow>
            ) : (
              filteredUsers.map((user) => (
                <TableRow key={user.id} data-testid={`user-row-${user.id}`}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.includes(user.id)}
                      onCheckedChange={() => handleSelectUser(user.id)}
                      data-testid={`select-user-${user.id}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {user.profile_picture ? (
                        <img
                          src={user.profile_picture}
                          alt={user.name}
                          className="w-8 h-8 rounded-full"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-[#F8E6E9] flex items-center justify-center">
                          <span className="text-sm font-medium" style={{ color: '#8B6F8E' }}>
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span className="font-medium">{user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{formatDate(user.created_at)}</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline">{user.total_bookings}</Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="bg-green-50 text-green-700">
                      {user.completed_bookings}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    {getRankBadge(user.completed_bookings)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Mobile Users Cards */}
      <div className="md:hidden space-y-4">
        {filteredUsers.length === 0 ? (
          <Card className="p-8 text-center text-gray-500">
            {searchTerm ? t('users.noResults') : t('users.noUsers')}
          </Card>
        ) : (
          filteredUsers.map((user) => (
            <Card key={user.id} className="p-4 space-y-4" data-testid={`user-row-${user.id}`}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={() => handleSelectUser(user.id)}
                    data-testid={`select-user-${user.id}`}
                    className="flex-shrink-0 mt-1"
                  />
                  {user.profile_picture ? (
                    <img
                      src={user.profile_picture}
                      alt={user.name}
                      className="w-10 h-10 rounded-full flex-shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#F8E6E9] flex items-center justify-center flex-shrink-0">
                      <span className="text-base font-medium" style={{ color: '#8B6F8E' }}>
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-gray-900 truncate">{user.name}</h3>
                    <p className="text-sm text-gray-600 truncate">{user.email}</p>
                  </div>
                </div>
                {getRankBadge(user.completed_bookings)}
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500 font-medium">{t('users.joinedDate')}</p>
                  <p className="text-gray-900">{formatDate(user.created_at)}</p>
                </div>
                <div>
                  <p className="text-gray-500 font-medium">{t('users.totalBookings')}</p>
                  <Badge variant="outline" className="mt-1">{user.total_bookings}</Badge>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500 font-medium">{t('users.completedBookings')}</p>
                  <Badge variant="outline" className="bg-green-50 text-green-700 mt-1">
                    {user.completed_bookings}
                  </Badge>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Send Notification Modal */}
      {showNotificationModal && (
        <SendNotificationModal
          isOpen={showNotificationModal}
          onClose={() => setShowNotificationModal(false)}
          selectedUsers={selectedUsers}
          onSuccess={handleNotificationSent}
        />
      )}
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
