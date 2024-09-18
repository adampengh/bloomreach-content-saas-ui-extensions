'use client'

import React, { useContext, useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

// APIs
import { getChannel } from 'bloomreach-content-management-apis';

// Components
import { TabPanel } from 'src/components';
import {
  ChannelTab,
  ComponentsTab,
  LayoutsTab,
  RoutesTab,
  MenusTab,
} from './tabs'
import {
  Alert,
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Tabs,
  Tab,
} from '@mui/material';

// Contexts
import { ConfigurationContext, LoadingContext } from 'src/contexts';
import { NewTab } from './tabs/NewTab.js';

const TABS = [
  'channels',
  'components',
  'layouts',
  'routes',
  'menus',
  'TEMPLATE',
]

export const ChannelDetailsModule = ({ channelId }) => {
  console.log('ChannelDetailsModule channelId', channelId)
  const router = useRouter();
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { tab } = searchParams;

  // State
  const [value, setValue] = useState(0);
  const [error, setError] = useState(null)
  const [channel, setChannel] = useState(null)

  // Context
  const { appConfiguration } = useContext(ConfigurationContext)
  const { environment, xAuthToken } = appConfiguration.environments?.source
  const { setLoading } = useContext(LoadingContext)

  useEffect(() => {
    if (tab) setValue(TABS.indexOf(tab));

    if (environment && xAuthToken && channelId) {
      setLoading({ loading: true, message: 'Loading Channel'})
      getChannel(environment, xAuthToken, channelId)
        .then(response => {
          console.log(response)
          setChannel(response.data)
          setLoading({ loading: false, message: '' })
          setError(null)
        })
        .catch(error => {
          console.error(error)
          if (error.response) {
            console.error('error.response.data', error.response.data)
            setError(error.response.data)
            console.error('error.response.status', error.response.status)
          } else if (error.request) {
            console.error(error.request)
          } else {
            console.error('Error', error.message)
          }
          setLoading({ loading: false, message: '' })
        })
    }
  }, [environment, xAuthToken, channelId])

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
    router.push(`${pathname}?tab=${TABS[newValue]}`);
  };

  if (error) {
    return (
      <Container maxWidth={false}>
        <Grid
          container
          direction='row'
          justifyContent='center'
          alignItems='stretch'
          alignContent='stretch'
          sx={{
            '& .MuiCircularProgress-root': {
              margin: '24px'
            }
          }}
        >
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{
                  fontWeight: 'bold',
                  p: 2,
                  '&:last-child': { paddingBottom: 2 }
                }}>
                <Alert severity='error'>{error}</Alert>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    )
  }


  return (
    <Container maxWidth={false}>
      <Grid
        container
        direction='row'
        justifyContent='center'
        alignItems='stretch'
        alignContent='stretch'
        sx={{
          '& .MuiCircularProgress-root': {
            margin: '24px'
          }
        }}
      >
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ fontWeight: 'bold' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleTabChange}>
                  <Tab label='Channel' />
                  <Tab label='Components' />
                  <Tab label='Layouts' />
                  <Tab label='Routes' />
                  <Tab label='Menus' />
                  {process.env.NODE_ENV === 'development' && <Tab label='TEMPLATE' /> }
                </Tabs>
              </Box>
              <TabPanel value={value} index={0}>
                {channel &&
                  <ChannelTab
                    channel={channel}
                    environment={environment}
                    xAuthToken={xAuthToken}
                  />
                }
              </TabPanel>
              <TabPanel value={value} index={1}>
                {channel && <ComponentsTab channel={channel} />}
              </TabPanel>
              <TabPanel value={value} index={2}>
                {channel && <LayoutsTab channel={channel} />}
              </TabPanel>
              <TabPanel value={value} index={3}>
                {channel && <RoutesTab channel={channel} />}
              </TabPanel>
              <TabPanel value={value} index={4}>
                {channel && <MenusTab channel={channel} />}
              </TabPanel>

              {process.env.NODE_ENV === 'development' &&
                <TabPanel value={value} index={5}>
                  {channel && <NewTab channel={channel} />}
                </TabPanel>
              }
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}
