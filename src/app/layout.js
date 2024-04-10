'use client'

import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter'
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import styled from '@emotion/styled'
import { BloomreachTheme, config } from '../theme/schemes/BloomreachTheme'

// Components
import { Box } from '@mui/material'
import Footer from 'src/components/Footer'
import Header from 'src/components/Header'
import Sidebar from 'src/components/Sidebar'

// Contexts
import { ConfigurationProvider } from 'src/contexts/ConfigurationContext';
import { ErrorProvider } from 'src/contexts/ErrorContext';
import { SidebarProvider } from 'src/contexts/SidebarContext';

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
        </AppRouterCacheProvider>
      </body>
    </html>
  )
}
