'use client'

import React, { useContext, useMemo, useState } from 'react'

// API
import { getV1DeliveryApiSettings } from 'bloomreach-content-management-apis'

// Components
import {
  useTheme,
  Badge,
  Box,
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
  Tabs,
  Tab,
} from '@mui/material';
import { TabPanel } from '@/components';
import { DocumentsTab } from './v1/DocumentsTab'
import { PagesTab } from './v1/PagesTab'

// Contexts
import { ConfigurationContext, ErrorContext, LoadingContext } from '@/contexts'
import axios from 'axios';

const TABS = [
  'Pages API',
  'Documents API',
]

export const DeliverApiSettingsV1 = () => {
  const theme = useTheme()
  // Context
  const { appConfiguration } = useContext(ConfigurationContext)
  const { environment, xAuthToken } = appConfiguration.environments?.source
  const { handleShowSnackbar } = useContext(ErrorContext)
  const { setLoading } = useContext(LoadingContext)

  // State
  const [data, setData] = useState({
    enabled: true,
    skipTranslations: false,
  })
  const [ tab, setTab] = useState(0);

  useMemo(() => {
    if (environment && xAuthToken) {
      getV1DeliveryApiSettings(environment, xAuthToken)
        .then(response => setData(response.data))
        .catch(error => console.error(error))
    }
  }, [environment])

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading({ loading: true, message: 'Updating Delivery API v1 Settings'})

    const xResourceVersion = await getV1DeliveryApiSettings(environment, xAuthToken)
      .then(response => response.headers['x-resource-version'])
      .catch(error => {
        console.error(error)
    })

    if (xResourceVersion) {
      await axios(`/api/delivery-api-settings/v1?environment=${environment}`, {
        method: 'PATCH',
        headers: {
          'x-auth-token': xAuthToken,
          'x-resource-version': xResourceVersion,
        },
        data: data
      })
        .then(response => {
          console.log(response)
          setData(response.data)
          setLoading({ loading: false, message: '' })
          handleShowSnackbar('success', 'Settings updated successfully')
        })
        .catch(error => {
          console.error(error)
          setLoading({ loading: false, message: '' })
          handleShowSnackbar('error', 'Error updating settings')
        })
    }
  }

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <>
      <Box
        component='form'
        noValidate
        autoComplete='off'
        onSubmit={handleSubmit}
        display='flex'
      >
        <Grid
          container
          direction='row'
          justifyContent='flex-start'
          alignItems='stretch'
          spacing={6}
          sx={{ width: '100%', maxWidth: '100%' }}
        >

          {/* Left */}
          <Grid item xs={6}>
            <Stack spacing={3}>
              <FormControl
                fullWidth
                variant='outlined'
              >
                <InputLabel id='v1ApiEnabled'>API Enabled</InputLabel>
                <Select
                  id='v1ApiEnabled'
                  labelId='v1ApiEnabled'
                  label={'API Enabled'}
                  value={data.enabled}
                  onChange={(e) => setData({...data, enabled: e.target.value})}
                >
                  <MenuItem value={true}>
                    <Badge
                      badgeContent=''
                      color={'success'}
                      variant='dot'
                      anchorOrigin={{
                        horizontal: 'left',
                        vertical: 'top'
                      }}
                      sx={{
                        top: '50%',
                        transform: 'translateY(-50%)'
                      }}
                    />
                    <Typography variant='p' component='span' sx={{ pl: 1 }}>Enabled</Typography>
                  </MenuItem>
                  <MenuItem value={false}>
                    <Badge
                      badgeContent=''
                      color={'error'}
                      variant='dot'
                      anchorOrigin={{
                        horizontal: 'left',
                        vertical: 'top'
                      }}
                      sx={{
                        top: '50%',
                        transform: 'translateY(-50%)'
                      }}
                    />
                    <Typography variant='p' component='span' sx={{ pl: 1 }}>Disabled</Typography>
                  </MenuItem>
                </Select>
              </FormControl>

              <FormControl
                fullWidth
                variant='outlined'
              >
                <InputLabel id='v1SkipTranslations'>Skip Translations</InputLabel>
                <Select
                  id='v1SkipTranslations'
                  labelId='v1SkipTranslations'
                  label={'Skip Translations'}
                  value={data.skipTranslations}
                  onChange={(e) => setData({...data, skipTranslations: e.target.value})}
                >
                  <MenuItem value={true}>
                    <Badge
                      badgeContent=''
                      color={'success'}
                      variant='dot'
                      anchorOrigin={{
                        horizontal: 'left',
                        vertical: 'top'
                      }}
                      sx={{
                        top: '50%',
                        transform: 'translateY(-50%)'
                      }}
                    />
                    <Typography variant='p' component='span' sx={{ pl: 1 }}>Enabled</Typography>
                  </MenuItem>
                  <MenuItem value={false}>
                    <Badge
                      badgeContent=''
                      color={'error'}
                      variant='dot'
                      anchorOrigin={{
                        horizontal: 'left',
                        vertical: 'top'
                      }}
                      sx={{
                        top: '50%',
                        transform: 'translateY(-50%)'
                      }}
                    />
                    <Typography variant='p' component='span' sx={{ pl: 1 }}>Disabled</Typography>
                  </MenuItem>
                </Select>
              </FormControl>

              <Grid item xs={6}>
                <Button variant='contained' type='submit'>Save</Button>
              </Grid>
            </Stack>
          </Grid>



          {/* Right */}
          <Grid item xs={6}>
            <Paper square={false} sx={{ padding: 2, border: `1px solid ${theme.palette.primary.light}` }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tab} onChange={handleTabChange}>
                  <Tab label={`${TABS[0]}`} />
                  <Tab label={`${TABS[1]}`} />
                </Tabs>
              </Box>
              <TabPanel value={tab} index={0}>
                <PagesTab />
              </TabPanel>
              <TabPanel value={tab} index={1}>
                <DocumentsTab />
              </TabPanel>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
}
