// src/components/PrivateRoute.js

import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = ({ children, requiredRole }) => {

  const { isAuthenticated, loading } = useSelector((state) => state.auth);
  const { user } = useSelector((state) => state.auth) || {};
  const role = user?.role;


  if (loading) {
    return <div>Loading...</div>; // Or a spinner
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if the user has the required role
  if (requiredRole && role!== requiredRole && requiredRole !== 'any') {
    return <Navigate to="/forbidden" replace />;
  }

  return children;
};

export default PrivateRoute;
