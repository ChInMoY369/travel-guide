import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Menu, MenuItem, IconButton, useTheme, Hidden, Tooltip } from '@mui/material';
import { AccountCircle, ExploreOutlined, Menu as MenuIcon, DarkMode, LightMode } from '@mui/icons-material';
import { AuthContext } from '../contexts/AuthContext';
import { DarkModeContext } from '../contexts/DarkModeContext';

const Header = () => {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuAnchorEl, setMobileMenuAnchorEl] = useState(null);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setMobileMenuAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  return (
    <AppBar 
      position="static" 
      sx={{ 
        bgcolor: darkMode ? theme.palette.background.paper : 'white', 
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
        color: darkMode ? theme.palette.text.primary : '#333333'
      }}
    >
      <Toolbar>
        <Typography 
          variant="h5" 
          component={Link} 
          to="/" 
          sx={{ 
            flexGrow: 1, 
            textDecoration: 'none', 
            color: theme.palette.primary.main, 
            display: 'flex', 
            alignItems: 'center',
            fontWeight: 600,
            fontSize: '1.5rem'
          }}
        >
          <ExploreOutlined sx={{ mr: 1, fontSize: '1.8rem' }} />
          Bhubaneswar Travel Guide
        </Typography>

        {/* Desktop Menu */}
        <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
          <Button 
            sx={{ color: theme.palette.primary.main, mx: 0.75, fontWeight: 500 }} 
            component={Link} 
            to="/attractions"
          >
            Attractions
          </Button>
          <Button 
            sx={{ color: theme.palette.primary.main, mx: 0.75, fontWeight: 500 }} 
            component={Link} 
            to="/events"
          >
            Events
          </Button>
          <Button 
            sx={{ color: theme.palette.primary.main, mx: 0.75, fontWeight: 500 }} 
            component={Link} 
            to="/restaurants"
          >
            Restaurants
          </Button>
          <Button 
            sx={{ color: theme.palette.primary.main, mx: 0.75, fontWeight: 500 }} 
            component={Link} 
            to="/accommodations"
          >
            Accommodations
          </Button>
          <Button 
            sx={{ color: theme.palette.primary.main, mx: 0.75, fontWeight: 500 }} 
            component={Link} 
            to="/cultural-insights"
          >
            Cultural Insights
          </Button>

          {/* Dark Mode Toggle Button */}
          <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
            <IconButton 
              onClick={toggleDarkMode} 
              color="primary" 
              sx={{ 
                ml: 1.5,
                p: 1,
                bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
                '&:hover': { 
                  bgcolor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.3s'
              }}
              aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <LightMode /> : <DarkMode />}
            </IconButton>
          </Tooltip>

          {isAuthenticated ? (
            <>
              <IconButton
                edge="end"
                aria-label="account of current user"
                aria-haspopup="true"
                onClick={handleProfileMenuOpen}
                sx={{ color: theme.palette.primary.main, ml: 1 }}
              >
                {user?.profilePicture ? (
                  <Avatar src={user.profilePicture} alt={user.name} sx={{ width: 32, height: 32 }} />
                ) : (
                  <AccountCircle />
                )}
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  sx: {
                    bgcolor: darkMode ? theme.palette.background.paper : 'white',
                    color: darkMode ? theme.palette.text.primary : theme.palette.text.primary
                  }
                }}
              >
                <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>Profile</MenuItem>
                <MenuItem component={Link} to="/favorites" onClick={handleMenuClose}>Favorites</MenuItem>
                {/* Show Admin Dashboard only for admin users or the designated admin email */}
                {(user?.role === 'admin' || user?.email === 'chinmoypubg8011@gmail.com') && 
                  <MenuItem component={Link} to="/admin" onClick={handleMenuClose}>Admin Dashboard</MenuItem>
                }
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button 
                sx={{ color: theme.palette.primary.main, mx: 0.75, fontWeight: 500 }} 
                component={Link} 
                to="/login"
              >
                Login
              </Button>
              <Button 
                variant="contained"
                color="primary"
                component={Link} 
                to="/register"
                sx={{ mx: 0.75 }}
              >
                Register
              </Button>
            </>
          )}
        </Box>

        {/* Mobile Menu Icon */}
        <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
          {/* Dark Mode Toggle Button for Mobile */}
          <IconButton 
            onClick={toggleDarkMode} 
            color="primary" 
            sx={{ 
              mr: 1,
              p: 1,
              bgcolor: darkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              '&:hover': { 
                bgcolor: darkMode ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                transform: 'scale(1.1)'
              },
              transition: 'all 0.3s'
            }}
            aria-label={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {darkMode ? <LightMode /> : <DarkMode />}
          </IconButton>

          <IconButton
            edge="end"
            sx={{ color: theme.palette.primary.main }}
            aria-label="menu"
            onClick={handleMobileMenuOpen}
          >
            <MenuIcon />
          </IconButton>
          <Menu
            anchorEl={mobileMenuAnchorEl}
            open={Boolean(mobileMenuAnchorEl)}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                bgcolor: darkMode ? theme.palette.background.paper : 'white',
                color: darkMode ? theme.palette.text.primary : theme.palette.text.primary
              }
            }}
          >
            <MenuItem component={Link} to="/attractions" onClick={handleMenuClose}>Attractions</MenuItem>
            <MenuItem component={Link} to="/events" onClick={handleMenuClose}>Events</MenuItem>
            <MenuItem component={Link} to="/restaurants" onClick={handleMenuClose}>Restaurants</MenuItem>
            <MenuItem component={Link} to="/accommodations" onClick={handleMenuClose}>Accommodations</MenuItem>
            <MenuItem component={Link} to="/cultural-insights" onClick={handleMenuClose}>Cultural Insights</MenuItem>
            
            {isAuthenticated ? (
              [
                <MenuItem key="profile" component={Link} to="/profile" onClick={handleMenuClose}>Profile</MenuItem>,
                <MenuItem key="favorites" component={Link} to="/favorites" onClick={handleMenuClose}>Favorites</MenuItem>,
                (user?.role === 'admin' || user?.email === 'chinmoypubg8011@gmail.com') ? 
                  <MenuItem key="admin" component={Link} to="/admin" onClick={handleMenuClose}>Admin Dashboard</MenuItem> : null,
                <MenuItem key="logout" onClick={handleLogout}>Logout</MenuItem>
              ].filter(Boolean)
            ) : (
              [
                <MenuItem key="login" component={Link} to="/login" onClick={handleMenuClose}>Login</MenuItem>,
                <MenuItem key="register" component={Link} to="/register" onClick={handleMenuClose}>Register</MenuItem>
              ]
            )}
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header; 