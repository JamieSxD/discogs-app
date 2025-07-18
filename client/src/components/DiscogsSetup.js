import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Box,
  Link,
  Paper
} from '@mui/material';
import api from '../config/api';
import { useAuth } from '../hooks/useAuth';  // Add this import

const DiscogsSetup = ({ onConnect }) => {
  const { setUser } = useAuth();  // We'll need to add this to AuthContext
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleConnect = async () => {
    if (!token.trim()) {
      setError('Please enter your Discogs token');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/discogs/verify-token', { token });
      setSuccess(`Successfully connected! Welcome, ${response.data.discogsProfile.username}`);

      // Update the user object with the new Discogs info
      if (setUser && response.data.user) {
        setUser(response.data.user);
      }

      setTimeout(() => {
        onConnect();
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid token. Please check your Discogs personal access token.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Card elevation={3}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom align="center">
            Connect Your Discogs Account
          </Typography>

          <Typography paragraph color="textSecondary" align="center">
            To get started, you'll need to connect your Discogs account using a personal access token.
          </Typography>

          <Paper sx={{ p: 3, mb: 3, bgcolor: 'grey.50' }}>
            <Typography variant="h6" gutterBottom>
              How to get your token:
            </Typography>
            <Typography component="div" sx={{ '& ol': { pl: 2 } }}>
              <ol>
                <li>
                  Go to{' '}
                  <Link
                    href="https://www.discogs.com/settings/developers"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Discogs Developer Settings
                  </Link>
                </li>
                <li>Click "Generate new token"</li>
                <li>Give it a name (like "Price Alerts App")</li>
                <li>Copy the token and paste it below</li>
              </ol>
            </Typography>
          </Paper>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

          <TextField
            fullWidth
            label="Discogs Personal Access Token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Paste your Discogs token here"
            sx={{ mb: 3 }}
            disabled={loading}
          />

          <Button
            variant="contained"
            onClick={handleConnect}
            disabled={loading || !token.trim()}
            fullWidth
            size="large"
          >
            {loading ? 'Connecting...' : 'Connect Discogs Account'}
          </Button>

          <Box sx={{ mt: 2 }}>
            <Typography variant="body2" color="textSecondary" align="center">
              Your token is stored securely and only used to access your Discogs data.
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default DiscogsSetup;