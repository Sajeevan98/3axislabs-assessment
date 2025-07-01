import React, { useState } from 'react';
import Dashboard from './screens/Dashboard';
import Login from './screens/Login';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { Header } from './Components/Header';

const App = () => {

  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('jwtToken'));
  const [role, setRole] = useState(localStorage.getItem('role'));

  const handleLogin = (userRole, jwtToken) => {
    setIsLoggedIn(true);
    setRole(userRole);
  };

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('username');
    localStorage.removeItem('roles');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setRole(null);
  };

  const elmentForLogin = isLoggedIn ? (
    <Navigate to={role === 'admin' ? '/admin-profile' : '/user-profile'} />
  ) : (
    <>
      <Header />
      <Login onLogin={handleLogin} />
    </>
  );

  return (
    <Router>
      <div className="App">
        <Routes>
           <Route
            path="/"
            element={elmentForLogin}
          />
          <Route
            path="/login"
            element={elmentForLogin}
          />
          <Route
            path="/user-profile"
            element={
              isLoggedIn && role === 'user' ? (
                <Dashboard role="user" onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/admin-profile"
            element={
              isLoggedIn && role === 'admin' ? (
                <Dashboard role="admin" onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  )
}

export default App