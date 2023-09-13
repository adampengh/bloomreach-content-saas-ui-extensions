import Head from 'next/head';
import Router from 'next/router';
import nProgress from 'nprogress';
import 'nprogress/nprogress.css';
import ThemeProvider from 'src/theme/ThemeProvider';
import CssBaseline from '@mui/material/CssBaseline';

import store from 'redux/store'

// Providers
import { Provider } from 'react-redux';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { ConfigurationProvider } from 'src/contexts/ConfigurationContext';
import { ErrorProvider } from 'src/contexts/ErrorContext';
import { SidebarProvider } from 'src/contexts/SidebarContext';

import './global.css'

function App(props) {
  const { Component, pageProps } = props;
  const getLayout = Component.getLayout ?? ((page) => page);

  Router.events.on('routeChangeStart', nProgress.start);
  Router.events.on('routeChangeError', nProgress.done);
  Router.events.on('routeChangeComplete', nProgress.done);

  return (
    <>
      <Head>
        <title>Bloomreach SaaS UI Extension</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, shrink-to-fit=no"
        />
      </Head>
      <Provider store={store}>
        <ErrorProvider>
          <ConfigurationProvider>
            <SidebarProvider>
              <ThemeProvider>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <CssBaseline />
                  {getLayout(<Component {...pageProps} />)}
                </LocalizationProvider>
              </ThemeProvider>
            </SidebarProvider>
          </ConfigurationProvider>
        </ErrorProvider>
      </Provider>
    </>
  );
}

export default App;
