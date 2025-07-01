import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import API from '../config/Api';

const Dashboard = ({ role, onLogout }) => {
  const [message, setMessage] = useState("");
  const [roleMessage, setRoleMessage] = useState("");
  const roles = JSON.parse(localStorage.getItem('roles') || '[]');

  useEffect(() => {

    if (roles.includes('ROLE_ADMIN')) {
      API.get('/admin-profile')
        .then(res => setRoleMessage(res.data))
        .catch(() => setRoleMessage('No admin access'));
    } else if (roles.includes('ROLE_USER')) {
      API.get('/user-profile')
        .then(res => setRoleMessage(res.data))
        .catch(() => setRoleMessage('No user access'));
    }
  }, []);

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar role={role} onLogout={onLogout} />
      <main className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-amber-500 mb-6">
          {role === 'admin' ? 'Admin Dashboard' : 'Student Dashboard'}
        </h1>

        <div className="mb-6">
          <p className="text-gray-700">Welcome to your dashboard!</p>
        </div>

        {role === 'admin' ?
          (
            <div className="p-4 bg-white shadow rounded-lg border border-amber-200">
              <h2 className="text-xl font-semibold mb-2 text-amber-600">
                Admin Feature: Manage Students
              </h2>
              <p className="text-sm text-gray-600">
                You can manage student's data here!.
              </p>
              <button className="mt-4 px-4 py-2 bg-amber-500 text-white rounded hover:bg-amber-600 transition cursor-pointer">
                Go to User Management
              </button>
            </div>
          ) :
          (
            <div className="p-4 bg-white shadow rounded-lg border border-gray-200">
              <h2 className="text-xl font-semibold mb-2 text-gray-700">
                Student Feature: My Activities
              </h2>
              <p className="text-sm text-gray-600">
                Track your activity, settings and preferences here!
              </p>
            </div>
          )}
      </main>
    </div>
  );
};

export default Dashboard;
