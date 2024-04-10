'use client'

import React, { useContext, useEffect, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'

// APIs
import { getChannel } from 'bloomreach-content-management-apis';

// Components
import TabPanel from 'components/TabPanel';
import {
  ChannelTab,
  ComponentsTab,
  LayoutsTab,
  RoutesTab,
  MenusTab,
} from '/modules/channels'
import {
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Tabs,
  Tab,
} from '@mui/material';

// Contexts
import { ConfigurationContext } from 'src/contexts/ConfigurationContext';

const TABS = [
  'channels',
  'components',
  'layouts',
  'routes',
  'menus',
]

const ChannelDetails = ({ channelId }) => {
  const router = useRouter();
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { tab } = searchParams;

  const [value, setValue] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false)
  const [channel, setChannel] = useState(null)
  const { appConfiguration } = useContext(ConfigurationContext)
  const {
    environment,
    xAuthToken,
  } = appConfiguration.environments?.source

  useEffect(() => {
    tab ? setValue(TABS.indexOf(tab)) : 0;

    if (environment && xAuthToken && channelId) {
      getChannel(environment, xAuthToken, channelId)
        .then(response => {
          console.log(response)
          setChannel(response.data)
          setIsLoaded(true)
        })
        .catch(error => console.error(error))
    }
  }, [environment, xAuthToken, channelId])

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
    router.push(`${pathname}?tab=${TABS[newValue]}`, undefined, { shallow: true });
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <Container maxWidth="xl">
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        alignContent="stretch"
        sx={{
          '& .MuiCircularProgress-root': {
            margin: '24px'
          }
        }}
      >
      { !isLoaded
        ?
          <Grid
            item
            xs={12}
            justifyContent="center"
            alignItems="stretch"
            alignContent="stretch"
          >
            <Card>
              <CircularProgress />
            </Card>
          </Grid>
        :
          <Grid item xs={12}>
            <Card>
              <CardContent sx={{ fontWeight: 'bold' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                  <Tabs value={value} onChange={handleTabChange}>
                    <Tab label="Channel" />
                    <Tab label="Components" />
                    <Tab label="Layouts" />
                    <Tab label="Routes" />
                    <Tab label="Menus" />
                  </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                  <ChannelTab
                    channel={channel}
                    environment={environment}
                    xAuthToken={xAuthToken}
                  />
                </TabPanel>
                <TabPanel value={value} index={1}>
                  <ComponentsTab channel={channel} />
                </TabPanel>
                <TabPanel value={value} index={2}>
                  <LayoutsTab channel={channel} />
                </TabPanel>
                <TabPanel value={value} index={3}>
                  <RoutesTab channel={channel} />
                </TabPanel>
                <TabPanel value={value} index={4}>
                  <MenusTab channel={channel} />
                </TabPanel>
              </CardContent>
            </Card>
          </Grid>
        }
      </Grid>
    </Container>
  )
}

export default ChannelDetails;
