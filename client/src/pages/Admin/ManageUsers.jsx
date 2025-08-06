import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setUsers(response.data.users || []);
      } catch (error) {
        console.error('Error fetching users:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    // Note: This would require a delete user endpoint in the backend
    // For now, we'll just show a message
    alert('Delete user functionality would be implemented here');
    setShowDeleteModal(false);
    setSelectedUser(null);
  };

  const getRoleColor = (role) => {
    return role === 'admin' ? 'text-purple-400' : 'text-blue-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600">
      {/* Header */}
      <div className="bg-white bg-opacity-10 backdrop-blur-md border-b border-white border-opacity-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="text-white hover:text-opacity-80"
              >
                ← Back
              </button>
              <h1 className="text-2xl font-bold text-white">Manage Users</h1>
            </div>
            <div className="text-white">
              {filteredUsers.length} users
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20 mb-6">
          <div>
            <label className="block text-white text-sm font-medium mb-2">Search Users</label>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-violet-400 text-white placeholder-white placeholder-opacity-70"
            />
          </div>
        </div>

        {/* Users List */}
        <div className="space-y-4">
          {filteredUsers.map((user) => (
            <div
              key={user._id}
              className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20 hover:bg-opacity-15 transition duration-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-lg">
                      {user.name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg">{user.name}</h3>
                    <p className="text-white text-opacity-70">{user.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(user.role)} bg-white bg-opacity-10`}>
                        {user.role}
                      </span>
                      <span className="text-white text-opacity-60 text-xs">
                        Joined: {new Date(user.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => navigate(`/admin/users/edit/${user._id}`)}
                    className="px-3 py-1 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition duration-200 text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setSelectedUser(user);
                      setShowDeleteModal(true);
                    }}
                    className="px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-white text-opacity-60 text-lg mb-2">
              {searchTerm ? 'No users found' : 'No users registered yet'}
            </div>
            <p className="text-white text-opacity-40">
              {searchTerm 
                ? 'Try adjusting your search criteria' 
                : 'Users will appear here once they register'
              }
            </p>
          </div>
        )}

        {/* User Statistics */}
        <div className="mt-8 bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
          <h3 className="text-xl font-bold text-white mb-4">User Statistics</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-white text-opacity-60 text-sm">Total Users</p>
              <p className="text-white text-3xl font-bold">{users.length}</p>
            </div>
            <div className="text-center">
              <p className="text-white text-opacity-60 text-sm">Admins</p>
              <p className="text-white text-3xl font-bold">
                {users.filter(user => user.role === 'admin').length}
              </p>
            </div>
            <div className="text-center">
              <p className="text-white text-opacity-60 text-sm">Regular Users</p>
              <p className="text-white text-3xl font-bold">
                {users.filter(user => user.role === 'user').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-white mb-4">Delete User</h3>
            <p className="text-white text-opacity-80 mb-6">
              Are you sure you want to delete "{selectedUser?.name}"? This action cannot be undone.
            </p>
            <div className="flex space-x-4">
              <button
                onClick={handleDeleteUser}
                className="flex-1 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-200"
              >
                Delete
              </button>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setSelectedUser(null);
                }}
                className="flex-1 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white bg-opacity-10 backdrop-blur-md border-t border-white border-opacity-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-around items-center">
            <button 
              onClick={() => navigate('/admin/dashboard')}
              className="flex flex-col items-center text-white"
            >
              <span className="text-2xl mb-1">🏠</span>
              <span className="text-xs">Dashboard</span>
            </button>
            <button 
              onClick={() => navigate('/admin/tasks')}
              className="flex flex-col items-center text-white"
            >
              <span className="text-2xl mb-1">📋</span>
              <span className="text-xs">Tasks</span>
            </button>
            <button className="flex flex-col items-center text-white">
              <span className="text-2xl mb-1">👥</span>
              <span className="text-xs">Users</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;
