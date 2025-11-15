import React, { useEffect, useState } from 'react';
import { adminNewsletterAPI } from '../../../lib/api/adminApi';
import AdminLayout from '../../../components/admin/AdminLayout';

const AdminNewsletter = () => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('active');

  useEffect(() => {
    fetchSubscribers();
  }, [filter]);

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const response = await adminNewsletterAPI.getAll(filter);
      setSubscribers(response.data.subscribers);
    } catch (error) {
      console.error('Error fetching subscribers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (subscriberId, newStatus) => {
    try {
      await adminNewsletterAPI.updateStatus(subscriberId, newStatus);
      fetchSubscribers();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleDelete = async (subscriberId) => {
    if (window.confirm('Are you sure you want to delete this subscriber?')) {
      try {
        await adminNewsletterAPI.delete(subscriberId);
        fetchSubscribers();
      } catch (error) {
        console.error('Error deleting subscriber:', error);
        alert('Failed to delete subscriber');
      }
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Email', 'Status', 'Subscribed Date'],
      ...subscribers.map(sub => [
        sub.email,
        sub.status,
        new Date(sub.subscribed_at).toLocaleString()
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `newsletter-subscribers-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  const StatusBadge = ({ status }) => {
    const colors = {
      active: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      unsubscribed: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return (
      <span className={`px-3 py-1 text-xs font-medium rounded-full ${colors[status] || colors.active}`}>
        {status}
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Newsletter Subscribers</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Manage newsletter subscriptions</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'active' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            >
              Active
            </button>
            <button
              onClick={() => setFilter('unsubscribed')}
              className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'unsubscribed' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            >
              Unsubscribed
            </button>
            <button
              onClick={exportToCSV}
              className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition"
            >
              Export CSV
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">Loading subscribers...</div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Subscribed Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Source</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {subscribers.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        No subscribers found
                      </td>
                    </tr>
                  ) : (
                    subscribers.map((subscriber) => (
                      <tr key={subscriber.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {subscriber.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={subscriber.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(subscriber.subscribed_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {subscriber.source || 'website'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                          <select
                            value={subscriber.status}
                            onChange={(e) => handleStatusChange(subscriber.id, e.target.value)}
                            className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            <option value="active">Active</option>
                            <option value="unsubscribed">Unsubscribed</option>
                          </select>
                          <button
                            onClick={() => handleDelete(subscriber.id)}
                            className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminNewsletter;
