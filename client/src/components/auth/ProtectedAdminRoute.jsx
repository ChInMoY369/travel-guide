import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { Box, CircularProgress, Typography } from '@mui/material';

/**
 * A route component that only allows access to users with admin role.
 * Redirects to homepage if user is not authenticated or lacks admin role.
 */
const ProtectedAdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useContext(AuthContext);

  // Show loading while checking authentication
  if (loading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '50vh' }}>
        <CircularProgress />
        <Typography variant="body1" sx={{ mt: 2 }}>
          Checking authorization...
        </Typography>
      </Box>
    );
  }

  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user is authorized as admin
  const isAuthorized = 
    // Has admin role
    (user && user.role === 'admin') || 
    // Is the specified admin email
    (user && user.email === 'chinmoypubg8011@gmail.com');

  console.log('Admin route access check:', {
    email: user?.email,
    role: user?.role,
    isAuthorized
  });

  // If not authorized, redirect to homepage
  if (!isAuthorized) {
    return <Navigate to="/" replace />;
  }

  // If user is admin, render the protected content
  return children;
};

export default ProtectedAdminRoute; 