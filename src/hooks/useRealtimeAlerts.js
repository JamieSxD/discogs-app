import { useEffect, useState } from 'react';
import supabase from '../config/supabase';

export const useRealtimeAlerts = (userId) => {
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const subscription = supabase
      .channel('price_alerts')
      .on('postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'price_alerts',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          // Handle real-time updates
          console.log('Alert updated:', payload);
        })
      .subscribe();

    return () => supabase.removeChannel(subscription);
  }, [userId]);

  return alerts;
};