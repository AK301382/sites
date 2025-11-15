import React, { useEffect, useState } from 'react';
import { adminBlogAPI } from '../../../lib/api/adminApi';
import AdminLayout from '../../../components/admin/AdminLayout';

const AdminBlog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await adminBlogAPI.getAll();
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      try {
        await adminBlogAPI.delete(postId);
        fetchPosts();
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post');
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Blog Posts</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Manage blog content</p>
          </div>
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
            Create New Post
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-600 dark:text-gray-400">Loading blog posts...</div>
        ) : posts.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-12 text-center">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No Blog Posts Yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Create your first blog post to get started</p>
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition">
              Create First Post
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
                {post.featured_image && (
                  <img src={post.featured_image} alt={post.title} className="w-full h-48 object-cover" />
                )}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <StatusBadge status={post.status} />
                    {post.featured && (
                      <span className="text-yellow-500 text-xl" title="Featured">⭐</span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                    {post.excerpt}
                  </p>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mb-4">
                    <span>👤 {post.author}</span>
                    <span className="mx-2">•</span>
                    <span>📅 {new Date(post.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex space-x-2">
                    <button className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition">
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
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

export default AdminBlog;
