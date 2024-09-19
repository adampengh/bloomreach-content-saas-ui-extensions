'use client'

import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { CopyBlock } from 'react-code-blocks'
import bloomreachTheme from 'src/theme/code-block/bloomreachTheme'

// APIs
import {
  getWebhookConfiguration,
  updateWebhookConfiguration,
} from 'bloomreach-content-management-apis';

// Web Socket
import { socket } from '@/socket'

// Components
import {
  Box,
  Badge,
  Button,
  Container,
  Card,
  CardHeader,
  CardContent,
  Checkbox,
  Divider,
  FormControl,
  FormLabel,
  FormGroup,
  FormControlLabel,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  MenuItem,
  Select,
  Stack,
  Typography,
  TextField,
  Paper,
  useTheme,
} from '@mui/material'

// Contexts
import { ConfigurationContext, ErrorContext, LoadingContext } from '@/contexts'

// Icons
import {
  AddIcon,
  DeleteIcon,
  WebhookIcon,
} from 'src/icons'
import { WEBHOOK_TRIGGERS } from '@/lib/constants';

const SAMPLE_WEBHOOK_OPERATION = {
  'operationId': '28ebb3a3-7c2b-43b3-97ca-1d1e8d25a6a6',
  'time': '2024-09-11T13:12:01.461+02:00',
  'trigger': 'page:publish',
  'entity': {
    'identifier': 'd1e894c7-5593-48f9-954c-5e5c3933e078',
    'path': '/content/documents/bloomreach-nucleus/test'
  }
}

export const WebhooksDetailsModule = ({ webhookId }) => {
  return (
    <Container maxWidth={false}>
      <Grid
        container
        direction='row'
        justifyContent='center'
        alignItems='stretch'
        alignContent='stretch'
        spacing={3}
      >
        <Grid item xs={6}>
          <WebhookDetails webhookId={webhookId} />
        </Grid>

        <Grid item xs={6}>
          <WebhookRequests />
        </Grid>
      </Grid>
    </Container>
  )
}

