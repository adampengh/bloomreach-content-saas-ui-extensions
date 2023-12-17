import React, { useContext, useEffect, useState } from 'react'
import Head from 'next/head'
import { CopyBlock } from 'react-code-blocks'
import bloomreachTheme from 'src/theme/code-block/bloomreachTheme'
import NextLink from 'next/link';

// APIs
import {
  getAllCoreChannels,
  getAllChannels,
  getDeveloperProject,
  mergeProject,
  rebaseProject,
  reopenProject,
} from 'bloomreach-content-management-apis';

// Layouts
import SidebarLayout from 'src/layouts/SidebarLayout';

// Components
import AddChannelModal from 'components/projects/AddChannelModal';
import DeleteChannelModal from 'components/projects/DeleteChannelModal';
import DeleteProjectModal from 'components/projects/DeleteProjectModal';
import ChannelIcon from 'components/ChannelIcon'
import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import StatusIndicator from 'components/StatusIndicator';
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

function ContentTypes({params}) {
  // State
  const [isLoaded, setIsLoaded] = useState(false)
  const [showAddChannelModal, setShowAddChannelModal] = useState(false)
  const [showDeleteChannelModal, setShowDeleteChannelModal] = useState(false)
  const [channelToDelete, setChannelToDelete] = useState(null)
  const [showDeleteProjectModal, setShowDeleteProjectModal] = useState(false)

  const [instance, id] = params
  const [tab, setTab] = useState(0);

  const [channels, setChannels] = useState([])
  const [coreChannels, setCoreChannels] = useState([])
  const [availableChannels, setAvailableChannels] = useState([])
  const [projectData, setProjectData] = useState([])

  // Context
  const { handleShowSnackbar } = useContext(ErrorContext)

  const {
    appConfiguration
  } = useContext(ConfigurationContext)

  useEffect(() => {
    getDeveloperProject(appConfiguration?.environments?.[instance]?.environment, appConfiguration?.environments?.[instance]?.xAuthToken, id)
      .then(response => {
        console.log('projectData', response.data)
        setProjectData(response.data)
      })
      .catch(err => console.log(err))

    getAllCoreChannels(appConfiguration?.environments?.[instance]?.environment)
      .then(response => setCoreChannels(response.data))
      .catch(err => console.log(err))

    getAllChannels(appConfiguration?.environments?.[instance]?.environment, appConfiguration?.environments?.[instance]?.xAuthToken)
      .then(response => setChannels(response?.data?.filter(project => project.branch === id)))
      .catch(err => console.log(err))

    setIsLoaded(true)
  }, [instance, id, appConfiguration])

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
    await mergeProject(appConfiguration?.environments?.[instance]?.environment, appConfiguration?.environments?.[instance]?.xAuthToken, id)
    await getDeveloperProject(appConfiguration?.environments?.[instance]?.environment, appConfiguration?.environments?.[instance]?.xAuthToken, id)
      .then(response => {
        console.log('projectData', response.data)
        setProjectData(response.data)
      })
      .catch(err => console.log(err))
    await handleShowSnackbar('success', 'Project Merged')
  }

  const handleRebaseProject = async () => {
    console.log('REBASE PROJECT')
    await rebaseProject(appConfiguration?.environments?.[instance]?.environment, appConfiguration?.environments?.[instance]?.xAuthToken, id)
    await getDeveloperProject(appConfiguration?.environments?.[instance]?.environment, appConfiguration?.environments?.[instance]?.xAuthToken, id)
      .then(response => {
        console.log('projectData', response.data)
        setProjectData(response.data)
      })
      .catch(err => console.log(err))
    await handleShowSnackbar('success', 'Project Rebased')
  }

  const handleReopenProject = async () => {
    console.log('REOPEN PROJECT')
    await reopenProject(appConfiguration?.environments?.[instance]?.environment, appConfiguration?.environments?.[instance]?.xAuthToken, id)
    await getDeveloperProject(appConfiguration?.environments?.[instance]?.environment, appConfiguration?.environments?.[instance]?.xAuthToken, id)
      .then(response => {
        console.log('projectData', response.data)
        setProjectData(response.data)
      })
      .catch(err => console.log(err))
    await handleShowSnackbar('success', 'Project Reopened')
  }

  return <>
    <Head>
      <title>Project: {projectData?.name}</title>
    </Head>
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
              subHeading={`Project ID: ${id}`}
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
        ?
          <Grid
            item
            xs={12}
            justifyContent="center"
            alignItems="stretch"
            alignContent="stretch"
          >
            <Card>
              <CircularProgress />
            </Card>
          </Grid>
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
                <TabPanel tab={tab} index={0}>
                  <Button
                    disabled={!availableChannels.length > 0}
                    sx={{ margin: 1 }}
                    variant="outlined"
                    onClick={() => setShowAddChannelModal(true)}
                  >
                    Add Channels
                  </Button>
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
                </TabPanel>
                <TabPanel tab={tab} index={1}>
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
      projectId={id}
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
  </>;
}

function TabPanel(props) {
  const { children, tab, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={tab !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {tab === index && (
        <Box sx={{ p: 1 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

ContentTypes.getInitialProps = async (ctx) => {
  const { params } = ctx.query
  return { params: params }
}

ContentTypes.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default ContentTypes;
