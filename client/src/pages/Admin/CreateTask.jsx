import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateTask = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Low',
    status: 'Pending',
    dueDate: '',
    assignedTo: [],
    attachments: '',
    todoList: []
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [newTodo, setNewTodo] = useState('');
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
      }
    };

    fetchUsers();
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleUserSelection = (userId) => {
    setFormData(prev => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(userId)
        ? prev.assignedTo.filter(id => id !== userId)
        : [...prev.assignedTo, userId]
    }));
  };

  const addTodo = () => {
    if (!newTodo.trim()) return;
    setFormData(prev => ({
      ...prev,
      todoList: [...prev.todoList, { text: newTodo.trim(), completed: false }]
    }));
    setNewTodo('');
  };

  const removeTodo = (index) => {
    setFormData(prev => ({
      ...prev,
      todoList: prev.todoList.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (!formData.title.trim()) {
      setError('Title is required');
      setLoading(false);
      return;
    }

    if (!formData.dueDate) {
      setError('Due date is required');
      setLoading(false);
      return;
    }

    if (formData.assignedTo.length === 0) {
      setError('Please assign the task to at least one user');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:8000/api/tasks', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      navigate('/admin/tasks');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

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
              <h1 className="text-2xl font-bold text-white">Create New Task</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
            {error && (
              <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm mb-4">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Task Title *</label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-violet-400 text-white placeholder-white placeholder-opacity-70"
                    placeholder="Enter task title"
                  />
                </div>

                <div>
                  <label className="block text-white text-sm font-medium mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-violet-400 text-white placeholder-white placeholder-opacity-70"
                    placeholder="Enter task description"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Priority</label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-violet-400 text-white"
                    >
                      <option value="Low">Low</option>
                      <option value="Middle">Middle</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-violet-400 text-white"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white text-sm font-medium mb-2">Due Date *</label>
                    <input
                      type="date"
                      name="dueDate"
                      required
                      value={formData.dueDate}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-violet-400 text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Assign Users */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Assign To *</label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {users.map((user) => (
                    <label key={user._id} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.assignedTo.includes(user._id)}
                        onChange={() => handleUserSelection(user._id)}
                        className="w-4 h-4 text-purple-600 bg-white bg-opacity-20 border-white border-opacity-30 rounded focus:ring-purple-500 focus:ring-2"
                      />
                      <span className="text-white">{user.name}</span>
                    </label>
                  ))}
                </div>
                {users.length === 0 && (
                  <p className="text-white text-opacity-60 text-sm">No users available</p>
                )}
              </div>

              {/* Todo List */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Checklist Items</label>
                <div className="space-y-2 mb-4">
                  {formData.todoList.map((todo, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <span className="text-white">• {todo.text}</span>
                      <button
                        type="button"
                        onClick={() => removeTodo(index)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTodo()}
                    placeholder="Add checklist item..."
                    className="flex-1 px-4 py-2 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-violet-400 text-white placeholder-white placeholder-opacity-70"
                  />
                  <button
                    type="button"
                    onClick={addTodo}
                    disabled={!newTodo.trim()}
                    className="px-4 py-2 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-lg hover:opacity-90 transition duration-200 disabled:opacity-50"
                  >
                    Add
                  </button>
                </div>
              </div>

              {/* Attachments */}
              <div>
                <label className="block text-white text-sm font-medium mb-2">Attachments</label>
                <input
                  type="text"
                  name="attachments"
                  value={formData.attachments}
                  onChange={handleChange}
                  className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-violet-400 text-white placeholder-white placeholder-opacity-70"
                  placeholder="Enter attachment links or notes"
                />
              </div>

              {/* Submit Buttons */}
              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 rounded-lg bg-gradient-to-r from-purple-500 to-violet-600 text-white font-semibold hover:opacity-90 transition duration-200 disabled:opacity-50"
                >
                  {loading ? 'Creating Task...' : 'Create Task'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/admin/dashboard')}
                  className="px-6 py-3 rounded-lg bg-white bg-opacity-20 text-white border border-white border-opacity-30 hover:bg-opacity-30 transition duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

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
            <button 
              onClick={() => navigate('/admin/users')}
              className="flex flex-col items-center text-white"
            >
              <span className="text-2xl mb-1">👥</span>
              <span className="text-xs">Users</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;
