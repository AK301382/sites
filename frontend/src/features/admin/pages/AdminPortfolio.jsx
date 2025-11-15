import React, { useEffect, useState } from 'react';
import { adminPortfolioAPI } from '../../../lib/api/adminApi';
import AdminLayout from '../../../components/admin/AdminLayout';

const AdminPortfolio = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPortfolio();
  }, []);

  const fetchPortfolio = async () => {
    try {
      setLoading(true);
      const response = await adminPortfolioAPI.getAll();
      setItems(response.data.items || []);
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (itemId) => {
    if (window.confirm('Are you sure you want to delete this portfolio item?')) {
      try {
        await adminPortfolioAPI.delete(itemId);
        fetchPortfolio();
      } catch (error) {
        console.error('Error deleting item:', error);
        alert('Failed to delete portfolio item');
      }
    }
  };

  const StatusBadge = ({ status }) => {
    const colors = {
      published: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      archived: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
    };
    return (
      <span className={`px-3 py-1 text-xs font-medium rounded-full ${colors[status] || colors.draft}`}>
        {status}
      </span>
    );
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Portfolio Items</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Manage portfolio projects</p>
          </div>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
            Add New Project
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">Loading portfolio items...</div>
        ) : items.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">💼</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Portfolio Items Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Add your first project to showcase your work</p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
              Add First Project
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                {item.image_url && (
                  <img src={item.image_url} alt={item.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <StatusBadge status={item.status} />
                    {item.featured && (
                      <span className="text-yellow-500 text-xl" title="Featured">⭐</span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                    {item.client}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {item.short_description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {item.technologies?.slice(0, 3).map((tech, idx) => (
                      <span key={idx} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-xs rounded">
                        {tech}
                      </span>
                    ))}
                    {item.technologies?.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 text-xs rounded">
                        +{item.technologies.length - 3}
                      </span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPortfolio;
