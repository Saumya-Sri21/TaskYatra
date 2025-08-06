import React, { useState } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { APIPATH } from '../../utils/apiPath';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { login: loginContext, logout } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const { data } = await axiosInstance.post(APIPATH.AUTH.LOGIN, {
        email,
        password,
      });
      if (data.token) {
        loginContext(data, data.token);
        toast.success('Login successful!');
        if (data.role === 'admin') navigate('/admin/dashboard');
        else navigate('/user/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <AuthLayout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600">
        <div className="w-full max-w-md p-8 bg-white bg-opacity-10 backdrop-blur-md shadow-2xl rounded-3xl border border-white border-opacity-20 text-purple-500">
          <h2 className="text-3xl font-bold text-center mb-6">Welcome Back</h2>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block mb-1 text-sm font-medium text-white"></label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-violet-400 placeholder-gray-600 placeholder-opacity-70"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-white"></label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-violet-400  placeholder-gray-600 placeholder-opacity-70"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-500 to-violet-600 hover:opacity-90 transition duration-200 font-semibold"
            >
              Login
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-purple-600 text-opacity-70">
            Don’t have an account?{' '}
            <a href="/signup" className="text-purple-950 font-medium hover:underline">
              Register
            </a>
          </p>
          {/* Example logout button for demonstration */}
          {/* <button onClick={() => { logout(); toast.success('Logged out!'); }} className="mt-4 text-xs text-red-500">Logout</button> */}
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
