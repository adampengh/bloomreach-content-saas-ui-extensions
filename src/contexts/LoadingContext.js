import { useState, createContext, useEffect } from 'react';
import { Loader } from 'src/components'

export const LoadingContext = createContext({});

export const LoadingProvider = ({ children }) => {
  const [loading, setLoading] = useState({
    loading: false,
    message: 'Loading'
  });

  useEffect(() => {
    setLoading(loading);
  }, [loading])

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      <Loader loading={loading} setLoading={setLoading} />
      {children}
    </LoadingContext.Provider>
  );
}
