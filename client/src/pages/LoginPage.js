import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const LoginPage = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Login
        </Typography>
        <Typography>
          Login form will go here
        </Typography>
      </Box>
    </Container>
  );
};

export default LoginPage;