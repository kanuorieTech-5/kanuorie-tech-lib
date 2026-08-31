import { useState, useCallback } from "react";

export default function useApi(apiFunction) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(
    async (...args) => {
      try {
        setLoading(true);
        setError(null);

        const response = await apiFunction(...args);

        setData(response);

        return response;
      } catch (err) {
        setError(err.response?.data || err.message);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [apiFunction],
  );

  return {
    data,
    loading,
    error,
    request,
  };
}
