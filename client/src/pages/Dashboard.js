import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Tab,
  Tabs,
  Card,
  CardContent,
  Button,
  Alert
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import api from '../config/api';
import DiscogsSetup from '../components/DiscogsSetup';
import CollectionView from '../components/CollectionView';
import WantlistView from '../components/WantlistView';
import AlertsView from '../components/AlertsView';

const Dashboard = () => {
  const { user } = useAuth();
  const [currentTab, setCurrentTab] = useState(0);
  const [discogsConnected, setDiscogsConnected] = useState(false);

  useEffect(() => {
    setDiscogsConnected(!!user?.discogs_token);
  }, [user]);

  const handleTabChange = (event, newValue) => {
    setCurrentTab(newValue);
  };

  if (!discogsConnected) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <DiscogsSetup onConnect={() => setDiscogsConnected(true)} />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Welcome back, {user?.first_name}!
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={currentTab} onChange={handleTabChange}>
          <Tab label="Collection" />
          <Tab label="Wantlist" />
          <Tab label="Price Alerts" />
        </Tabs>
      </Box>

      {currentTab === 0 && <CollectionView />}
      {currentTab === 1 && <WantlistView />}
      {currentTab === 2 && <AlertsView />}
    </Container>
  );
};

export default Dashboard;