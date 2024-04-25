'use client'
import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'

// API
import {
  getChannelGroups,
  getTranslations,
  getTranslationOperationStatus,
} from 'bloomreach-content-management-apis'

// Components
import { ChannelsHierarchicalList } from './ChannelsHierarchicalList'
import {
  useTheme,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'

// Contexts
import { ConfigurationContext, ErrorContext, LoadingContext } from 'src/contexts'

// Icons
import AddLinkIcon from '@mui/icons-material/AddLink'
import LinkOffIcon from '@mui/icons-material/LinkOff'


export const TranslationsModule = () => {
  const theme = useTheme();

  // Context
  const { handleShowSnackbar } = useContext(ErrorContext)
  const { appConfiguration } = useContext(ConfigurationContext)
  const { environment, xAuthToken } = appConfiguration.environments?.source
  const { setLoading } = useContext(LoadingContext)

  // State
  const [channelGroups, setChannelGroups] = useState([])
  const [selectedChannelGroup, setSelectedChannelGroup] = useState(null)
  const [channels, setChannels] = useState([])
  const [selectedPath, setSelectedPath] = useState(null)
  const [translations, setTranslations] = useState(null)
  const [translationOperationId, setTranslationOperationId] = useState(null)

  // Target
  const [selectedTargetPath, setSelectedTargetPath] = useState(null)

  useEffect(() => {
    console.log('TranslationsModule useEffect')
    if (environment && xAuthToken) {
      setLoading({ loading: true, message: 'Loading Channel Groups' })

      getChannelGroups(environment, xAuthToken)
        .then(response => {
          console.log('getAllChannelGroups', response.data)
          setChannelGroups(response.data)
          setLoading({ loading: false, message: ''})
        })
        .catch(error => console.error(error));
    }
  }, [environment, xAuthToken])

  useEffect(() => {
    if (environment && xAuthToken && selectedPath) {
      const formattedPath = selectedPath.replace(/^\/+/g, '') // Remove leading slashes
      getTranslations(environment, xAuthToken, formattedPath, false, 'all')
        .then(response => {
          console.log('useEffect() getTranslation()', response.data)
          setTranslations(response.data)
        })
        .catch(error => console.error(error));
    }
  }, [selectedPath])


  const linkTranslation = async (source, target) => {
    console.log('linkTranslation')
    console.log('source', source)
    console.log('target', target)
    setLoading({ loading: true, message: 'Linking Translation' })

    await axios.post(`/api/content/translations/link`, {
      environment: environment,
      source: source,
      target: target
    }, {
      headers: {
        'x-auth-token': xAuthToken
      }
    })
      .then(response => {
        console.log(response.data)
        setTranslationOperationId(response.data.operationId)
      })
      .catch(error => {
        console.error('linkTranslation()', error)
        handleShowSnackbar('error', error.message)
      })

    const linkTranslationCheckInterval = setInterval(async function () {
      console.log('linkTranslationCheckInterval', translationOperationId)
      if (!translationOperationId) {
        clearInterval(linkTranslationCheckInterval)
      } else {
        await getTranslationOperationStatus(environment, xAuthToken, translationOperationId)
        .then(response => {
          console.log('linkTranslation() getTranslationOperationStatus()', response.data)
          if (response.data.status !== 'STARTING' || response.data.status !== 'STARTED') {
            clearInterval(linkTranslationCheckInterval)
          }
        })
        .catch(error => {
          console.error('getTranslationOperationStatus() error', error)
          handleShowSnackbar('error', error.message)
          clearInterval(linkTranslationCheckInterval)
        })
      }
    }, 1000)

    const formattedPath = source.replace(/^\/+/g, '') // Remove leading slashes
    await getTranslations(environment, xAuthToken, formattedPath, false, 'all')
      .then(response => {
        console.log('linkTranslation() getTranslations()', response.data)
        setTranslations(response.data)
        setTranslationOperationId(null)
        handleShowSnackbar('success', `Document ${target} linked`)
      })
      .catch(error => console.error(error));

    await setLoading({ loading: false, message: '' })
  }


  const unlinkTranslation = async (source) => {
    console.log('unlinkTranslation')
    console.log('source', source)
    setLoading({ loading: true, message: 'Unlinking Translation' })

    await axios.post(`/api/content/translations/unlink`, {
      environment: environment,
      source: source
    }, {
      headers: {
        'x-auth-token': xAuthToken
      }
    })
      .then(response => {
        console.log(response.data)
        setTranslationOperationId(response.data.operationId)
      })
      .catch(error => {
        console.error('unlinkTranslation()', error)
        handleShowSnackbar('error', error.message)
      })

    const unlinkTranslationCheckInterval = setInterval(async function () {
      console.log('linkTranslationCheckInterval', translationOperationId)
      if (!translationOperationId) {
        clearInterval(unlinkTranslationCheckInterval)
      } else {
        await getTranslationOperationStatus(environment, xAuthToken, translationOperationId)
          .then(response => {
            console.log('unlinkTranslation() getTranslationOperationStatus()', response.data)
            if (response.data.status !== 'STARTING' || response.data.status !== 'STARTED') {
              clearInterval(unlinkTranslationCheckInterval)
            }
          })
          .catch(error => {
            console.error('getTranslationOperationStatus() error', error)
            handleShowSnackbar('error', error.message)
            clearInterval(unlinkTranslationCheckInterval)
          })
      }
    }, 1000)

    const formattedPath = selectedPath.replace(/^\/+/g, '') // Remove leading slashes
    await getTranslations(environment, xAuthToken, formattedPath, false, 'all')
      .then(response => {
        console.log('unlinkTranslation() getTranslations()', response.data)
        setTranslations(response.data)
        setTranslationOperationId(null)
        handleShowSnackbar('success', `Document ${source} unlinked`)
      })
      .catch(error => console.error(error));

    await setLoading({ loading: false, message: '' })
  }

  const handleChannelGroupChange = (event) => {
    console.log('handleChannelGroupChange', event.target.value.channels)
    const channelGroupChannels = event.target.value.channels
    console.log('channelGroupChannels', channelGroupChannels)
    setSelectedChannelGroup(event.target.value)
    setChannels(channelGroupChannels)
  }

  const TranslationsTable = ({ translations }) => {
    console.log('translations', translations)
    return (
      <TableContainer>
        <Table sx={{ minWidth: 650 }} size='small' aria-label='a dense table'>
          <TableHead sx={{background: theme.palette.primary.main}}>
            <TableRow>
              <TableCell sx={{color: theme.palette.common.white}}>Translations</TableCell>
              <TableCell sx={{color: theme.palette.common.white}}>Locale</TableCell>
              <TableCell sx={{color: theme.palette.common.white}}>Status</TableCell>
              <TableCell sx={{color: theme.palette.common.white}}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {translations?.translations?.sort((a, b) => a.locale.localeCompare(b.locale))
              .map((translation, index) => (
              <TableRow
                key={index}
                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
              >
                <TableCell component='th' scope='row'>{translation.path}</TableCell>
                <TableCell>{translation.locale}</TableCell>
                <TableCell>{translation.status}</TableCell>
                <TableCell>
                  {translation.status === 'linked' &&
                    <Button size='small' color='error' onClick={() => unlinkTranslation(translation.path)}>
                      <LinkOffIcon />
                    </Button>
                  }
                  {translation.status === 'suggested' &&
                    <Button size='small' color='primary' onClick={() => linkTranslation(translations.path, translation.path)}>
                      <AddLinkIcon />
                    </Button>
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )
  }

  return (
    <>
      <Container maxWidth={false} sx={{ pb: 3 }}>
        <Grid
          container
          direction='row'
          justifyContent='center'
          alignItems='stretch'
          alignContent='stretch'
          spacing={3}
        >
          {/* Source */}
          <Grid item xs={6}>
            <Card sx={{ height: '100%' }}>
              <CardHeader
                title={
                  <Grid
                    container
                    direction='row'
                    justifyContent='space-between'
                    alignItems='center'
                    alignContent='center'
                  >
                    <Grid item xs={12} display='flex' alignContent='center' alignItems='center'>
                      <Typography variant='h4' component='span'>Source</Typography>
                    </Grid>
                  </Grid>
                }
              />
              <Divider />
              <CardContent>
                <FormControl
                  variant='outlined'
                  sx={{ my: 1, marginRight: 1, minWidth: 240 }}
                >
                  <InputLabel id='componentGroup'>Channel Group</InputLabel>
                  <Select
                    id='channelGroup'
                    labelId='channelGroup'
                    label='Channel Group'
                    value={selectedChannelGroup || 'none'}
                    onChange={handleChannelGroupChange}
                  >
                    {!selectedChannelGroup && <MenuItem value='none'><em>Select Channel Group</em></MenuItem>}
                    {channelGroups.map(channelGroup => (
                      <MenuItem key={channelGroup.id} value={channelGroup}>
                        {channelGroup.displayName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <Divider sx={{ my: 1 }} />
                {channels && channels.length > 0 &&
                  <ChannelsHierarchicalList
                    environment={environment}
                    xAuthToken={xAuthToken}
                    channels={channels}
                    onItemFocus={setSelectedPath}
                    setLoading={setLoading}
                  />
                }
              </CardContent>
            </Card>
          </Grid>

          {/* Target */}
          <Grid item xs={6} sx={{ visibility: !translations && 'hidden' }}>
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
                    <Grid item xs={12} display='flex' alignContent='center' alignItems='center'>
                      <Typography variant='h4' component='span'>{translations?.path}</Typography>
                    </Grid>
                  </Grid>
                }
              />
              <Divider />
              <CardContent>
                { translations && <TranslationsTable translations={translations} /> }
              </CardContent>
            </Card>

            <Card sx={{ mt: 3}}>
              <CardHeader
                title={
                  <Typography variant='h4' component='span'>{selectedTargetPath}</Typography>
                }
                action={
                  <Button
                    variant='contained'
                    color='primary'
                    startIcon={<AddLinkIcon />}
                    disabled={!selectedTargetPath}
                    onClick={() => linkTranslation(translations.path, selectedTargetPath)}
                  >Link</Button>
                }
              />
              <Divider />
              <CardContent>
                { channels &&
                  <ChannelsHierarchicalList
                    environment={environment}
                    xAuthToken={xAuthToken}
                    channels={channels}
                    onItemFocus={setSelectedTargetPath}
                    setLoading={setLoading}
                  />
                }
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}


