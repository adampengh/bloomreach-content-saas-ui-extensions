'use client'

import React, { Fragment, useContext, useEffect, useState } from 'react';

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
import { useTheme } from '@emotion/react'
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
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  StyledPageWrapper,
  StyledCardContent,
  StyledTableCell,
  StyledTableRow,
} from './styles'
import { PagesHierarchicalList } from 'src/components'
import CopyPagesModal from './modals/CopyPagesModal'

// Contexts
import { ConfigurationContext, LoadingContext } from 'src/contexts'

// Icons
import { ContentCopyIcon, HelpOutlineIcon } from 'src/icons'


const PagesCopyModule = () => {
  const theme = useTheme();

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
          const data = projectId ? response.data.filter(channel => channel.branch === projectId) : response.data;
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

          {/* Source Channel */}
          <Card display='flex' sx={{ gridArea: 'topLeft' }}>
            <CardHeader
              title={<Typography variant='h4' component='span'>Source Channel</Typography>}
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

          {/* Target Channel */}
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
                    >Copy Page{selectedPages.length > 1 && 's'}</Button>
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

          {/* Copy Log */}
          <Card sx={{ gridArea: 'bottom' }}>
            <CardHeader title={
              <Typography variant='h4' component='span'>
                Copy Log&nbsp;
                <Tooltip leaveDelay={0} title='Non-persitent log of copy operations'>
                  <HelpOutlineIcon fontSize='10px' />
                </Tooltip>
              </Typography>
            } />
            <Divider />
            <StyledCardContent
              sx={{
                maxHeight: 'calc(100% - 53px)',
                padding: 0,
                paddingBottom: '0 !important',
              }}>
              {pagesCopied?.pages?.length === 0
                ?
                  <Box padding={2}>
                    <Typography variant='body2' component='p'>Details of pages copied will appear here</Typography>
                  </Box>
                :
                  <Table sx={{ borderRadius: 0 }} size='small' aria-label='a dense table'>
                    <TableHead>
                      <TableRow>
                        <StyledTableCell>Status</StyledTableCell>
                        <StyledTableCell>Timestamp</StyledTableCell>
                        <StyledTableCell>Channel</StyledTableCell>
                        <StyledTableCell>Page Name</StyledTableCell>
                        <StyledTableCell>Page Path</StyledTableCell>
                        <StyledTableCell>Message</StyledTableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {pagesCopied?.pages?.map((page, index) => {
                        console.log('page', page)
                        return (
                          <StyledTableRow key={index} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                            <StyledTableCell>
                              {(() => {
                                switch (page.status) {
                                  case 'new':
                                    return <Typography variant='button' sx={{ color: theme.colors.success.main }}>Added</Typography>
                                  case 'updated':
                                    return <Typography variant='button' sx={{ color: theme.colors.success.main }}>Updated</Typography>
                                  case 'failed':
                                    return <Typography variant='button' sx={{ color: theme.colors.error.main }}>Failed</Typography>
                                  default:
                                    return null
                                }
                              })()}
                            </StyledTableCell>
                            <StyledTableCell>{page?.timestamp}</StyledTableCell>
                            <StyledTableCell>{page?.channel?.name}</StyledTableCell>
                            <StyledTableCell>{page?.page?.name}</StyledTableCell>
                            <StyledTableCell>{page?.path}</StyledTableCell>
                            <StyledTableCell>{page?.error}</StyledTableCell>
                          </StyledTableRow>
                        )
                      } )}

                    </TableBody>
                  </Table>
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
