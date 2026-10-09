import { useState, useEffect, useCallback } from 'react';
import { checkHealth } from '../services/healthService';

export const useHealthCheck = () => {
  const [status, setStatus] = useState('loading'); // 'loading' | 'connected' | 'error'
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const fetchHealth = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      const result = await checkHealth();
      setData(result);
      setStatus('connected');
    } catch (err) {
      console.error('API health check error:', err);
      setError(err.message || 'Failed to connect to backend API');
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    fetchHealth();
  }, [fetchHealth]);

  return { status, data, error, refetch: fetchHealth };
};

export default useHealthCheck;
