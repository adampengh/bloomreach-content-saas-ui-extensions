import React, { useContext, useEffect, useState } from 'react'
import NextLink from 'next/link';

// APIs
import {
  getAllChannels,
  getAllComponentGroups,
  getAllComponents,
  getAllProjects,
  getDeveloperProject,
} from 'api';

// Layouts
import SidebarLayout from 'src/layouts/SidebarLayout';

// Components
import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

// Contexts
import { ConfigurationContext } from 'src/contexts/ConfigurationContext';


function ContentTypes() {
  // CONTEXT
  const {
    appConfiguration,
    storeApplicationConfiguration,
  } = useContext(ConfigurationContext)

  const {
    environment,
    xAuthToken,
    projectId,
  } = appConfiguration.source

  // STATE
  const [pageSize, setPageSize] = React.useState(10);
  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [selections, setSelections] = useState(appConfiguration?.pages?.components?.selections)

  // Projects
  const [projectsList, setProjectsList] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)

  // Channels
  const [channels, setChannels] = useState([])
  const [selectedChannel, setSelectedChannel] = useState(null)

  // Component Groups
  const [componentGroups, setComponentGroups] = useState([])
  const [selectedComponentGroup, setSelectedComponentGroup] = useState(null)

  const [components, setComponents] = useState([])

  useEffect(() => {
    setSelections(appConfiguration?.pages?.components?.selections)
  }, [appConfiguration?.pages?.components?.selections])

  useEffect(async () => {
    if (environment && xAuthToken) {
      await getAllProjects(environment, xAuthToken)
        .then(async (response) => {
          let projects = response.data
          if (projectId) {
            projects = projects.find(project => project.id === projectId)
          }
          await setProjectsList(response.data)
          await setSelectedProject(projects)
        })

      // Get all channels filtered by projectId
      if (appConfiguration?.pages?.components?.selections?.projectId) {
        await getAllChannels(environment, xAuthToken)
          .then(async (response) => {
            let channels = response.data;
            channels = channels.filter(channel => channel.branch === selections.projectId)
            await setChannels(channels)
            await setSelectedChannel(selections.channelId)
            await getAllComponentGroups(environment, xAuthToken, selections.channelId)
              .then(async (response) => {
                let nonBaseGroups = await response.data.filter(group => !group.system)
                await setComponentGroups(nonBaseGroups)
                await setSelectedComponentGroup(nonBaseGroups[0])
                await getAllComponents(environment, xAuthToken, channels[1].id, nonBaseGroups[0].name)
                  .then(response => {
                    const columns = response.data.map(item => {
                      return {
                        id: item.id,
                        ctype: item.ctype,
                        label: item.label,
                      }
                    })
                    setComponents(columns)
                  })
              })
              .catch((error) => {
                setError(error.message)
              })
            })
      }
      setIsLoaded(true)
    } else {
      setIsLoaded(true)
    }
  }, [appConfiguration.pages.components.selections])


  const handleProjectChange = async (e) => {
    e.preventDefault()
    setSelections({
      ...selections,
      projectId: e.target.value,
    })
    storeApplicationConfiguration({
      ...appConfiguration,
      pages: {
        components: {
          selections: {
            ...selections,
            projectId: e.target.value,
          },
        }
      }
    })
    const newProject = await projectsList.find(project => project.id === e.target.value)
    await setSelectedProject(newProject)
    await getAllChannels(environment, xAuthToken)
      .then(async (response) => {
        let channels = response.data;
        channels = channels.filter(channel => channel.branch === e.target.value)
        await setChannels(channels)
        await setSelectedChannel(channels[1])
      })
  }


  const handleChannelChange = async (e) => {
    e.preventDefault()
    setSelections({
      ...selections,
      channelId: e.target.value,
    })
    storeApplicationConfiguration({
      ...appConfiguration,
      pages: {
        components: {
          selections: {
            ...selections,
            channelId: e.target.value,
          },
        }
      }
    })
    const newChannel = await channels.find(channel => channel.id === e.target.value)
    await setSelectedChannel(newChannel)
    await getAllComponentGroups(environment, xAuthToken, newChannel.id)
      .then(async (response) => {
        const nonBaseGroups = response.data.filter(group => !group.system)
        await setComponentGroups(nonBaseGroups)
        await setSelectedComponentGroup(nonBaseGroups[0])
        await getAllComponents(environment, xAuthToken, newChannel.id, nonBaseGroups[0].name)
          .then(response => {
            const columns = response.data.map(item => {
              return {
                id: item.id,
                ctype: item.ctype,
                label: item.label,
              }
            })
            setComponents(columns)
          })
      })
  }


  const handleComponentGroupChange = async (e) => {
    e.preventDefault()
    setSelections({
      ...selections,
      componentGroup: e.target.value,
    })
    storeApplicationConfiguration({
      ...appConfiguration,
      pages: {
        components: {
          selections: {
            ...selections,
            componentGroup: e.target.value,
          },
        }
      }
    })
    const newComponentGroup = await componentGroups.find(componentGroup => componentGroup.name === e.target.value)
    await setSelectedComponentGroup(newComponentGroup)
    await getAllComponents(environment, xAuthToken, selections.channelId, e.target.value)
      .then(response => {
        const columns = response.data.map(item => {
          return {
            id: item.id,
            ctype: item.ctype,
            label: item.label,
          }
        })
        setComponents(columns)
      })
  }

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 360,
    },
    {
      field: 'label',
      headerName: 'Component Name',
      width: 360,
      renderCell: (params) => {
        console.log(params)
        return <NextLink href={`/components/${appConfiguration?.pages?.components?.selections?.channelId}/${params.row.id}`}>{params.row.label}</NextLink>
      }
    },
    {
      field: 'ctype',
      headerName: 'CType',
      width: 360,
    },
  ];

  return (
    <>
      <PageTitleWrapper>
        <PageTitle
          heading="Content Types"
        />
      </PageTitleWrapper>
      <Container maxWidth="xl">
        <Grid
          container
          direction="row"
          alignItems="stretch"
          alignContent="stretch"
          spacing={4}
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
              alignItems="stretch"
              alignContent="stretch"
            >
              <Card>
                <CircularProgress />
              </Card>
            </Grid>
          :
            <>
              <code>{ JSON.stringify(selections, null, 4) }</code>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <FormControl
                      variant="outlined"
                      sx={{ m: 1, minWidth: 240, marginTop: 2 }}
                    >
                      <InputLabel id="channel">Project</InputLabel>
                      <Select
                        id="project"
                        labelId="project"
                        label="Project"
                        value={selections?.projectId || ''}
                        onChange={(e) => handleProjectChange(e)}
                      >
                        {projectsList.map(project => (
                          <MenuItem key={project.id} value={project.id}>
                            {project.name} ({project.id})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    { selections?.channelId &&
                      <FormControl
                        variant="outlined"
                        sx={{ m: 1, minWidth: 240, marginTop: 2 }}
                      >
                        <InputLabel id="channel">Channel</InputLabel>
                        <Select
                          id="channel"
                          labelId="channel"
                          label="Channel"
                          value={selections?.channelId || ''}
                          onChange={(e) => handleChannelChange(e)}
                        >
                          {channels.map(channel => (
                            <MenuItem key={channel.id} value={channel.id}>
                              {channel.id}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    }

                    { selections?.channelId &&
                      <FormControl
                        variant="outlined"
                        sx={{ m: 1, minWidth: 240, marginTop: 2 }}
                      >
                        <InputLabel id="componentGroup">Component Group</InputLabel>
                        <Select
                          id="componentGroup"
                          labelId="componentGroup"
                          label="Component Group"
                          value={selectedComponentGroup?.name || ''}
                          onChange={(e) => handleComponentGroupChange(e)}
                        >
                          {componentGroups.map(componentGroup => (
                            <MenuItem key={componentGroup.name} value={componentGroup.name}>
                              {componentGroup.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    }
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Card>
                  <CardContent>
                    <Box sx={{ height: 'calc(100vh - 320px)', width: '100%' }}>
                      <DataGrid
                        rows={components}
                        columns={columns}
                        pageSize={pageSize}
                        onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                        rowsPerPageOptions={[10, 20, 30, components?.length]}
                        pagination
                        checkboxSelection
                        disableSelectionOnClick
                        initialState={{
                          sorting: {
                            sortModel: [{
                              field: 'id',
                              sort: 'asc'
                            }]
                          }
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            </>
          }
        </Grid>
      </Container>
    </>
  );
}

ContentTypes.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default ContentTypes;
