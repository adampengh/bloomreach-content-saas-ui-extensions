import { useState, createContext } from 'react';

export const ConfigurationContext = createContext({});

export function ConfigurationProvider({ children }) {
  const [appConfiguration, setAppConfiguration] = useState({
    environment: "",
    xAuthToken: "",
    channelId: ""
  });
  const toggleSidebar = () => {
    setSidebarToggle(!sidebarToggle);
  };

  const closeSidebar = () => {
    setSidebarToggle(false);
  };

  return (
    <ConfigurationContext.Provider
      value={{ appConfiguration, setAppConfiguration }}
    >
      {children}
    </ConfigurationContext.Provider>
  );
}
