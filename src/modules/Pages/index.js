'use client'

import React, { useContext, useEffect, useState } from 'react';

// API Methods
import {
  createOrUpdateFolder,
  getAllChannels,
  getFolder,
  getPage,
  putPage,
} from 'bloomreach-content-management-apis'

// Components
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  Container,
  FormControl,
  Grid,
  InputLabel,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from '@mui/material';

// Contexts
import { ConfigurationContext } from 'src/contexts/ConfigurationContext';
import { ErrorContext } from 'src/contexts/ErrorContext';

// Icons
import CheckIcon from '@mui/icons-material/Check';
import DescriptionIcon from '@mui/icons-material/Description';
import EastIcon from '@mui/icons-material/East';
import FolderIcon from '@mui/icons-material/Folder';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const PagesComponent = () => {
  const [checked, setChecked] = React.useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [channels, setChannels] = useState([])
  const [sourceChannel, setSourceChannel] = useState({})
  const [sourcePageList, setSourcePageList] = useState()

  const [selectAll, setSelectAll] = useState(false)
  const [targetChannels, setTargetChannels] = useState([])

  const [pagesCopied, setPagesCopied] = useState({
    pages: []
  })

  const {
    appConfiguration
  } = useContext(ConfigurationContext)

  const {
      handleShowSnackbar
  } = useContext(ErrorContext)

  const {
    environment,
    xAuthToken,
    projectId,
  } = appConfiguration.environments?.source


  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };


  const MenuProps = {
    PaperProps: {
      style: {
        width: 320,
      },
    },
  };

  const handleSelectedChannelsChange = (event) => {
    const {
      target: { value },
    } = event;
    setTargetChannels(
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleSelectAllChannels = () => {
    !selectAll ? setTargetChannels(channels) : setTargetChannels([]);
    setSelectAll(!selectAll)
  }

  useEffect(() => {
    if (environment && xAuthToken) {
      getAllChannels(environment, xAuthToken)
        .then((response) => {
          let data = response.data;
          if (projectId) {
            data = response.data.filter(channel => channel.branch === projectId)
          }
          setChannels(data)
          setIsLoaded(true)
        })
        .catch((error) => {
          setIsLoaded(true)
        })
    }
  }, [appConfiguration])


  const handleSourceDropdownChange = (event) => {
    const currentChannel = channels.find(ch => ch.id === event.target.value)
    setSourceChannel(currentChannel)
    getPageList(currentChannel, setSourcePageList)
  }

  const getPageList = async (channel, callback) => {
    const folderPath = channel?.contentRootPath + '/pages'
    await getFolder(environment, xAuthToken, folderPath)
      .then(response => callback(response.data))
  }

  const copyPages = async () => {
    setPagesCopied({pages: []})
    for await (const targetChannel of targetChannels) {
      for await (const page of checked) {
        await copyPage(page, targetChannel)
      }
    }

    // Remove all checked pages from Source Channel
    setChecked([])
  }

  const copyPage = async (page, targetChannel) => {
    const path = page.relativePagePath

    // Recursively create folder structure
    await createFoldersRecursively(path, targetChannel)

    // Get Page from Source Channel
    const pageData = await getPage(environment, xAuthToken, sourceChannel.branchOf, path, projectId)
        .then(response => response.data)
        .catch(async (err) => {
          if (err.response.status === 404) {
            return await getPage(environment, xAuthToken, sourceChannel.branchOf, path, 'core')
              .then(response => response.data)
          } else {
            console.error('Get page error', err);
          }
        })

    // Put Page into Target Channel
    if (pageData) {
      await putPage(environment, xAuthToken, projectId, targetChannel.branchOf, path, pageData)
        .then(response => {
          setPagesCopied(prevState => ({
            pages: [...prevState.pages, {
              channel: targetChannel,
              page: pageData,
              status: 'new'
            }]
          }))
        })
      .catch(async (err) => {
        if (err.response.status === 409) {
          console.warn('Page already exists in this project. Getting x-resource-version and trying again.')
          await getPage(environment, xAuthToken, targetChannel.branchOf, path, projectId)
            .then(async (response) => {
              const xResourceVersion = response.headers['x-resource-version']
              await putPage(environment, xAuthToken, projectId, targetChannel.branchOf, path, pageData, xResourceVersion)
                .then(response => {
                  setPagesCopied(prevState => ({
                    pages: [...prevState.pages, {
                        channel: targetChannel,
                        page: pageData,
                        status: 'updated'
                    }]
                  }))
                })
                .catch((err) => {
                  console.error('Failed to putPage existing page:', err);
                })
              })
        } else {
          console.error('Failed to putPage:', err.response);
          setPagesCopied(prevState => ({
            pages: [...prevState.pages, {
              channel: targetChannel,
              page: pageData,
              status: 'failed',
              error: err.response.data
            }]
          }))
        }
      })
    }
  }

  const createFoldersRecursively = async (path, targetChannel) => {
    let segments = path.split('/')
    segments.pop()

    let folderPath = targetChannel.contentRootPath;
    for await (const segment of segments) {
      folderPath += '/' + segment
      await getFolder(environment, xAuthToken, folderPath)
        .catch(async (error) => {
          if (error.response.status === 404) {
            await createOrUpdateFolder(environment, xAuthToken, "pageFolder", targetChannel.branchOf, folderPath, segment)
          } else {
            console.error("Error creating folders recursively: ", error)
          }
        })
    }
  }

  return (
    <>

      <Container maxWidth="xl">
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          columnSpacing={{ xs: 0 }}
          rowSpacing={{ xs: 3 }}
        >
          <Grid item xs={12} md={5.5}>
            <Card>
              <CardHeader title="Source Channel" />
              <Divider />
              <CardContent>
                <Box
                  component="div"
                  sx={{
                    '& .MuiTextField-root': { m: 2, width: '80ch' }
                  }}
                >
                  <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="stretch"
                    spacing={1}
                  >
                    <Grid item xs={12} md={6}>
                    <FormControl variant="outlined" sx={{ m: 1, minWidth: 240 }}>
                      <InputLabel id="source-channel-select-label">Channel</InputLabel>
                      <Select
                        id="source-channel-select"
                        labelId="source-channel-select-label"
                        label="Source Channel"
                        value={sourceChannel.id ? sourceChannel.id : ''}
                        onChange={handleSourceDropdownChange}
                      >
                        {channels.map((channel) => (
                          <MenuItem key={channel.id} value={channel.id}>
                            {channel.name} ({channel.branch})
                          </MenuItem>
                        ))}
                      </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6}>
                      { checked.length > 0
                        && !!targetChannels.length &&
                          <FormControl variant="outlined" sx={{ m: 1, minWidth: 160 }}>
                            <Button
                              sx={{ margin: 1, padding: 1 }}
                              variant="contained"
                              onClick={copyPages}
                            >
                              Copy {checked.length == 1 ? 'Page' : 'Pages'}
                            </Button>
                          </FormControl>
                      }
                    </Grid>
                  </Grid>

                  <TreeList
                    channel={sourceChannel}
                    pageFolder={sourcePageList}
                    handleToggle={handleToggle}
                    checked={checked}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item
            xs={12}
            md={1}
            sx={{
              '&.MuiGrid-item': {
                width: '100%',
                paddingTop: '4rem',
                textAlign: 'center',
              }
            }}
          >
            <EastIcon sx={{ fontSize: 64 }} />
          </Grid>

          {/* Target Channel */}
          <Grid item xs={12} md={5.5}>
            <Card>
              <CardHeader title="Target Channel" />
              <Divider />
              <CardContent>
                <Box
                  component="div"
                  sx={{
                    '& .MuiTextField-root': { m: 2, width: '80ch' }
                  }}
                >
                  <Grid
                    container
                    direction="row"
                    justifyContent="space-between"
                    alignItems="stretch"
                    spacing={4}
                  >
                    <Grid item xs={12} md={6}>
                      <FormControl required sx={{ m: 1, width: 320 }}>
                        <InputLabel id="target-channel-select-label">Channel(s)</InputLabel>
                        <Select
                          label="Target Channel(s)"
                          labelId="target-channel-select-label"
                          id="target-channel-select"
                          multiple
                          value={targetChannels}
                          onChange={handleSelectedChannelsChange}
                          input={<OutlinedInput label="Data Types" />}
                          renderValue={(selected) => {
                            return selected.map(channel => channel.name).join(', ')
                          }}
                          MenuProps={MenuProps}
                        >
                          <MenuItem onClick={handleSelectAllChannels}>
                            <ListItemText primary={`${!selectAll ? 'Select All' : 'Deselect All'}`} />
                          </MenuItem>
                          {channels.map((channel) => (
                            <MenuItem key={channel.id} value={channel}>
                              <Checkbox checked={targetChannels.indexOf(channel) > -1} />
                              <ListItemText primary={`${channel.name} (${channel.branch})`} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  {pagesCopied?.pages?.length > 0 &&
                    <Box sx={{ paddingTop: 3 }}>
                      <Typography variant="h4" component="h4">
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
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

const TreeList = ({ channel, pageFolder, handleToggle, checked }) => {
  const folders = pageFolder?.folders
  const pages = pageFolder?.pages
  const depth = 0;
  const path = channel?.contentRootPath + '/pages/'

  return (
    <List
      component="div"
      disablePadding
      sx={{ ml: depth * 4 }}
    >
      { pages?.map((page, index) => {
        return (
          <Page
            key={index}
            page={page}
            handleToggle={handleToggle}
            checked={checked}
            depth={depth}
          />
        )
      })}
      { folders?.map((folder, index) => {
        return (
          <Folder
            key={index}
            folder={folder}
            handleToggle={handleToggle}
            checked={checked}
            depth={depth}
            path={path}
          />
        )
      })}
    </List>
  )
}

const Folder = ({ folder, handleToggle, checked, depth, path }) => {
  const pages = folder?.pages
  const folders = folder?.folders
  const folderPath = folder.path + '/'
  return (
    <List
      component="div"
      disablePadding
      sx={{ marginLeft: depth * 2 }}
    >
      <ListItem disablePadding sx={{ pt: 1, pb: 0, pl: 5.5 }}>
        <ListItemIcon>
          <FolderIcon />
        </ListItemIcon>
        <ListItemText primary={
          <Typography type="body2" style={{ fontWeight: 'bold' }}>{folder.path.replace(path, '')}</Typography>} sx={{ pl: 0 }} />
      </ListItem>
      { pages?.map((page, index) => {
        return (
          <Page
            key={index}
            page={page}
            handleToggle={handleToggle}
            checked={checked}
            depth={depth + 1}
          />
        )
      })}
      { folders?.map((folder, index) => {
        return (
          <Folder
            key={index}
            folder={folder}
            handleToggle={handleToggle}
            checked={checked}
            depth={depth + 1}
            path={folderPath}
          />
        )
      })}
    </List>
  )
}

const Page = ({ page, handleToggle, checked, depth }) => {
  const paddingLeft = depth ? '52px' : '16px'
  return (
    <ListItem
      key={page.path}
      disablePadding
    >
      <ListItemButton
        role={undefined}
        onClick={handleToggle ? handleToggle(page) : null}
        dense
        sx={{ paddingLeft: paddingLeft }}
      >
        <ListItemIcon>
          { handleToggle && checked
            ? <Checkbox
                edge="start"
                checked={checked.indexOf(page) !== -1}
                tabIndex={-1}
                disableRipple
                sx={{ '& .MuiSvgIcon-root': { fontSize: 24 } }}
              />
            : <DescriptionIcon />
          }
        </ListItemIcon>
        <ListItemText primary={page.displayName} />
      </ListItemButton>
    </ListItem>
  )
}

export default PagesComponent
