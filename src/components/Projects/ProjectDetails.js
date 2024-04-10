'use client'

import React, { useContext, useEffect, useState } from 'react'
import { CopyBlock } from 'react-code-blocks'
import bloomreachTheme from 'src/theme/code-block/bloomreachTheme'
import NextLink from 'next/link';

// APIs
import {
  getAllCoreChannels,
  getAllChannels,
  getDeveloperProject,
  mergeDeveloperProject,
  rebaseDeveloperProject,
  reopenDeveloperProject,
} from 'bloomreach-content-management-apis';

// Components
import AddChannelModal from './modals/AddChannelModal';
import DeleteChannelModal from './modals/DeleteChannelModal';
import DeleteProjectModal from './modals/DeleteProjectModal';
import { ChannelIcon, Loader, StatusIndicator, TabPanel } from 'src/components'
import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import {
  Breadcrumbs,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Tabs,
  Tab,
  Typography,
} from '@mui/material';

// Contexts
import { ConfigurationContext } from 'src/contexts/ConfigurationContext';
import { ErrorContext } from 'src/contexts/ErrorContext';

// Icons
import DeleteIcon from '@mui/icons-material/Delete';

const ProjectDetails = ({ instance, projectId }) => {
  // State
  const [isLoaded, setIsLoaded] = useState(false)
  const [showAddChannelModal, setShowAddChannelModal] = useState(false)
  const [showDeleteChannelModal, setShowDeleteChannelModal] = useState(false)
  const [channelToDelete, setChannelToDelete] = useState(null)
  const [showDeleteProjectModal, setShowDeleteProjectModal] = useState(false)

  const [tab, setTab] = useState(0);

  const [channels, setChannels] = useState([])
  const [coreChannels, setCoreChannels] = useState([])
  const [availableChannels, setAvailableChannels] = useState([])
  const [projectData, setProjectData] = useState([])

  // Context
  const { appConfiguration } = useContext(ConfigurationContext)
  const { handleShowSnackbar } = useContext(ErrorContext)


  useEffect(() => {
    if (instance && projectId) {
      console.log('ProjectDetails:', instance, projectId)
      const environment = appConfiguration?.environments?.[instance]?.environment
      const xAuthToken = appConfiguration?.environments?.[instance]?.xAuthToken
      if (environment && xAuthToken) {
        getDeveloperProject(environment, xAuthToken, projectId)
          .then(response => {
            console.log('projectData', response.data)
            setProjectData(response.data)
          })
          .catch(err => console.log(err))

        getAllCoreChannels(environment)
          .then(response => setCoreChannels(response.data))
          .catch(err => console.log(err))

        getAllChannels(environment, xAuthToken)
          .then(response => setChannels(response?.data?.filter(project => project.branch === projectId)))
          .catch(err => console.log(err))

        setIsLoaded(true)
      }
    }
  }, [instance, projectId, appConfiguration])

  useEffect(() => {
    // Filter out core channels that have already been added to the project
    if (channels) {
      const channelsNotInProject = coreChannels?.filter(coreChannel => {
        return channels?.find(channel => channel.branchOf === coreChannel.name) ? false : true
      })
      console.log('availableChannels', channelsNotInProject)
      setAvailableChannels(channelsNotInProject)
    }
  }, [channels])

  const handleChange = (_, newValue) => {
    setTab(newValue);
  };

  const handleClickDeleteIcon = (channelId) => {
    setChannelToDelete(channelId)
    setShowDeleteChannelModal(true)
  }

  const handleMergeProject = async () => {
    console.log('MERGE PROJECT')
    await mergeDeveloperProject(appConfiguration?.environments?.[instance]?.environment, appConfiguration?.environments?.[instance]?.xAuthToken, projectId)
    await getDeveloperProject(appConfiguration?.environments?.[instance]?.environment, appConfiguration?.environments?.[instance]?.xAuthToken, projectId)
      .then(response => {
        console.log('projectData', response.data)
        setProjectData(response.data)
      })
      .catch(err => console.log(err))
    await handleShowSnackbar('success', 'Project Merged')
  }

  const handleRebaseProject = async () => {
    console.log('REBASE PROJECT')
    await rebaseDeveloperProject(appConfiguration?.environments?.[instance]?.environment, appConfiguration?.environments?.[instance]?.xAuthToken, projectId)
    await getDeveloperProject(appConfiguration?.environments?.[instance]?.environment, appConfiguration?.environments?.[instance]?.xAuthToken, projectId)
      .then(response => {
        console.log('projectData', response.data)
        setProjectData(response.data)
      })
      .catch(err => console.log(err))
    await handleShowSnackbar('success', 'Project Rebased')
  }

  const handleReopenProject = async () => {
    console.log('REOPEN PROJECT')
    await reopenDeveloperProject(appConfiguration?.environments?.[instance]?.environment, appConfiguration?.environments?.[instance]?.xAuthToken, projectId)
    await getDeveloperProject(appConfiguration?.environments?.[instance]?.environment, appConfiguration?.environments?.[instance]?.xAuthToken, projectId)
      .then(response => {
        console.log('projectData', response.data)
        setProjectData(response.data)
      })
      .catch(err => console.log(err))
    await handleShowSnackbar('success', 'Project Reopened')
  }

  return (
    <>
      <PageTitleWrapper>
        <Grid
          container
          alignContent='center'
          justifyContent='space-between'
        >
          <Grid item display="flex">
            <Grid item>
              <PageTitle
                heading={projectData?.name}
                subHeading={`Project ID: ${projectId}`}
              />
            </Grid>
            <Grid item sx={{ marginLeft: '1rem', paddingTop: '0.5rem'}}>
              <StatusIndicator
                message={projectData?.state?.message}
                size='medium'
                status={projectData?.state?.status}
              />
            </Grid>
          </Grid>
          <Grid item>
            <ButtonGroup aria-label="outlined primary button group">
              {/* IN PROGRESS */}
              { projectData?.state?.status === 'IN_PROGRESS' &&
                projectData?.state?.availableActions?.includes('REBASE_PROJECT') &&
                <Button
                  sx={{ margin: 1, marginRight: 0, marginLeft: 0 }}
                  color="primary"
                  onClick={() => handleRebaseProject()}
                >
                  Update
                </Button>
              }

              {/* APPROVED or MERGED */}
              { (projectData?.state?.status === 'APPROVED' || projectData?.state?.status === 'MERGED') &&
                <>
                  <Button
                    sx={{ margin: 1, marginRight: 0, marginLeft: 0 }}
                    color="primary"
                    onClick={() => handleReopenProject()}
                  >
                    Re-Open
                  </Button>
                </>
              }

              { projectData?.state?.status !== 'MERGED' &&
                <Button
                  sx={{ margin: 1, marginRight: 0, marginLeft: 0 }}
                  color="primary"
                  onClick={() => handleMergeProject()}
                >
                  Merge
                </Button>
              }
              <Button
                disabled={!(projectData?.state?.status === 'IN_PROGRESS' || projectData?.state?.status === 'MERGED')}
                sx={{ margin: 1, marginRight: 0, marginLeft: 0 }}
                color="error"
                onClick={() => setShowDeleteProjectModal(true)}
              >
                Delete Project
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      </PageTitleWrapper>

      <Container maxWidth="xl">
        <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: '1.5rem'}}>
          <Link
            color="inherit"
            href="/projects"
            underline="hover"
          >
            Projects
          </Link>
          <Typography color="text.primary">{projectData?.name}</Typography>
        </Breadcrumbs>

        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          alignContent="stretch"
          sx={{
            '& .MuiCircularProgress-root': {
              margin: '24px'
            }
          }}
        >
        { !isLoaded
          ? <Loader open={!isLoaded} />
          :
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ fontWeight: 'bold', letterSpacing: '.05rem' }}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tab} onChange={handleChange} aria-label="basic tabs example">
                      <Tab label="Channels" />
                      <Tab label="JSON" />
                    </Tabs>
                  </Box>
                  <TabPanel value={tab} index={0}>
                    <List sx={{ padding: 0 }}>
                      {channels?.map(channel =>
                        <ListItem key={channel.id} component="div"
                          secondaryAction={
                            <IconButton
                              edge="end"
                              aria-label="delete"
                              onClick={() => handleClickDeleteIcon(channel.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          }>
                          <NextLink href={`/channels/${channel.id}`} passHref legacyBehavior>
                            <ListItemButton>
                              <ListItemAvatar>
                                <ChannelIcon icon={channel.icon} />
                              </ListItemAvatar>
                              <ListItemText primary={`${channel.name} (${channel.id})`} />
                            </ListItemButton>
                          </NextLink>
                        </ListItem>
                      )}
                    </List>
                    <Button
                      disabled={!availableChannels.length > 0}
                      sx={{ margin: 1 }}
                      variant="outlined"
                      onClick={() => setShowAddChannelModal(true)}
                    >
                      Add Channels
                    </Button>
                  </TabPanel>
                  <TabPanel value={tab} index={1}>
                    { projectData &&
                      <CopyBlock
                        text={JSON.stringify(projectData, null, 4)}
                        language='json'
                        wrapLines
                        theme={bloomreachTheme}
                        showLineNumbers={true}
                        codeBlock
                      />
                    }
                  </TabPanel>
                </CardContent>
              </Card>
            </Grid>
          }
        </Grid>
      </Container>

      <AddChannelModal
        showAddChannelModal={showAddChannelModal}
        setShowAddChannelModal={setShowAddChannelModal}
        channels={channels}
        setChannels={setChannels}
        coreChannels={coreChannels}
        instance={instance}
        projectId={projectId}
      />

      <DeleteChannelModal
        showDeleteChannelModal={showDeleteChannelModal}
        setShowDeleteChannelModal={setShowDeleteChannelModal}
        channels={channels}
        setChannels={setChannels}
        channelToDelete={channelToDelete}
        instance={instance}
      />

      <DeleteProjectModal
        showModal={showDeleteProjectModal}
        setShowModal={setShowDeleteProjectModal}
        projectData={projectData}
        instance={instance}
      />
    </>
  )
}

export default ProjectDetails
