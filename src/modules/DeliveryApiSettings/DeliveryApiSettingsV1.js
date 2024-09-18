'use client'

import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { CopyBlock } from 'react-code-blocks'
import bloomreachTheme from 'src/theme/code-block/bloomreachTheme'

// API
import { getV1DeliveryApiSettings } from 'bloomreach-content-management-apis'

// Components
import {
  useTheme,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

// Contexts
import { ConfigurationContext } from '@/contexts'

import { mockDeliveryV1Page } from '@/modules/DeliveryApiSettings/mock-data/v1/page'
import { mockDeliveryV1Document } from '@/modules/DeliveryApiSettings/mock-data/v1/document'
import { set } from 'nprogress'
import { updateV1DeliveryApiSettings } from 'bloomreach-content-management-apis'

export const DeliverApiSettingsV1 = () => {
  const theme = useTheme()
  // Context
  const { appConfiguration } = useContext(ConfigurationContext)
  const { environment, xAuthToken } = appConfiguration.environments?.source

  // State
  const [data, setData] = useState({
    enabled: true,
    skipTranslations: false,
  })
  const [ channels, setChannels ] = useState([])
  const [ selectedChannel, setSelectedChannel ] = useState(null)

  const [ documentPath, setDocumentPath ] = useState(null)
  const [ document, setDocument ] = useState(null)

  useEffect(() => {
    if (environment && xAuthToken) {
      getV1DeliveryApiSettings(environment, xAuthToken)
        .then(response => setData(response.data))
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

  const handleDocumentTest = () => {
    axios.get(`https://${environment}.bloomreach.io/delivery/site/v1/channels/${selectedChannel}/documents/${documentPath}`)
      .then(response => setDocument(response.data))
      .catch(error => console.error(error))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    console.log('data', data)

    const xResourceVersion = await getV1DeliveryApiSettings(environment, xAuthToken)
      .then(response => response.headers['x-resource-version'])
      .catch(error => console.error(error))

    await updateV1DeliveryApiSettings(environment, xAuthToken, xResourceVersion, data)
      .then(response => {
        console.log(response)
        setData(response.data)
      })
      .catch(error => console.error(error))
  }

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
              <Stack spacing={3} display={'block'}>
                <FormControl fullWidth variant='outlined'>
                  <InputLabel id='enabled'>Channel</InputLabel>
                  <Select
                    id='channel'
                    labelId='channel'
                    label={'Channel'}
                    value={selectedChannel || channels?.[0]?.name}
                    onChange={(e) => setSelectedChannel(e.target.value)}
                  >
                    {channels?.map((channel, index) => {
                      console.log('channel', channel)
                      return (
                        <MenuItem key={index} value={channel.name}>
                          {channel.name}
                        </MenuItem>
                      )
                    })}
                  </Select>
                </FormControl>

                <TextField
                  id='relativepath'
                  name='relativepath'
                  label='Document Relative Path'
                  value={documentPath || ''}
                  fullWidth
                  onChange={(e) => setDocumentPath(e.target.value)}
                  placeholder='/banners/banner-1'
                />

                <Button
                  variant='contained'
                  color='primary'
                  onClick={handleDocumentTest}
                  fullWidth={false}
                >Test</Button>

                <Box sx={{ maxWidth: '40vw', width: '100%' }}>
                  {document &&
                    <CopyBlock
                      text={JSON.stringify(document, null, 4)}
                      language='json'
                      wrapLines={true}
                      showLineNumbers={true}
                      codeBlock
                      theme={bloomreachTheme}
                    />
                  }
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>


  );
}
