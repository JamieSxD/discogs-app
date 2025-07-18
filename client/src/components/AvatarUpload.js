import React, { useState } from 'react';
import { Button, Avatar, Box, CircularProgress } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import api from '../config/api';

const AvatarUpload = ({ user, onAvatarUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(user?.avatar_url);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await api.post('/users/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setAvatarUrl(response.data.avatar.url);
      onAvatarUpdate?.(response.data.avatar.url);
    } catch (error) {
      console.error('Upload failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Avatar
        src={avatarUrl}
        sx={{ width: 100, height: 100 }}
      >
        {user?.first_name?.[0]}
      </Avatar>

      <Button
        component="label"
        variant="outlined"
        startIcon={loading ? <CircularProgress size={20} /> : <PhotoCamera />}
        disabled={loading}
      >
        Upload Avatar
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={handleFileSelect}
        />
      </Button>
    </Box>
  );
};

export default AvatarUpload;