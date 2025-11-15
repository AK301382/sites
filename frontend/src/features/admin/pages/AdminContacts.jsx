import React, { useEffect, useState } from 'react';
import { adminContactsAPI } from '../../../lib/api/adminApi';
import AdminLayout from '../../../components/admin/AdminLayout';

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(null);
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, [filter]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await adminContactsAPI.getAll(filter);
      setContacts(response.data.contacts);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (contactId, newStatus) => {
    try {
      await adminContactsAPI.updateStatus(contactId, newStatus);
      fetchContacts();
      if (selectedContact?.id === contactId) {
        setSelectedContact({ ...selectedContact, status: newStatus });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    }
  };

  const handleDelete = async (contactId) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await adminContactsAPI.delete(contactId);
        fetchContacts();
        if (selectedContact?.id === contactId) {
          setSelectedContact(null);
        }
      } catch (error) {
        console.error('Error deleting contact:', error);
        alert('Failed to delete contact');
      }
    }
  };

  const StatusBadge = ({ status }) => {
    const colors = {
      new: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      read: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      replied: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      archived: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    };
    return (
      <span className={`px-3 py-1 text-xs font-medium rounded-full ${colors[status] || colors.new}`}>
        {status}
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Contact Submissions</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Manage all contact form submissions</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setFilter(null)}
              className={`px-4 py-2 rounded-lg font-medium transition ${filter === null ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilter('new')}
              className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'new' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            >
              New
            </button>
            <button
              onClick={() => setFilter('read')}
              className={`px-4 py-2 rounded-lg font-medium transition ${filter === 'read' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}
            >
              Read
            </button>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">Loading contacts...</div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-900">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Service</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                  {contacts.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                        No contacts found
                      </td>
                    </tr>
                  ) : (
                    contacts.map((contact) => (
                      <tr key={contact.id} className="hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" onClick={() => setSelectedContact(contact)}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {contact.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {contact.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {contact.service || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <StatusBadge status={contact.status} />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(contact.created_at).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                          <select
                            value={contact.status}
                            onChange={(e) => {
                              e.stopPropagation();
                              handleStatusChange(contact.id, e.target.value);
                            }}
                            className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                          >
                            <option value="new">New</option>
                            <option value="read">Read</option>
                            <option value="replied">Replied</option>
                            <option value="archived">Archived</option>
                          </select>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(contact.id);
                            }}
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

        {/* Contact Detail Modal */}
        {selectedContact && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={() => setSelectedContact(null)}>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Contact Details</h2>
                  <button onClick={() => setSelectedContact(null)} className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</label>
                    <p className="text-gray-900 dark:text-white mt-1">{selectedContact.name}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                    <p className="text-gray-900 dark:text-white mt-1">{selectedContact.email}</p>
                  </div>
                  {selectedContact.phone && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone</label>
                      <p className="text-gray-900 dark:text-white mt-1">{selectedContact.phone}</p>
                    </div>
                  )}
                  {selectedContact.company && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Company</label>
                      <p className="text-gray-900 dark:text-white mt-1">{selectedContact.company}</p>
                    </div>
                  )}
                  {selectedContact.service && (
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Service Interested</label>
                      <p className="text-gray-900 dark:text-white mt-1">{selectedContact.service}</p>
                    </div>
                  )}
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Message</label>
                    <p className="text-gray-900 dark:text-white mt-1 whitespace-pre-wrap">{selectedContact.message}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Status</label>
                    <div className="mt-1"><StatusBadge status={selectedContact.status} /></div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Submitted</label>
                    <p className="text-gray-900 dark:text-white mt-1">{new Date(selectedContact.created_at).toLocaleString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminContacts;
