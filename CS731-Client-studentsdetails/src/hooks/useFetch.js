import { useState, useEffect, useCallback } from 'react';

const useFetch = (url, dependencies = [], options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { manual = false } = options; // allows for manual trigger if needed

  const fetchData = useCallback(async (abortController) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url, { signal: abortController.signal });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const result = await response.json();
      setData(result);
    } catch (error) {
      if (error.name !== 'AbortError') {
        setError(error);
      }
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    const abortController = new AbortController();
    if (!manual) {
      fetchData(abortController);
    }
    return () => {
      abortController.abort();
    };
  }, [url, ...dependencies, fetchData, manual]);

  return { data, loading, error, refetch: () => fetchData(new AbortController()) };
};

export default useFetch;
