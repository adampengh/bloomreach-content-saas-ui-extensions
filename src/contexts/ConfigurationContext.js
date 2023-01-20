import { useState, createContext, useEffect } from 'react';

export const ConfigurationContext = createContext({});

export function ConfigurationProvider({ children }) {
  const [appConfiguration, setAppConfiguration] = useState({
    // source: {
    //   environment: 'profserv02',
    //   xAuthToken: 'b6d9883f-3682-4e66-b51d-2f771903d5de',
    //   projectId: 'vhACu',
    // },
    source: {
      environment: '',
      xAuthToken: '',
      projectId: '',
    },
    target: {
      environment: '',
      xAuthToken: '',
      projectId: '',
    }
  });

  useEffect(() => {
    if (localStorage.getItem('appConfiguration')) {
      setAppConfiguration(JSON.parse(localStorage.getItem('appConfiguration')));
    }
  }, [])

  const storeApplicationConfiguration = ({...props}) => {
    console.log('storeApplicationConfiguration', JSON.stringify({...props}));
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
