'use client'
import { BloomreachTheme, config } from 'src/theme/schemes/BloomreachTheme'

// Components
import { Box } from '@mui/material'
import styled from '@emotion/styled'
import Footer from 'src/modules/Footer'

// Contexts
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Provider } from 'react-redux';
import store from 'src/redux/store'
import { ConfigurationProvider } from 'src/contexts/ConfigurationContext';
import { ErrorProvider } from 'src/contexts/ErrorContext';
import { SidebarProvider } from 'src/contexts/SidebarContext';

// Modules
import Header from 'src/modules/Header'
import Sidebar from 'src/modules/Sidebar'

import '../global.css'

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}) {
  const AppWrapper = styled(Box)(`
    display: flex;
    flex: 1;
    height: 100%;
  `);

  const PageWrapper = styled(Box)(`
    display: 'block';
    flex: 1;
    padding-top: ${config.header.height};
    position: 'relative';
    z-index: 5;
  `);

  return (
    <html lang="en">
      <body>
        <AppRouterCacheProvider>
          <Provider store={store}>
            <ErrorProvider>
              <ConfigurationProvider>
                <SidebarProvider>
                  <ThemeProvider theme={BloomreachTheme}>
                  <CssBaseline />
                    <AppWrapper>
                      <Header />
                      <Sidebar />
                      <PageWrapper sx={{
                        ml: {
                          xs: 0,
                          lg: config.sidebar.width
                        }
                      }}>
                        {children}
                      </PageWrapper>
                      <Footer />
                    </AppWrapper>
                  </ThemeProvider>
                </SidebarProvider>
              </ConfigurationProvider>
            </ErrorProvider>
          </Provider>
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
