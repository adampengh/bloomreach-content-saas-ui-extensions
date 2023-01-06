import React, { useContext, useEffect, useState } from 'react';

// API Methods
import {
  createOrUpdateFolder,
  getAllChannels,
  getFolder,
  getPage,
  putPage,
} from 'api'

// Layouts
import SidebarLayout from 'src/layouts/SidebarLayout';

// Components
import PageHeader from 'src/content/Pages/PageHeader';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
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
  Select,
  Typography,
} from '@mui/material';

// Contexts
import { ConfigurationContext } from 'src/contexts/ConfigurationContext';

// Icons
import DescriptionIcon from '@mui/icons-material/Description';
import EastIcon from '@mui/icons-material/East';
import FolderIcon from '@mui/icons-material/Folder';

function Pages() {
  const [checked, setChecked] = React.useState([]);
  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [channels, setChannels] = useState([])
  const [sourceChannel, setSourceChannel] = useState({})
  const [sourcePageList, setSourcePageList] = useState()

  const [targetChannel, setTargetChannel] = useState({})
  const [targetPageList, setTargetPageList] = useState()

  const {
    appConfiguration
  } = useContext(ConfigurationContext)

  const {
    environment,
    xAuthToken,
    projectId,
  } = appConfiguration


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
          setError(null)
        })
        .catch((error) => {
          setError(error.message)
          setIsLoaded(true)
        })
    }
  }, [appConfiguration])


  const handleSourceDropdownChange = (event) => {
    const currentChannel = channels.find(ch => ch.id === event.target.value)
    setSourceChannel(currentChannel)
    getPageList(currentChannel, setSourcePageList)
  }

  const handleTargetDropdownChange = (event) => {
    const currentChannel = channels.find(ch => ch.id === event.target.value)
    setTargetChannel(currentChannel)
    getPageList(currentChannel, setTargetPageList)
  }

  const getPageList = async (channel, callback) => {
    console.log('getPageList')
    const folderPath = channel?.contentRootPath + '/pages'
    await getFolder(environment, xAuthToken, folderPath)
      .then(response => {
        callback(response.data)
      })
  }

  const copyPages = async () => {
    console.log('Copy Selected Pages')
    for await (const page of checked) {
      await copyPage(page)
    }

    // Remove all checked pages from Source Channel
    setChecked([])
    // Add new pages to Target Page List (targetPageList)
    getPageList(targetChannel, setTargetPageList)
  }

  const copyPage = async (page) => {
    console.log('Copy Individual Page')
    const path = page.relativePagePath

    await createFoldersRecursively(path)

    // Get Page from Source Channel
    const pageData = await getPage(environment, xAuthToken, sourceChannel.branchOf, path)
      .then(response => response.data)
      .catch((err) => {
        console.error('get page error', err);
      })

    // Put Page into Target Channel
    if (pageData) {
      await putPage(environment, xAuthToken, projectId, targetChannel.branchOf, path, pageData)
        .then(response => console.log('response', response))
        .catch((err) => {
          console.error('Copy Page Error:', err);
        })
    }
  }

  const createFoldersRecursively = async (path) => {
    let segments = path.split('/')
    segments.pop()

    let folderPath = targetChannel.contentRootPath;
    for await (const segment of segments) {
      folderPath += '/' + segment
      await getFolder(environment, xAuthToken, folderPath)
        .then(response => {
          console.log(response)
        })
        .catch(async (error) => {
          console.error(error.response.status)
          if (error.response.status === 404) {
            await createOrUpdateFolder(environment, xAuthToken, targetChannel.branchOf, folderPath, segment)
          }
        })
    }
  }


  return (
    <>
      <PageTitleWrapper>
        <PageHeader />
      </PageTitleWrapper>
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
                        && targetChannel.id
                          && sourceChannel.id !== targetChannel.id &&
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
                      <FormControl variant="outlined" sx={{ m: 1, minWidth: 320 }}>
                        <InputLabel id="source-channel-select-label">Channel</InputLabel>
                        <Select
                          id="source-channel-select"
                          labelId="source-channel-select-label"
                          label="Source Channel"
                          value={targetChannel.id ? targetChannel.id : ''}
                          onChange={handleTargetDropdownChange}
                        >
                          {channels.map((channel) => (
                            <MenuItem key={channel.id} value={channel.id}>
                              {channel.name} ({channel.branch})
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                  <TreeList
                    channel={targetChannel}
                    pageFolder={targetPageList}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
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


Pages.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Pages;
