import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from '../../utils/axiosInstance'

const MyTask = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchTasks = async () => {
      try {
        const response = await axiosInstance.get('/tasks', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(response.data.tasks || []);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [navigate]);

  const filteredTasks = tasks.filter(task => {
    const matchesFilter = filter === 'all' || task.status.toLowerCase() === filter.toLowerCase();
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed':
        return 'bg-green-500';
      case 'In Progress':
        return 'bg-yellow-500';
      default:
        return 'bg-purple-500';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'text-red-400';
      case 'Middle':
        return 'text-yellow-400';
      default:
        return 'text-green-400';
    }
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
                onClick={() => navigate('/user/dashboard')}
                className="text-purple-600 hover:text-opacity-80"
              >
                ← Back
              </button>
              <h1 className="text-2xl font-bold text-purple-600">My Tasks</h1>
            </div>
            <div className="text-purple-600">
              {filteredTasks.length} tasks
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="container mx-auto px-4 py-6">
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="block text-purple-600 text-sm font-medium mb-2">Search Tasks</label>
              <input
                type="text"
                placeholder="Search by title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 border border-purple-300 border-opacity-30 focus:outline-none focus:ring-2 focus:ring-violet-400 text-purple-600 placeholder-gray-500 placeholder-opacity-70"
              />
            </div>

            {/* Filter */}
            <div>
              <label className="block text-purple-600 text-sm font-medium mb-2">Filter by Status</label>
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 border border-purple-300 border-opacity-30 focus:outline-none focus:ring-2 focus:ring-violet-400 text-purple-600"
              >
                <option value="all">All Tasks</option>
                <option value="pending">Pending</option>
                <option value="in progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tasks List */}
        <div className="space-y-4">
          {filteredTasks.map((task) => (
            <div
              key={task._id}
              className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20 hover:bg-opacity-15 transition duration-200 cursor-pointer"
              onClick={() => navigate(`/user/task-details/${task._id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-purple-600 font-semibold text-lg">{task.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)} text-purple-600`}>
                      {task.status}
                    </span>
                  </div>
                  
                  {task.description && (
                    <p className="text-purple-600 text-opacity-70 mb-3">
                      {task.description.length > 100 
                        ? `${task.description.substring(0, 100)}...` 
                        : task.description
                      }
                    </p>
                  )}

                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="text-purple-600 text-opacity-60">Priority:</span>
                      <span className={`font-medium ${getPriorityColor(task.priority)}`}>
                        {task.priority}
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <span className="text-purple-600 text-opacity-60">Due:</span>
                      <span className="text-purple-600">
                        {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>

                    {task.todoList && task.todoList.length > 0 && (
                      <div className="flex items-center space-x-2">
                        <span className="text-purple-600 text-opacity-60">Checklist:</span>
                        <span className="text-purple-600">
                          {task.todoList.filter(item => item.completed).length}/{task.todoList.length}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-gray-900 text-opacity-60 text-sm">
                    {new Date(task.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredTasks.length === 0 && (
          <div className="text-center py-12">
            <div className="text-white text-opacity-60 text-lg mb-2">
              {searchTerm || filter !== 'all' ? 'No tasks found' : 'No tasks assigned yet'}
            </div>
            <p className="text-white text-opacity-40">
              {searchTerm || filter !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'Tasks assigned to you will appear here'
              }
            </p>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white bg-opacity-10 backdrop-blur-md border-t border-white border-opacity-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-around items-center">
            <button 
              onClick={() => navigate('/user/dashboard')}
              className="flex flex-col items-center text-purple-600"
            >
              <span className="text-2xl mb-1">🏠</span>
              <span className="text-xs">Home</span>
            </button>
            <button className="flex flex-col items-center text-purple-600">
              <span className="text-2xl mb-1">📋</span>
              <span className="text-xs">Tasks</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyTask;
