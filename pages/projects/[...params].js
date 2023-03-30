import React, { useContext, useEffect, useState } from 'react'
import { CopyBlock } from 'react-code-blocks'
import bloomreachTheme from 'src/theme/code-block/bloomreachTheme'
import NextLink from 'next/link';

// APIs
import {
  getAllCoreChannels,
  getAllChannels,
  getDeveloperProject,
} from 'api';

// Layouts
import SidebarLayout from 'src/layouts/SidebarLayout';

// Components
import AddChannelModal from 'components/projects/AddChannelModal';
import DeleteChannelModal from 'components/projects/DeleteChannelModal';
import ChannelIcon from 'components/ChannelIcon'
import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import StatusIndicator from 'components/StatusIndicator';
import {
  Breadcrumbs,
  Box,
  Button,
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

// Icons
import DeleteIcon from '@mui/icons-material/Delete';

function ContentTypes({params}) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [showAddChannelModal, setShowAddChannelModal] = useState(false)
  const [showDeleteChannelModal, setShowDeleteChannelModal] = useState(false)
  const [channelToDelete, setChannelToDelete] = useState(null)

  const [instance, id] = params
  const [tab, setTab] = useState(0);

  const [channels, setChannels] = useState([])
  const [coreChannels, setCoreChannels] = useState([])
  const [projectData, setProjectData] = useState([])

  const {
    appConfiguration
  } = useContext(ConfigurationContext)

  useEffect(async () => {
    if (instance === 'source' && appConfiguration?.environments?.source?.environment && appConfiguration?.environments?.source?.xAuthToken) {
      await getDeveloperProject(appConfiguration?.environments?.source?.environment, appConfiguration?.environments?.source?.xAuthToken, id)
        .then(response => setProjectData(response.data))
        .catch(err => console.log(err))

      await getAllCoreChannels(appConfiguration?.environments?.source?.environment)
        .then(response => setCoreChannels(response.data))
        .catch(err => console.log(err))

      await getAllChannels(appConfiguration?.environments?.source?.environment, appConfiguration?.environments?.source?.xAuthToken)
        .then(response => setChannels(response?.data?.filter(project => project.branch === id)))
        .catch(err => console.log(err))
    }

    if (instance === 'target' && appConfiguration?.environments?.target?.environment && appConfiguration?.environments?.target?.xAuthToken) {
      await getDeveloperProject(appConfiguration.environments?.target.environment, appConfiguration.environments?.target.xAuthToken, id)
        .then(response => setProjectData(response.data))
        .catch(err => console.log(err))

      await getAllCoreChannels(appConfiguration?.environments?.target?.environment)
        .then(response => setCoreChannels(response.data))
        .catch(err => console.log(err))

      await getAllChannels(appConfiguration?.environments?.target?.environment, appConfiguration?.environments?.target?.xAuthToken)
        .then(response => setChannels(response?.data?.filter(project => project.branch === id)))
        .catch(err => console.log(err))
    }

    setIsLoaded(true)
  }, [instance, id, appConfiguration])

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleClickDeleteIcon = (channelId) => {
    setChannelToDelete(channelId)
    setShowDeleteChannelModal(true)
  }

  return (
    <>
      <PageTitleWrapper>
        <Grid
          container
          alignContent='center'
        >
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
                          <NextLink href={`/channels/${channel.id}`} passHref>
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
    </>
  );
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
