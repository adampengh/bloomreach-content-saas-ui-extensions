'use client'

import React, { useContext, useEffect, useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

// APIs
import {
  getAllCoreChannels,
  getAllChannels,
  getDeveloperProject,
  mergeDeveloperProject,
  rebaseDeveloperProject,
  reopenDeveloperProject,
  getAllProjects,
} from 'bloomreach-content-management-apis';

// Components
import AddChannelModal from '../components/modals/AddChannelModal';
import DeleteChannelModal from '../components/modals/DeleteChannelModal';
import DeleteProjectModal from '../components/modals/DeleteProjectModal';
import { StatusIndicator, TabPanel } from 'src/components'
import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import {
  Alert,
  Breadcrumbs,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Container,
  FormControl,
  Grid,
  InputLabel,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  MenuItem,
  Select,
  Tabs,
  Tab,
  Typography,
  Divider,
} from '@mui/material';

// Contexts
import { ConfigurationContext, ErrorContext, LoadingContext } from 'src/contexts'

// Icons
import { DocumentIcon, LanguageIcon, ResourceBundleIcon, WebIcon } from 'src/icons'

// Lib
import { copyEntireProject } from '@/lib/operations';

// Tabs
import { ChannelsTab, DocumentsTab, PagesTab, ResourceBundlesTab } from '../components/tabs';
import Modal from '@/components/Modal';

const TABS = [
  'channels',
  'documents',
  'pages',
  'resource_bundles',
  'content_types',
]

export const ProjectsDetailsModule = ({ instance, projectId }) => {
  const router = useRouter();
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab');

  // State
  const [showModal, setShowModal] = useState(false)
  const [showAddChannelModal, setShowAddChannelModal] = useState(false)
  const [showDeleteChannelModal, setShowDeleteChannelModal] = useState(false)
  const [channelToDelete, setChannelToDelete] = useState(null)
  const [showDeleteProjectModal, setShowDeleteProjectModal] = useState(false)

  const [value, setValue] = useState(0);

  const [channels, setChannels] = useState([])
  const [coreChannels, setCoreChannels] = useState([])
  const [availableChannels, setAvailableChannels] = useState([])
  const [projectData, setProjectData] = useState([])
  const [targetProjects, setTargetProjects] = useState([])
  const [targetProjectId, setTargetProjectId] = useState('new')

  // Context
  const { appConfiguration } = useContext(ConfigurationContext)
  const { handleShowSnackbar } = useContext(ErrorContext)
  const { setLoading } = useContext(LoadingContext)


  useEffect(() => {
    if (tab) setValue(TABS.indexOf(tab));

    if (instance && projectId) {
      console.log('ProjectDetails:', instance, projectId)
      const environment = appConfiguration?.environments?.[instance]?.environment
      const xAuthToken = appConfiguration?.environments?.[instance]?.xAuthToken
      if (environment && xAuthToken) {
        setLoading({ loading: true, message: `Loading Project ${projectId}` })
        // Get Developer Project Details
        const projectPromise = getDeveloperProject(environment, xAuthToken, projectId, true)
          .then(response => {
            console.log('projectData', response.data)
            setProjectData(response.data)
            console.log('tab', tab)
            if (tab === 'content_types' && !response.data.includeContentTypes) {
              setValue(0)
            }
          })
          .catch(err => console.error(err))

        const coreChannelsPromise = getAllCoreChannels(environment)
          .then(response => setCoreChannels(response.data))
          .catch(err => console.log(err))

        const allChannelsPromise = getAllChannels(environment, xAuthToken)
          .then(response => setChannels(response?.data?.filter(project => project.branch === projectId)))
          .catch(err => console.log(err))

        Promise.all([projectPromise, coreChannelsPromise, allChannelsPromise])
          .then(() => {
            setLoading({ loading: false, message: '' })
          })
          .catch(err => {
            console.error(err)
            setLoading({ loading: false, message: '' })
          })
      }
    }
  }, [instance, projectId, appConfiguration])

  useEffect(() => {
    // Filter out core channels that have already been added to the project
    if (channels) {
      const channelsNotInProject = coreChannels?.filter(coreChannel =>
        channels?.find(channel => channel.branchOf === coreChannel.name) ? false : true
      )
      setAvailableChannels(channelsNotInProject)
    }
  }, [channels])

  const handleTabChange = (event, newValue) => {
    setValue(newValue);
    router.push(`${pathname}?tab=${TABS[newValue]}`);
  };

  const handleClickDeleteIcon = (channelId) => {
    setChannelToDelete(channelId)
    setShowDeleteChannelModal(true)
  }

  const handleMergeProject = async () => {
    console.log('MERGE PROJECT')
    await mergeDeveloperProject(
      appConfiguration?.environments?.[instance]?.environment,
      appConfiguration?.environments?.[instance]?.xAuthToken,
      projectId,
      true,
    )
    await getDeveloperProject(
      appConfiguration?.environments?.[instance]?.environment,
      appConfiguration?.environments?.[instance]?.xAuthToken,
      projectId,
      true,
    )
      .then(response => {
        console.log('projectData', response.data)
        setProjectData(response.data)
      })
      .catch(err => console.log(err))
    await handleShowSnackbar('success', 'Project Merged')
  }

  const handleRebaseProject = async () => {
    console.log('REBASE PROJECT')
    await rebaseDeveloperProject(
      appConfiguration?.environments?.[instance]?.environment,
      appConfiguration?.environments?.[instance]?.xAuthToken,
      projectId
    )
    await getDeveloperProject(
      appConfiguration?.environments?.[instance]?.environment,
      appConfiguration?.environments?.[instance]?.xAuthToken,
      projectId,
      true,
    )
      .then(response => {
        console.log('projectData', response.data)
        setProjectData(response.data)
      })
      .catch(err => console.log(err))
    await handleShowSnackbar('success', 'Project Rebased')
  }

  const handleReopenProject = async () => {
    console.log('REOPEN PROJECT')
    await reopenDeveloperProject(
      appConfiguration?.environments?.[instance]?.environment,
      appConfiguration?.environments?.[instance]?.xAuthToken,
      projectId,
      true,
    )
    await getDeveloperProject(
      appConfiguration?.environments?.[instance]?.environment,
      appConfiguration?.environments?.[instance]?.xAuthToken,
      projectId,
      true,
    )
      .then(response => {
        console.log('projectData', response.data)
        setProjectData(response.data)
      })
      .catch(err => console.log(err))
    await handleShowSnackbar('success', 'Project Reopened')
  }

  const handleCopyProject = async () => {
    setLoading({ loading: true, message: 'Copying Project...' })
    await copyEntireProject(appConfiguration, projectData, targetProjectId)
    // const {success, error} = await copyEntireProject(projectData, appConfiguration)
    // console.log('success', success)
    // console.log('error', error)

    // Get Target Projects
    await getAllProjects(appConfiguration?.environments?.target?.environment, appConfiguration?.environments?.target?.xAuthToken)
      .then(response => setTargetProjects(response.data))
      .catch(err => console.log(err))

    setShowModal(false)
    setLoading({ loading: false, message: '' })
  }

  const handleTargetProjectChange = (event) => {
    event.preventDefault()
    setTargetProjectId(event.target.value)
  }

  const handleShowCopyProjectModal = async () => {
    await getAllProjects(appConfiguration?.environments?.target?.environment, appConfiguration?.environments?.target?.xAuthToken)
      .then(response => {
        const projects = response.data?.filter(project => project.state.status === 'IN_PROGRESS')
        console.log('projects', projects)
        setTargetProjects(projects)
      })
      .catch(err => console.log(err))

    setShowModal(true)
  }

  return (
    <>
      <PageTitleWrapper>
        <Grid
          container
          alignContent='center'
          justifyContent='space-between'
        >
          <Grid item display='flex'>
            <Grid item>
              <PageTitle
                heading={projectData?.name}
                subHeading={`Project ID: ${projectId}`}
              />
            </Grid>
            <Grid item sx={{ marginLeft: '1rem', paddingTop: '0.5rem'}}>
              <StatusIndicator
                size='medium'
                message={projectData?.state?.message}
                status={projectData?.state?.status}
              />
            </Grid>
          </Grid>
          <Grid item>
            <ButtonGroup sx={{ mx: 2 }}>
              <Button
                color='primary'
                variant='contained'
                onClick={handleShowCopyProjectModal}
              >Copy Project</Button>
            </ButtonGroup>
            <ButtonGroup>
              {/* IN PROGRESS */}
              { projectData?.state?.status === 'IN_PROGRESS' &&
                projectData?.state?.availableActions?.includes('REBASE_PROJECT') &&
                <Button
                  sx={{ margin: 1, marginRight: 0, marginLeft: 0 }}
                  color='primary'
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
                    color='primary'
                    onClick={() => handleReopenProject()}
                  >
                    Re-Open
                  </Button>
                </>
              }

              { projectData?.state?.status !== 'MERGED' &&
                <Button
                  sx={{ margin: 1, marginRight: 0, marginLeft: 0 }}
                  color='primary'
                  onClick={() => handleMergeProject()}
                >
                  Merge
                </Button>
              }
              <Button
                disabled={!(projectData?.state?.status === 'IN_PROGRESS' || projectData?.state?.status === 'MERGED')}
                sx={{ margin: 1, marginRight: 0, marginLeft: 0 }}
                color='error'
                onClick={() => setShowDeleteProjectModal(true)}
              >
                Delete Project
              </Button>
            </ButtonGroup>
          </Grid>
        </Grid>
      </PageTitleWrapper>

      <Container maxWidth='xl'>
        <Breadcrumbs aria-label='breadcrumb' sx={{ marginBottom: '1.5rem'}}>
          <Link
            color='inherit'
            href='/projects'
            underline='hover'
          >
            Projects
          </Link>
          <Typography color='text.primary'>{projectData?.name}</Typography>
        </Breadcrumbs>

        <Grid
          container
          direction='row'
          justifyContent='center'
          alignItems='stretch'
          alignContent='stretch'
          sx={{
            '& .MuiCircularProgress-root': {
              margin: '24px'
            }
          }}
        >
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ fontWeight: 'bold' }}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleTabChange}>
                      <Tab label='Channels' />
                      <Tab label='Documents' />
                      <Tab label='Pages' />
                      <Tab label='Resource Bundles' />
                      {/* { projectData?.includeContentTypes && <Tab label='Content Types' /> } */}
                    </Tabs>
                  </Box>

                  {/* Channels Tab */}
                  <TabPanel value={value} index={0}>
                    { projectData && <ChannelsTab
                      projectData={projectData}
                      availableChannels={availableChannels}
                      setShowAddChannelModal={setShowAddChannelModal}
                      handleClickDeleteIcon={handleClickDeleteIcon}
                    />}
                  </TabPanel>

                  {/* Documents Tab */}
                  <TabPanel value={value} index={1}>
                    { projectData?.items?.documents?.length
                      ? <DocumentsTab projectData={projectData} />
                      : <Box sx={{px:1}}>
                          <Alert severity='info' color='primary'>No Documents in this Project.</Alert>
                        </Box>
                    }
                  </TabPanel>

                  {/* Pages Tab */}
                  <TabPanel value={value} index={2}>
                    { projectData?.items?.pages?.length
                      ? <PagesTab projectData={projectData} />
                      : <Box sx={{px:1}}>
                          <Alert severity='info' color='primary'>No Pages in this Project.</Alert>
                        </Box>
                    }
                  </TabPanel>

                  {/* Resource Bundles Tab */}
                  <TabPanel value={value} index={3}>
                    { projectData?.items?.resourceBundles?.length
                      ? <ResourceBundlesTab projectData={projectData} />
                      : <Box sx={{px:1}}>
                          <Alert severity='info' color='primary'>No Resource Bundles in this Project.</Alert>
                        </Box>
                    }
                  </TabPanel>

                  {/* Content Types Tab */}
                  {/* <TabPanel value={value} index={4}>
                    { projectData?.items?.contentTypes?.length
                      ? <ContentTypesTab projectData={projectData} />
                      : <Box sx={{px:1}}>
                          <Alert severity="info" color='primary'>No Content Types in this Project.</Alert>
                        </Box>
                    }
                  </TabPanel> */}
                </CardContent>
              </Card>
            </Grid>
        </Grid>
      </Container>

      <AddChannelModal
        showModal={showAddChannelModal}
        setShowModal={setShowAddChannelModal}
        channels={channels}
        setChannels={setChannels}
        coreChannels={coreChannels}
        instance={instance}
        projectId={projectId}
        setProjectData={setProjectData}
      />

      <DeleteChannelModal
        showModal={showDeleteChannelModal}
        setShowModal={setShowDeleteChannelModal}
        channels={channels}
        setChannels={setChannels}
        channelToDelete={channelToDelete}
        instance={instance}
        projectId={projectId}
        setProjectData={setProjectData}
      />

      <DeleteProjectModal
        showModal={showDeleteProjectModal}
        setShowModal={setShowDeleteProjectModal}
        projectData={projectData}
        instance={instance}
      />

      {/* Copy Project Modal */}
      <Modal
        showModal={showModal}
        setShowModal={setShowModal}
        onConfirm={handleCopyProject}
        onCancel={() => setShowModal(false)}
        modalWidth='lg'
        title={`Copy Project to ${appConfiguration?.environments?.target?.environment}`}
      >
        <Typography variant='h4' sx={{ mb: 2 }}>Target Project</Typography>
        <FormControl
          required
          variant='outlined'
          sx={{ m: 0, width: '100%', mb: 3 }}
        >
          <InputLabel id='targetProjectId'>Target Project</InputLabel>
          <Select
            id='targetProjectId'
            labelId='Target Project'
            label='Target Project'
            value={targetProjectId}
            onChange={handleTargetProjectChange}
          >
            <MenuItem value={'new'}>Create New Project</MenuItem>
            <Divider />
            {targetProjects?.map((project) => (
              <MenuItem key={project.id} value={project.id}>{project.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Divider sx={{ mb: 2 }} />

        {/* Channels */}
        {projectData?.items?.channels?.length > 0 &&
          <>
            <Grid container sx={{ mb: 2 }}>
              <Grid item xs={12} md={3}>
                <Typography variant='h4'>Channels</Typography>
              </Grid>
              <Grid item xs={12} md={9}>
                <List dense sx={{ p: 0 }}>
                  {projectData?.items?.channels?.map((channel) => (
                    <ListItem key={channel.id} dense disableGutters sx={{ m: 0, pt: 0, pb: 1 }}>
                      <ListItemIcon sx={{ minWidth: '36px' }}>
                        <LanguageIcon />
                      </ListItemIcon>
                      <ListItemText primary={channel.displayName} secondary={channel.id} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
            <Divider sx={{ mb: 2 }} />
          </>
        }

        {/* Resource Bundles */}
        {projectData?.items?.resourceBundles?.length > 0 &&
          <>
            <Grid container sx={{ mb: 2 }}>
              <Grid item xs={12} md={3}>
                <Typography variant='h4'>Resource Bundles</Typography>
              </Grid>
              <Grid item xs={12} md={9}>
                <List dense sx={{ p: 0 }}>
                  {projectData?.items?.resourceBundles?.map((bundle) => (
                    <ListItem key={bundle.path} dense disableGutters sx={{ m: 0, pt: 0, pb: 1 }}>
                      <ListItemIcon sx={{ minWidth: '36px' }}>
                        <ResourceBundleIcon />
                      </ListItemIcon>
                      <ListItemText primary={bundle.displayName} secondary={bundle.path} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
            <Divider sx={{ mb: 2 }} />
          </>
        }

        {/* Documents */}
        {projectData?.items?.documents?.length > 0 &&
          <>
            <Grid container sx={{ mb: 2 }}>
              <Grid item xs={12} md={3}>
                <Typography variant='h4'>Documents</Typography>
              </Grid>
              <Grid item xs={12} md={9}>
                <List dense sx={{ p: 0 }}>
                  {projectData?.items?.documents?.map((document) => (
                    <ListItem key={document.path} dense disableGutters sx={{ m: 0, pt: 0, pb: 1 }}>
                      <ListItemIcon sx={{ minWidth: '36px' }}>
                        <DocumentIcon />
                      </ListItemIcon>
                      <ListItemText primary={document.displayName} secondary={document.path} />
                    </ListItem>
                  ))}
                </List>
              </Grid>
            </Grid>
            <Divider sx={{ mb: 2 }} />
          </>
        }

        {/* Pages */}
        {projectData?.items?.pages?.length > 0 &&
          <Grid container sx={{ mb: 2 }}>
            <Grid item xs={12} md={3}>
              <Typography variant='h4'>Pages</Typography>
            </Grid>
            <Grid item xs={12} md={9}>
              <List dense sx={{ p: 0 }}>
                {projectData?.items?.pages?.map((page) => (
                  <ListItem key={page.path} dense disableGutters sx={{ m: 0, pt: 0, pb: 1 }}>
                    <ListItemIcon sx={{ minWidth: '36px' }}>
                      <WebIcon />
                    </ListItemIcon>
                    <ListItemText primary={page.displayName} secondary={page.path} />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        }

      </Modal>
    </>
  )
}
