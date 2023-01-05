import { useState, createContext, useEffect } from 'react';

export const ConfigurationContext = createContext({});

export function ConfigurationProvider({ children }) {
  const [appConfiguration, setAppConfiguration] = useState({
    environment: "",
    xAuthToken: "",
    projectId: "",
  });

  useEffect(() => {
    setAppConfiguration(JSON.parse(localStorage.getItem('appConfiguration')));
  }, [])

  const setApplicationConfiguration = ({...props}) => {
    localStorage.setItem('appConfiguration', JSON.stringify({...props}))
    setAppConfiguration({...props})
  }

  return (
    <ConfigurationContext.Provider
      value={{ appConfiguration, setApplicationConfiguration }}
    >
      {children}
    </ConfigurationContext.Provider>
  );
}
