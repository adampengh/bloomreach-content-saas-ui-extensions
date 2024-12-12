'use client'

import React, { useContext, useMemo, useState } from 'react'
import axios from 'axios'
import { CopyBlock } from 'react-code-blocks'
import bloomreachTheme from 'src/theme/code-block/bloomreachTheme'

// API
import { getV2DeliveryApiSettings, updateV2DeliveryApiSettings } from 'bloomreach-content-management-apis'

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
  TextField,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormLabel,
  Divider,
  OutlinedInput,
  Tabs,
  Tab,
} from '@mui/material';
import { TabPanel } from '@/components';
import { DocumentsTab } from './v2/DocumentsTab'
import { FoldersTab } from './v2/FoldersTab'

// Contexts
import { ConfigurationContext, ErrorContext, LoadingContext } from '@/contexts'

// Constants
import { SECURED_APIS } from 'src/lib/constants';

const TABS = [
  'Documents API',
  'Folders API',
  'Images API',
  'Assets API',
]

export const DeliverApiSettingsV2 = () => {
  const theme = useTheme()

  // Context
  const { appConfiguration } = useContext(ConfigurationContext)
  const { environment, xAuthToken } = appConfiguration.environments?.source
  const { handleShowSnackbar } = useContext(ErrorContext)
  const { setLoading } = useContext(LoadingContext)

  // State
  const [ tab, setTab] = useState(0);
  const [data, setData] = useState({
    enabled: true,
    format: 'flattened',
    secret: null,
    securedApis: [SECURED_APIS],
    skipTranslations: false,
  })
  const [ channels, setChannels ] = useState([])
  const [ selectedChannel, setSelectedChannel ] = useState(null)

  const [ documentPath, setDocumentPath ] = useState(null)
  const [ document, setDocument ] = useState(null)

  useMemo(() => {
    if (environment && xAuthToken) {
      getV2DeliveryApiSettings(environment, xAuthToken)
        .then(response => {
          console.log('response', response.data)
          setData(response.data)
        })
        .catch(error => console.error(error))
    }

    if (environment) {
      axios.get(`https://${environment}.bloomreach.io/delivery/site/v1/channels`)
        .then(response => {
          setChannels(response.data)
          setSelectedChannel(response.data?.[0]?.name)
        })
        .catch(error => console.error(error))
    }
  }, [environment])

  const handleSecuredApisChange = (event) => {
    const name = event.target.name
    const checked = event.target.checked

    if (checked) {
      setData(prevState => ({
        ...prevState,
        securedApis: [...prevState.securedApis, name]
      }))
    } else {
      setData(prevState => ({
        ...prevState,
        securedApis: prevState.securedApis.filter(securedApi => securedApi !== name)
      }))
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault()
    setLoading({ loading: true, message: 'Updating Delivery API v1 Settings'})

    if (!data?.secret) {
      setData(prevState => ({
        ...prevState,
        securedApis: []
      }))
    }
    console.log('data', data)

    const xResourceVersion = await getV2DeliveryApiSettings(environment, xAuthToken)
      .then(response => response.headers['x-resource-version'])
      .catch(error => console.error(error))
    console.log('xResourceVersion', xResourceVersion)

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
                  id='v2ApiEnabled'
                  labelId='v2ApiEnabled'
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
                <InputLabel id='v2SkipTranslations'>Skip Translations</InputLabel>
                <Select
                  id='v2SkipTranslations'
                  labelId='v2SkipTranslations'
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

              <FormControl
                fullWidth
                variant='outlined'
              >
                <InputLabel id='v2SkipTranslations'>Format</InputLabel>
                <Select
                  id='v2SkipTranslations'
                  labelId='v2SkipTranslations'
                  label={'Format'}
                  value={data.format}
                  onChange={(e) => setData({...data, format: e.target.value})}
                >
                  <MenuItem value={'flattened'}>Flattened</MenuItem>
                  <MenuItem value={'inline'}>Inline</MenuItem>
                </Select>
              </FormControl>

              <Divider />

              <Typography variant='h4'>Authorization</Typography>
              <TextField
                id='v2ApiSecret'
                name='v2ApiSecret'
                label='Secret'
                value={data.secret || ''}
                fullWidth
                onChange={(e) => setData({...data, secret: e.target.value})}
              />

              <Paper square={false} sx={{ padding: 2, border: `1px solid ${theme.palette.primary.light}` }}>
                <FormControl sx={{ width: '100%' }}>
                  <FormLabel component='legend'>
                    <strong>Secured APIs</strong>
                  </FormLabel>
                  <FormGroup sx={{ padding: 1, display: 'flex', flexDirection: 'row' }}>
                    {SECURED_APIS.map((securedApi) => (
                      <FormControlLabel
                        key={securedApi}
                        control={
                          <Checkbox
                            name={securedApi}
                            checked={data?.securedApis?.indexOf(securedApi) > -1}
                            onChange={handleSecuredApisChange}
                          />
                        }
                        label={securedApi}
                      />
                    ))}
                  </FormGroup>
                </FormControl>
              </Paper>

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
                <DocumentsTab />
              </TabPanel>
              <TabPanel value={tab} index={1}>
                <FoldersTab />
              </TabPanel>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  )
}
