import React from 'react';
import { Container, Typography, Box } from '@mui/material';

const RegisterPage = () => {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>
        <Typography>
          Registration form will go here
        </Typography>
      </Box>
    </Container>
  );
};

export default RegisterPage;