const WebhookDetails = ({ webhookId }) => {
  const theme = useTheme()

  // Context
  const { appConfiguration } = useContext(ConfigurationContext)
  const { environment, xAuthToken } = appConfiguration.environments?.source
  const { handleShowSnackbar } = useContext(ErrorContext)
  const { setLoading } = useContext(LoadingContext)

  // State
  const [ triggers, setTriggers ] = useState(WEBHOOK_TRIGGERS)
  const [ webhookDetails, setWebhookDetails ] = useState([])
  const [ headers, setHeaders ] = useState([])

  useEffect(() => {
    if (environment && xAuthToken && webhookId) {
      setLoading({ loading: true, message: 'Loading Webhook Configurations'})
      // Get source projects
      getWebhookConfiguration(environment, xAuthToken, webhookId)
        .then((response) => {
          let details = response.data
          console.log('details', details)
          setWebhookDetails(details)
          setHeaders(details.headers)
          setTriggers(details.triggers)
          setLoading({ loading: false, message: '' })
        })
        .catch(() => {
          setLoading({ loading: false, message: '' })
        })
    }
  }, [appConfiguration, webhookId])


  const handleTriggersChange = (event) => {
    const name = event.target.name
    const checked = event.target.checked
    if (checked) {
      setTriggers([...triggers, name])
    } else {
      setTriggers(triggers.filter(trigger => trigger !== name))
    }
  };


  const handleUpdateWebhookConfiguration = async () => {
    setLoading({ loading: true, message: 'Updating Webhook Configurations'})

    // Get existing configuration and X-Resource-Version header
    const xResourceVersion = await getWebhookConfiguration(environment, xAuthToken, webhookId)
      .then((response) => response.headers['x-resource-version'])
      .catch((error) => console.error('error', error))

    // Update configuration
    await updateWebhookConfiguration(environment, xAuthToken, webhookId, {
      ...webhookDetails,
      triggers,
      headers
    }, xResourceVersion)
      .then((response) => {
        console.log('response', response)
        handleShowSnackbar('success', 'Webhook configuration updated successfully')
      })
      .catch((error) => {
        console.error('error', error)
        handleShowSnackbar('error', 'Error updating webhook configuration')
      })

    setLoading({ loading: false, message: ''})
  }

  return (
    <Card>
      <CardHeader
        title={
          <Grid
            container
            direction='row'
            justifyContent='space-between'
            alignItems='center'
            alignContent='center'>
              <Grid item xs={6} display='flex' alignContent='center' alignItems='center'>
                <Typography variant='h4' component='span'>Configuration Details</Typography>
              </Grid>
          </Grid>
        }
      />
      <Divider />
      <CardContent>
        <Grid
          container
          direction='row'
          justifyContent='flex-start'
          alignItems='stretch'
          rowSpacing={3}
          columnSpacing={3}
          sx={{ width: '100%' }}
        >
          <Grid item xs={12}>
            <Stack
              sx={{ width: '100%' }}
              spacing={3}
            >
              {/* Enabled */}
              <FormControl fullWidth variant='outlined'>
                <InputLabel id='enabled'>Enabled</InputLabel>
                <Select
                  id='enabled'
                  labelId='enabled'
                  label={'Enabled'}
                  value={webhookDetails.enabled || true}
                >
                  <MenuItem value={true}>
                    <Badge
                      badgeContent=''
                      color={'success'}
                      variant='dot'
                      anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                      sx={{ top: '50%', transform: 'translateY(-50%)' }}
                    />
                    <Typography variant='p' component='span' sx={{ pl: 1 }}>Enabled</Typography>
                  </MenuItem>
                  <MenuItem value={false}>
                    <Badge
                      badgeContent=''
                      color={'error'}
                      variant='dot'
                      anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
                      sx={{
                        top: '50%',
                        transform: 'translateY(-50%)'
                      }}
                    />
                    <Typography variant='p' component='span' sx={{ pl: 1 }}>Disabled</Typography>
                  </MenuItem>
                </Select>
              </FormControl>

              {/* Webhook ID */}
              <TextField
                disabled
                id='id'
                name='id'
                label='Webhook ID'
                value={webhookDetails.id || ''}
                fullWidth
              />

              {/* Webhook Name */}
              <TextField
                id='name'
                name='name'
                label='Webhook Name'
                value={webhookDetails.name || ''}
                fullWidth
                onChange={(e) => {
                  console.log('name', e.target.value)
                  setWebhookDetails(prevState => ({
                    ...prevState,
                    name: e.target.value
                  }))
                }}
              />

              {/* Webhook URL */}
              <TextField
                id='url'
                name='url'
                label='URL'
                value={webhookDetails.url || ''}
                fullWidth
                onChange={(e) => {
                  console.log('url', e.target.value)
                  setWebhookDetails(prevState => ({
                    ...prevState,
                    url: e.target.value
                  }))
                }}
              />

              {/* Method */}
              <TextField
                disabled
                id='method'
                name='method'
                label='Method'
                value={webhookDetails.method || 'POST'}
                fullWidth
              />

              {/* Triggers */}
              <Paper square={false} sx={{ padding: 2, border: `1px solid ${theme.palette.primary.light}` }}>
                <FormControl required sx={{ width: '100%' }}>
                  <FormLabel component='legend'>
                    <strong>Triggers</strong>
                  </FormLabel>
                  <FormGroup sx={{ padding: 1, display: 'flex', flexDirection: 'row' }}>
                    {WEBHOOK_TRIGGERS.map((trigger) => (
                      <FormControlLabel
                        key={trigger}
                        control={
                          <Checkbox
                            name={trigger}
                            checked={triggers.indexOf(trigger) > -1}
                            onChange={handleTriggersChange}
                          />
                        }
                        label={trigger}
                      />
                    ))}
                  </FormGroup>
                </FormControl>
              </Paper>

              {/* Headers */}
              <HeadersField
                headers={headers}
                setHeaders={setHeaders}
              />
            </Stack>
          </Grid>

          <Grid item xs={12}>
            <Button
              variant='contained'
              type='submit'
              onClick={handleUpdateWebhookConfiguration}
            >Save</Button>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}

const WebhookRequests = () => {
  const theme = useTheme()

  const [webhookExecutions, setWebhookExecutions] = useState([])
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (socket.connected) {
      onConnect();
    }

    function onConnect() {
      console.log('onConnect', socket.id);
      setIsConnected(true);

      socket.io.engine.on('upgrade', (transport) => {
        console.log('upgrade', transport);
      });

      socket.on('webhookExecution', (data) => {
        console.log('data', data);
        setWebhookExecutions(prevState => {
          console.log('prevState', prevState);
          return [data, ...prevState]
        })
      });
    }

    function onDisconnect() {
      console.log('onDisconnect');
      setIsConnected(false);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, [socket]);

  const handleSendSocketEmitMessage = async () => {
    await axios.post(`/api/webhooks`, SAMPLE_WEBHOOK_OPERATION)

    // socket.emit('webhookApiRouteHandler', SAMPLE_WEBHOOK_OPERATION, (response) => {
    //   console.log('response', response)
    // })
  }

  return (
    <Card>
      <CardHeader
        title={
          <Grid
            container
            direction='row'
            justifyContent='space-between'
            alignItems='center'
            alignContent='center'
          >
            <Typography variant='h4' component='span'>Webhook Requests</Typography>
            <Box>
              <Typography variant='p' component='span' align='right' sx={{ pr: 2 }}>Websocket Connected</Typography>
              <Badge
                badgeContent=''
                color={isConnected ? 'success' : 'error'}
                variant='dot'
                anchorOrigin={{
                  horizontal: 'right',
                  vertical: 'top'
                }}
                sx={{
                  top: '50%',
                  transform: 'translateY(-50%)',
                  '& .MuiBadge-badge': {
                    animation: isConnected ? 'pulseSuccess 2s infinite' : 'pulseError 2s infinite',
                  },
                  '@keyframes pulseSuccess': {
                    '0%': {
                      transform: 'translateY(-50%) scale(0.95)',
                      boxShadow: `0 0 0 0 ${theme.palette.success.main}`,
                      borderRadius: '100px'
                    },
                    '70%': {
                      transform: 'translateY(-50%) scale(1)',
                      boxShadow: `0 0 0 8px rgba(255, 255, 255, 0)`,
                      borderRadius: '100px'
                    },
                    '100%': {
                      transform: 'translateY(-50%) scale(0.95)',
                      boxShadow: `0 0 0 0 rgba(255, 255, 255, 0)`,
                      borderRadius: '100px'
                    }
                  },
                  '@keyframes pulseError': {
                    '0%': {
                      transform: 'translateY(-50%) scale(0.95)',
                      boxShadow: `0 0 0 0 ${theme.palette.error.main}`,
                      borderRadius: '100px'
                    },
                    '70%': {
                      transform: 'translateY(-50%) scale(1)',
                      boxShadow: `0 0 0 8px rgba(255, 255, 255, 0)`,
                      borderRadius: '100px'
                    },
                    '100%': {
                      transform: 'translateY(-50%) scale(0.95)',
                      boxShadow: `0 0 0 0 rgba(255, 255, 255, 0)`,
                      borderRadius: '100px'
                    }
                  }
                }}
              />
            </Box>
          </Grid>
        }
      />
      <Divider />
      <CardContent>
        {webhookExecutions.length === 0 && (
          <Button
            color='primary'
            disabled={!isConnected}
            onClick={handleSendSocketEmitMessage}
            startIcon={<WebhookIcon />}
            variant='contained'
          >
            <Typography variant='button' component='span'>Send Test Webhook Request</Typography>
          </Button>
        )}
        {/* <p><strong>Status:</strong> { isConnected ? 'connected' : 'disconnected' }</p> */}
        <List disablePadding>
          {webhookExecutions.length === 0 ? (
            <ListItem disableGutters disablePadding sx={{ mt: 3 }}>
              <Box sx={{ maxWidth: '100%', width: '100%' }}>
                <Typography variant='h5' component='p'>Sample Webhook Execution Output:</Typography>
                <CopyBlock
                  text={JSON.stringify(SAMPLE_WEBHOOK_OPERATION, null, 4)}
                  language='json'
                  wrapLines={true}
                  showLineNumbers={true}
                  codeBlock
                />
                </Box>
            </ListItem>
          ) : (
            <>
              {webhookExecutions.map((execution, index) => (
                <ListItem key={index} disableGutters disablePadding sx={{ mt: 3 }}>
                  <Box sx={{ maxWidth: '100%', width: '100%' }}>
                    <CopyBlock
                      text={JSON.stringify(execution, null, 4)}
                      language='json'
                      wrapLines={true}
                      theme={bloomreachTheme}
                      showLineNumbers={true}
                      codeBlock
                    />
                    </Box>
                </ListItem>
              ))}
            </>
          )}
        </List>
      </CardContent>
    </Card>
  );
}

const HeadersField = ({ headers, setHeaders }) => {
  const theme = useTheme()

  const handleHeaderDelete = (index) => {
    setHeaders(headers?.filter((_, i) => i !== index))
  }

  const handleHeaderAdd = () => {
    if (!headers) {
      setHeaders([{ name: '', value: '', secret: false }])
      return
    }
    setHeaders([...headers, { name: '', value: '', secret: false }])
  }

  return (
    <Paper square={false} sx={{ padding: 2, border: `1px solid ${theme.palette.primary.light}` }}>
      <FormLabel component='legend' sx={{ mb: 2 }}>
        <strong>Headers</strong>
      </FormLabel>

      {headers?.map((header, index) => {
        console.log('header', header)
        return (
        <Grid key={index} container spacing={1} alignItems={'center'} sx={{ mb: 2 }}>
          <Grid item xs>
            <TextField
              id={`name-${index}`}
              name={`name-${index}`}
              label='Name'
              fullWidth
              value={header.name}
            />
          </Grid>
          <Grid item xs>
            <TextField
              id={`value-${index}`}
              name={`value-${index}`}
              label='Value'
              value={header.value}
              fullWidth
            />
          </Grid>
          <Grid item xs={2}>
            <FormControl fullWidth variant='outlined'>
              <InputLabel id={`secret-${index}`}>Secret</InputLabel>
              <Select id={`secret-${index}`} value={header.secret} label='Secret'>
                <MenuItem value={true}>True</MenuItem>
                <MenuItem value={false}>False</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item>
            <IconButton onClick={() => handleHeaderDelete(index)}>
              <DeleteIcon />
            </IconButton>
          </Grid>
        </Grid>
        )}
      )}

        <Grid container spacing={1} alignItems={'center'}>
          <Grid item>
            <Button color='primary' variant='outlined' onClick={handleHeaderAdd}>
              <AddIcon />
            </Button>
          </Grid>
        </Grid>
    </Paper>
  )
}
