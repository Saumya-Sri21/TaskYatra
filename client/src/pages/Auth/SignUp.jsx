import React, { useState } from 'react';
import AuthLayout from '../../components/layouts/AuthLayout';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../utils/axiosInstance';
import { toast } from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminInviteToken: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login: loginContext } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      toast.error('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const { data } = await axiosInstance.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        adminInviteToken: formData.adminInviteToken || undefined
      });
      if (data.token) {
        loginContext(data, data.token);
        toast.success('Account created successfully!');
        if (data.role === 'admin') navigate('/admin/dashboard');
        else navigate('/user/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600">
        <div className="w-full max-w-md p-8 bg-white bg-opacity-10 backdrop-blur-md shadow-2xl rounded-3xl border border-white border-opacity-20 text-purple-500">
          <h2 className="text-3xl font-bold text-center mb-6">Create Account</h2>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded text-sm mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-5">
            <div>
              <label className="block mb-1 text-sm font-medium text-white"></label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-violet-400 placeholder-gray-600 placeholder-opacity-70"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-white"></label>
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-violet-400 placeholder-gray-600 placeholder-opacity-70"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-white"></label>
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-violet-400 placeholder-gray-600 placeholder-opacity-70"
                placeholder="Enter your password"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-white"></label>
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-violet-400 placeholder-gray-600 placeholder-opacity-70"
                placeholder="Confirm your password"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium text-white"></label>
              <input
                type="text"
                name="adminInviteToken"
                value={formData.adminInviteToken}
                onChange={handleChange}
                className="w-full px-4 py-2 rounded-lg bg-white bg-opacity-20 border border-white border-opacity-30 focus:outline-none focus:ring-2 focus:ring-violet-400 placeholder-gray-600 placeholder-opacity-70"
                placeholder="Enter admin token if you have one"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-500 to-violet-600 hover:opacity-90 transition duration-200 font-semibold disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p className="mt-4 text-center text-sm text-purple-600 text-opacity-70">
            Already have an account?{' '}
            <a href="/login" className="text-purple-950 font-medium hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignUp;
