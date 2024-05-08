'use client'

import React, { useContext, useEffect, useState } from 'react';

// API Methods
import {
  createOrUpdateFolder,
  getAllChannels,
  getFolder,
  getPage,
  getDeveloperProject,
  putPage,
} from 'bloomreach-content-management-apis'

// Components
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  Container,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';
import { PagesHierarchicalList } from 'src/components'
import {
  StyledPageWrapper,
  StyledCardContent,
} from './styles'
import CopyPagesModal from './modals/CopyPagesModal'

// Contexts
import { ConfigurationContext, LoadingContext } from 'src/contexts'

// Icons
import { CheckIcon, ContentCopyIcon, ErrorOutlineIcon } from 'src/icons'


const PagesCopyModule = () => {
  // Context
  const { appConfiguration } = useContext(ConfigurationContext)
  const { environment, xAuthToken, projectId } = appConfiguration.environments?.source
  const { setLoading } = useContext(LoadingContext)

  // State
  const [error, setError] = useState(null)
  const [showCopyModal, setShowCopyModal] = useState(false)

  const [channels, setChannels] = useState([])
  const [pageFolders, setPageFolders] = useState([])

  const [selectedPages, setSelectedPages] = useState([])

  // Target State
  const [targetChannels, setTargetChannels] = React.useState([]);
  const [pagesCopied, setPagesCopied] = useState({
    pages: []
  })

  useEffect(() => {
    if (!projectId || projectId === 'core') {
      setError('Please select a Source Developer Project in the Configuration')
    } else {
      setError(null)
    }

    if (environment && xAuthToken) {
      setLoading({ loading: true, message: 'Loading Channels'})
      getAllChannels(environment, xAuthToken)
        .then((response) => {
          let data = response.data;
          if (projectId) {
            data = response.data.filter(channel => channel.branch === projectId)
          }
          console.log('getAllChannels', data)
          setChannels(data)
          setLoading({ loading: false, message: '' })
        })
        .catch((error) => {
          console.error('getAllChannels', error)
          setLoading({ loading: false, message: '' })
        })
    }
  }, [appConfiguration])

  async function getPageFolders(environment, xAuthToken, channels) {
    let processedChannels = []
    for await (const channel of channels) {
      console.log('getChannelFolders()', channel.branchOf)
      await setLoading({ loading: true, message: `Loading Channel: ${channel.id}` })
      await getFolder(environment, xAuthToken, `content/documents/${channel.branchOf}/pages`, 5)
        .then(response => {
          // console.log('getFolder()', response.data)
          processedChannels = [...processedChannels, {
            channel: channel,
            folders: response.data
          }]
        })
        .catch(error => console.error(error));
    }

    await console.log('Processed Channels', processedChannels)
    await setPageFolders(processedChannels)
    await setLoading({ loading: false, message: '' })
  }

  useEffect(() => {
    getPageFolders(environment, xAuthToken, channels)
  }, [channels])

  const handleToggle = (value) => () => {
    const currentIndex = targetChannels.indexOf(value);
    const newChecked = [...targetChannels];
    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setTargetChannels(newChecked);
  };

  const handleSelectAll = () => {
    setTargetChannels((prevState) => prevState.length === 0 ? [...channels] : [])
  }

  const renderError = () => {
    return (
      <Grid item xs={12}>
        <Card>
          <CardHeader title='Error' />
          <Divider />
          <CardContent>
            <Alert severity='error'>{error}</Alert>
          </CardContent>
        </Card>
      </Grid>
    )
  }

  return (
    <Container maxWidth={false} sx={{ height: 'calc(100% - 180px)' }}>
      {error ? (
        renderError()
      ) : (
        <StyledPageWrapper gap={3}>
          <Card display='flex' sx={{ gridArea: 'topLeft' }}>
            <CardHeader
              title='Source Channel'
              subheader={
                <Typography variant='body2'>Use <code>ctrl/cmd</code> + <code>click</code> or <code>shift</code> + <code>click</code> for multi-select</Typography>
              }
            />
            <Divider />

            <StyledCardContent sx={{ maxHeight: 'calc(100% - 84px)' }}>
              <PagesHierarchicalList
                pageFolders={pageFolders}
                selectedPages={selectedPages}
                setSelectedPages={setSelectedPages}
              />
            </StyledCardContent>
          </Card>

          <Card sx={{ gridArea: 'topRight' }}>
            <CardHeader title={
              <Grid
                container
                direction='row'
                justifyContent='space-between'
                alignItems='center'
                alignContent='center'>
                  <Grid item xs={6} display='flex' alignContent='center' alignItems='center'>
                    <Typography variant='h4' component='span'>Target Channel</Typography>
                  </Grid>
                  <Grid item xs={6} textAlign='right'>
                    <Button
                      variant='contained'
                      disabled={!(selectedPages.length && targetChannels.length)}
                      startIcon={<ContentCopyIcon />}
                      onClick={() => setShowCopyModal(true)}
                    >Copy Page</Button>
                  </Grid>
              </Grid>
            } />
            <Divider />
            <StyledCardContent sx={{ maxHeight: 'calc(100% - 84px)' }}>
              <Box sx={{ px: 2 }}>
                <Button
                  color='primary'
                  variant='outlined'
                  onClick={handleSelectAll}
                >
                  {targetChannels.length === 0 ? 'Select all' : 'Unselect all'}
                </Button>
              </Box>
              <List dense sx={{ width: '100%' }}>
                {channels.map((channel) => (
                  <ListItem
                    key={channel.id}
                    dense
                    disablePadding
                    disableGutters
                  >
                    <ListItemButton onClick={handleToggle(channel)} dense>
                      <ListItemIcon>
                        <Checkbox
                          edge='start'
                          checked={targetChannels.indexOf(channel) !== -1}
                          disableRipple
                          tabIndex={-1}
                        />
                      </ListItemIcon>
                      <ListItemText primary={channel.name} />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </StyledCardContent>
          </Card>

          <Card sx={{ gridArea: 'bottom' }}>
            <CardHeader title='Copy Log' />
            <Divider />
            <StyledCardContent sx={{ maxHeight: 'calc(100% - 62px)' }}>
              {pagesCopied?.pages?.length > 0 &&
                <Box sx={{ paddingTop: 3 }}>
                  <Typography variant='h4' component='h4'>
                    Pages Copied
                  </Typography>
                  <List>
                    {pagesCopied?.pages?.map((page, index) =>
                      <ListItem key={index} sx={{padding: 0.5 }}>
                        {page.status !== 'failed' ?
                          <>
                            <ListItemIcon>
                              <CheckIcon />
                            </ListItemIcon>
                            <ListItemText>
                              {page.status === 'new' &&
                                <>
                                  <strong>{page?.page?.name}</strong> added to <strong>{page?.channel?.id}</strong>
                                </>
                              }
                              {page.status === 'updated' &&
                                <>
                                  <strong>{page?.page?.name}</strong> updated in <strong>{page?.channel?.id}</strong>
                                </>
                              }
                            </ListItemText>
                          </>
                          :
                          <>
                            <ListItemIcon>
                              <ErrorOutlineIcon />
                            </ListItemIcon>
                            <ListItemText>
                              <strong>{page?.page?.name}</strong> failed in <strong>{page?.channel?.id}</strong> because {page.error}
                            </ListItemText>
                          </>
                        }
                      </ListItem>
                    )}
                  </List>
                </Box>
              }
            </StyledCardContent>
          </Card>
        </StyledPageWrapper>
      )}

      <CopyPagesModal
        showModal={showCopyModal}
        setShowModal={setShowCopyModal}
        selectedPages={selectedPages}
        setSelectedPages={setSelectedPages}
        targetChannels={targetChannels}
        setTargetChannels={setTargetChannels}
        pagesCopied={pagesCopied}
        setPagesCopied={setPagesCopied}
      />
    </Container>
  )
}

export default PagesCopyModule
