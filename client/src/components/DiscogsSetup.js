import React, { useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Alert,
  Box,
  Link
} from '@mui/material';
import api from '../config/api';

const DiscogsSetup = ({ onConnect }) => {
  const [token, setToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConnect = async () => {
    if (!token.trim()) {
      setError('Please enter your Discogs token');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/discogs/verify-token', { token });
      onConnect();
    } catch (err) {
      setError('Invalid token. Please check your Discogs personal access token.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5" gutterBottom>
          Connect Your Discogs Account
        </Typography>

        <Typography paragraph color="textSecondary">
          To get started, you'll need to connect your Discogs account using a personal access token.
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            How to get your token:
          </Typography>
          <Typography component="div">
            1. Go to{' '}
            <Link href="https://www.discogs.com/settings/developers" target="_blank">
              Discogs Developer Settings
            </Link>
            <br />
            2. Click "Generate new token"
            <br />
            3. Copy the token and paste it below
          </Typography>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        <TextField
          fullWidth
          label="Discogs Personal Access Token"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Paste your Discogs token here"
          sx={{ mb: 2 }}
        />

        <Button
          variant="contained"
          onClick={handleConnect}
          disabled={loading}
          fullWidth
        >
          {loading ? 'Connecting...' : 'Connect Discogs Account'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default DiscogsSetup;