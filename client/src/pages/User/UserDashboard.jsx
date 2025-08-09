import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';


const UserDashboard = () => {
  const [user, setUser] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchData = async () => {
      try {
        const [profileRes, dashboardRes, tasksRes] = await Promise.all([
          axiosInstance.get('/auth/profile', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axiosInstance.get('/tasks/user-dashboard-data', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axiosInstance.get('/tasks', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setUser(profileRes.data);
        setDashboardData(dashboardRes.data);
        setTasks(tasksRes.data.tasks || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
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
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-purple-600">Hello {user?.name}</h1>
              <p className="text-purple-600 text-opacity-80">Welcome to your dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                <span className="w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-pink-400 text-white font-semibold text-lg">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-white bg-opacity-20 text-purple-600 rounded-lg hover:bg-opacity-30 transition duration-200"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-600 text-opacity-80 text-sm">Total Tasks</p>
                <p className="text-purple-600 text-3xl font-bold">{dashboardData?.totalTasks || 0}</p>
              </div>
              <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">📋</span>
              </div>
            </div>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-500 text-opacity-80 text-sm">Completed</p>
                <p className="text-green-500 text-3xl font-bold">{dashboardData?.completed || 0}</p>
              </div>
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-500 text-opacity-80 text-sm">Pending</p>
                <p className="text-yellow-500 text-3xl font-bold">{dashboardData?.pending || 0}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xl">⏳</span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Tasks */}
        <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
          <h2 className="text-xl font-bold text-purple-600 mb-4">Recent Tasks</h2>
          <div className="space-y-4">
            {tasks.slice(0, 5).map((task) => (
              <div
                key={task._id}
                className="bg-white bg-opacity-5 rounded-xl p-4 border border-white border-opacity-10 hover:bg-opacity-10 transition duration-200 cursor-pointer"
                onClick={() => navigate(`/user/task-details/${task._id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="text-purple-600 font-semibold">{task.title}</h3>
                    <p className="text-purple-600 text-opacity-70 text-sm mt-1">
                      {task.description?.substring(0, 50)}...
                    </p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)} text-black`}>
                        {task.status}
                      </span>
                      <span className="text-gray-800 text-opacity-60 text-xs">
                        Due: {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-gray-800 text-opacity-60">
                    <span className="text-sm">{task.priority}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {tasks.length === 0 && (
            <div className="text-center py-8">
              <p className="text-purple-600 text-opacity-60">No tasks assigned yet</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => navigate('/user/my-tasks')}
            className="bg-gradient-to-r from-purple-500 to-violet-600 text-white p-6 rounded-2xl hover:opacity-90 transition duration-200"
          >
            <h3 className="text-xl font-bold mb-2">View All Tasks</h3>
            <p className="text-white text-opacity-80">See all your assigned tasks</p>
          </button>

          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-2xl p-6 border border-white border-opacity-20">
            <h3 className="text-xl font-bold text-purple-600 mb-2">Quick Stats</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-blue-900">
                <span>Progress</span>
                <span>{dashboardData?.totalTasks > 0 ? Math.round((dashboardData.completed / dashboardData.totalTasks) * 100) : 0}%</span>
              </div>
              <div className="w-full bg-white bg-opacity-20 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-purple-500 to-violet-600 h-2 rounded-full"
                  style={{
                    width: `${dashboardData?.totalTasks > 0 ? (dashboardData.completed / dashboardData.totalTasks) * 100 : 0}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className=" bottom-0 left-0 right-0 bg-white bg-opacity-10 backdrop-blur-md border-t border-white border-opacity-20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-around items-center">
            <button onClick={() => navigate('/user/dashboard')}
            className="flex flex-col items-center text-purple-600">
              <span className="text-2xl mb-1">🏠</span>
              <span className="text-xs">Home</span>
            </button>
            <button  onClick={() => navigate('/user/my-tasks')} 
            className="flex flex-col items-center text-purple-600">
              <span className="text-2xl mb-1">📋</span>
              <span className="text-xs">Tasks</span>
            </button>
            
  
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
