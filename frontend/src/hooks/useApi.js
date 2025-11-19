import { useState, useEffect, useCallback } from 'react';

export const useApi = (apiFunc, options = {}) => {
  const { autoFetch = true, params = null } = options;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(autoFetch);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async (fetchParams = params) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiFunc(fetchParams);
      setData(response.data);
      return response.data;
    } catch (err) {
      setError(err);
      console.error('API Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunc, params]);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [autoFetch, fetchData]);

  const refetch = useCallback(() => fetchData(), [fetchData]);

  return { data, loading, error, refetch, fetchData };
};

// Cache implementation for frequently accessed data
const cache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

export const useCachedApi = (key, apiFunc, options = {}) => {
  const { autoFetch = true } = options;
  const [data, setData] = useState(() => {
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      return cached.data;
    }
    return null;
  });
  const [loading, setLoading] = useState(!data && autoFetch);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    // Check cache first
    const cached = cache.get(key);
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      setData(cached.data);
      setLoading(false);
      return cached.data;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await apiFunc();
      const responseData = response.data;
      cache.set(key, {
        data: responseData,
        timestamp: Date.now(),
      });
      setData(responseData);
      return responseData;
    } catch (err) {
      setError(err);
      console.error('API Error:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [key, apiFunc]);

  useEffect(() => {
    if (autoFetch && !data) {
      fetchData();
    }
  }, [autoFetch, data, fetchData]);

  const refetch = useCallback(() => {
    cache.delete(key);
    return fetchData();
  }, [key, fetchData]);

  return { data, loading, error, refetch };
};

// Clear cache manually
export const clearApiCache = (key) => {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
};
