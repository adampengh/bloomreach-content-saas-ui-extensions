import { useState, createContext, useEffect } from 'react';

export const ConfigurationContext = createContext({});

export function ConfigurationProvider({ children }) {
  const [appConfiguration, setAppConfiguration] = useState({
    source: {
      environment: '',
      xAuthToken: '',
      projectId: 'core',
    },
    target: {
      environment: '',
      xAuthToken: '',
      projectId: 'core',
    },
    pages: {
      components: {
        selections: {
          projectId: '',
          channelId: '',
          componentGroup: '',
        }
      }
    }
  });

  useEffect(() => {
    if (localStorage.getItem('appConfiguration')) {
      setAppConfiguration(JSON.parse(localStorage.getItem('appConfiguration')));
    }
  }, [])

  const storeApplicationConfiguration = ({...props}) => {
    localStorage.setItem('appConfiguration', JSON.stringify({...props}))
    setAppConfiguration({...props})
  }

  return (
    <ConfigurationContext.Provider
      value={{ appConfiguration, setAppConfiguration, storeApplicationConfiguration }}
    >
      {children}
    </ConfigurationContext.Provider>
  );
}
