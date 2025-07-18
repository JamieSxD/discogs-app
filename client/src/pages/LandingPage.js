import React from 'react';
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Card,
  CardContent
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Better Collection View',
      description: 'Browse your Discogs collection with improved filtering and search'
    },
    {
      title: 'Smart Price Alerts',
      description: 'Get notified when items in your wantlist drop to your target price'
    },
    {
      title: 'Market Insights',
      description: 'Track price trends and market data for your favorite releases'
    }
  ];

  return (
    <Container maxWidth="lg">
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Enhance Your Discogs Experience
        </Typography>
        <Typography variant="h5" color="textSecondary" paragraph>
          Never miss a deal again. Get smart price alerts and better collection management.
        </Typography>

        <Box sx={{ mt: 4, mb: 8 }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/register')}
            sx={{ mr: 2 }}
          >
            Get Started Free
          </Button>
          <Button
            variant="outlined"
            size="large"
            onClick={() => navigate('/login')}
          >
            Sign In
          </Button>
        </Box>

        <Grid container spacing={4} sx={{ mt: 4 }}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Typography variant="h6" component="h3" gutterBottom>
                    {feature.title}
                  </Typography>
                  <Typography color="textSecondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 8, p: 4, bgcolor: 'grey.100', borderRadius: 2 }}>
          <Typography variant="h5" gutterBottom>
            How to Connect Your Discogs Account
          </Typography>
          <Typography paragraph>
            1. Sign up for a free account<br/>
            2. Go to your Discogs settings and generate a personal access token<br/>
            3. Connect your account in our dashboard<br/>
            4. Start setting up price alerts!
          </Typography>
        </Box>
      </Box>
    </Container>
  );
};

export default LandingPage;