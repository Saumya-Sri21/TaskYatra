import React from 'react';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-500 via-purple-600 to-indigo-600">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">TaskYatra</h1>
          <p className="text-white text-opacity-80">Your Task Management Solution</p>
        </div>
        {children}
      </div>
    </div>
  );
};

export default AuthLayout;
