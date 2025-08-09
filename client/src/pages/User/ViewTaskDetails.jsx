import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import axiosInstance from '../../utils/axiosInstance';

const ViewTaskDetails = () => {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newTodo, setNewTodo] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchTask = async () => {
      try {
        const response = await axiosInstance.get(`/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTask(response.data.task);
      } catch (error) {
        console.error('Error fetching task:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id, navigate]);

  const updateTaskStatus = async (newStatus) => {
    const token = localStorage.getItem('token');
    try {
      setUpdating(true);
      await axiosInstance.put(`/tasks/${id}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTask(prev => ({ ...prev, status: newStatus }));
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const toggleTodo = async (todoIndex) => {
    const token = localStorage.getItem('token');
    try {
      const updatedTodoList = task.todoList.map((todo, index) => 
        index === todoIndex ? { ...todo, completed: !todo.completed } : todo
      );
      
      await axiosInstance.put(`/tasks/${id}/todo`, 
        { todoList: updatedTodoList },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTask(prev => ({ ...prev, todoList: updatedTodoList }));
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  const addTodo = async () => {
    if (!newTodo.trim()) return;
    
    const token = localStorage.getItem('token');
    try {
      const updatedTodoList = [...task.todoList, { text: newTodo.trim(), completed: false }];
      
      await axiosInstance.put(`/tasks/${id}/todo`, 
        { todoList: updatedTodoList },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTask(prev => ({ ...prev, todoList: updatedTodoList }));
      setNewTodo('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };

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

  if (!task) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600 flex items-center justify-center">
        <div className="text-white text-xl">Task not found</div>
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
                onClick={() => navigate('/user/my-tasks')}
                className="text-purple-500 hover:text-opacity-80"
              >
                ← Back
              </button>
              <h1 className="text-2xl font-bold text-purple-600">Task Details</h1>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)} text-white`}>
              {task.status}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Task Header */}
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20 mb-6">
          <h2 className="text-2xl font-bold text-purple-700 mb-4">{task.title}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <span className="text-purple-600 text-opacity-60 text-sm">Priority</span>
              <p className={`font-medium ${getPriorityColor(task.priority)}`}>{task.priority}</p>
            </div>
            <div>
              <span className="text-purple-600 text-opacity-60 text-sm">Due Date</span>
              <p className="text-purple-600">{new Date(task.dueDate).toLocaleDateString()}</p>
            </div>
            <div>
              <span className="text-purple-600 text-opacity-60 text-sm">Created</span>
              <p className="text-purple-600">{new Date(task.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          {task.description && (
            <div className="mb-4">
              <span className="text-purple-600 text-opacity-60 text-sm">Description</span>
              <p className="text-purple-600 mt-1">{task.description}</p>
            </div>
          )}

          {/* Status Update */}
          <div className="flex items-center space-x-4">
            <span className="text-purple-600 text-opacity-60 text-sm">Update Status:</span>
            <div className="flex space-x-2">
              {['Pending', 'In Progress', 'Completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => updateTaskStatus(status)}
                  disabled={updating || task.status === status}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition duration-200 ${
                    task.status === status
                      ? `${getStatusColor(status)} text-white`
                      : 'bg-white bg-opacity-20 text-purple-600 hover:bg-opacity-30'
                  } disabled:opacity-50`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Todo List */}
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20 mb-6">
          <h3 className="text-xl font-bold text-purple-500 mb-4">Checklist</h3>
          
          <div className="space-y-3 mb-4">
            {task.todoList && task.todoList.length > 0 ? (
              task.todoList.map((todo, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(index)}
                    className="w-5 h-5 text-purple-600 bg-white bg-opacity-20 border-white border-opacity-30 rounded focus:ring-purple-500 focus:ring-2"
                  />
                  <span className={`text-purple-500 ${todo.completed ? 'line-through text-opacity-60' : ''}`}>
                    {todo.text}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-white text-opacity-60">No checklist items yet</p>
            )}
          </div>

          {/* Add New Todo */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              placeholder="Add a new checklist item..."
              className="flex-1 px-4 py-2 rounded-lg bg-white bg-opacity-20 border border-purple-300 border-opacity-30 focus:outline-none focus:ring-2 focus:ring-violet-400 text-purple-500 placeholder-gray-500 placeholder-opacity-70"
            />
            <button
              onClick={addTodo}
              disabled={!newTodo.trim()}
              className="px-4 py-2 bg-gradient-to-r from-purple-500 to-violet-600 text-white rounded-lg hover:opacity-90 transition duration-200 disabled:opacity-50"
            >
              Add
            </button>
          </div>
        </div>

        {/* Progress */}
        {task.todoList && task.todoList.length > 0 && (
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20 mb-6">
            <h3 className="text-xl font-bold text-purple-500 mb-4">Progress</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-purple-500">
                <span>Completed Items</span>
                <span>{task.todoList.filter(item => item.completed).length}/{task.todoList.length}</span>
              </div>
              <div className="w-full bg-white bg-opacity-20 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-purple-500 to-violet-600 h-3 rounded-full transition-all duration-300"
                  style={{
                    width: `${task.todoList.length > 0 ? (task.todoList.filter(item => item.completed).length / task.todoList.length) * 100 : 0}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        )}

        {/* Attachments */}
        {task.attachments && (
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
            <h3 className="text-xl font-bold text-blue-600 mb-4">Attachments</h3>
            <div className="text-blue-600 text-opacity-70">
              {task.attachments}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation */}
      <div className="bottom-0 left-0 right-0 bg-white bg-opacity-10 backdrop-blur-md border-t border-white border-opacity-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-around items-center">
            <button 
              onClick={() => navigate('/user/dashboard')}
              className="flex flex-col items-center text-purple-500"
            >
              <span className="text-2xl mb-1">🏠</span>
              <span className="text-xs">Home</span>
            </button>
            <button 
              onClick={() => navigate('/user/my-tasks')}
              className="flex flex-col items-center text-purple-500"
            >
              <span className="text-2xl mb-1">📋</span>
              <span className="text-xs">Tasks</span>
            </button>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTaskDetails;
