import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box
} from '@mui/material';
import { useNavigate } from 'react-router-dom';  // Make sure this import exists
import { useAuth } from '../../hooks/useAuth';

const Header = () => {
  const navigate = useNavigate();  // Make sure this line exists
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/');  // This should work now
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          Discogs Price Alerts
        </Typography>

        {user ? (
          <Box>
            <Button color="inherit" onClick={() => navigate('/dashboard')}>
              Dashboard
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        ) : (
          <Box>
            <Button color="inherit" onClick={() => navigate('/login')}>
              Login
            </Button>
            <Button color="inherit" onClick={() => navigate('/register')}>
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Header;