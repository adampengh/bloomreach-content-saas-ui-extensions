import React, { useContext, useEffect, useState } from 'react'
import Head from 'next/head';
import NextLink from 'next/link';

// APIs
import { getAllProjects } from 'api';

// Layouts
import SidebarLayout from 'src/layouts/SidebarLayout';

// Components
import CreateProjectModal from 'components/projects/CreateProjectModal';
import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import StatusIndicator from 'components/StatusIndicator';
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemButton,
  Tooltip,
  Typography,
} from '@mui/material';

// Contexts
import { ConfigurationContext } from 'src/contexts/ConfigurationContext';

// Icons
import AddIcon from '@mui/icons-material/Add';
import DifferenceIcon from '@mui/icons-material/Difference';
import LanguageIcon from '@mui/icons-material/Language';


function Projects() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [sourceProjects, setSourceProjects] = useState([])
  const [targetProjects, setTargetProjects] = useState([])

  const [showModal, setShowModal] = useState(false)
  const [showCreateSourceProjectModal, setShowCreateSourceProjectModal] = useState(false)
  const [showCreateTargetProjectModal, setShowCreateTargetProjectModal] = useState(false)

  const {
    appConfiguration
  } = useContext(ConfigurationContext)

  const {
    environment,
    xAuthToken,
  } = appConfiguration.environments?.source

  const timestamp = (project) => new Date(project.system.createdAt).valueOf()
  const sortFunction = (projectA, projectB) => timestamp(projectB) - timestamp(projectA)

  useEffect(() => {
    if (environment && xAuthToken) {
      // Get source projects
      getAllProjects(environment, xAuthToken)
        .then((response) => {
          let projects = response.data
          console.log('projects', projects)
          projects.sort(sortFunction)
          setSourceProjects(projects)
          setIsLoaded(true)
        })
        .catch((error) => {
          setIsLoaded(true)
        })
    }

    if (appConfiguration?.environments?.target?.environment && appConfiguration?.environments?.target?.xAuthToken) {
      // Get target projects
      getAllProjects(appConfiguration?.environments?.target?.environment, appConfiguration?.environments?.target?.xAuthToken)
        .then((response) => {
          let projects = response.data
          projects.sort(sortFunction)
          setTargetProjects(projects)
          setIsLoaded(true)
        })
        .catch((error) => {
          setIsLoaded(true)
        })
    }
  }, [appConfiguration])

  const handleShowModal = (environment) => {
    if (environment === 'source') {
      setShowCreateSourceProjectModal(true)
    }
    if (environment === 'target') {
      setShowCreateTargetProjectModal(true)
    }
    setShowModal(true)
  }

  return (
    <>
      <Head>
        <title>Projects</title>
      </Head>
      <PageTitleWrapper>
        <PageTitle
          heading="Projects"
        />
      </PageTitleWrapper>
      <Container maxWidth="xl">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          alignContent="stretch"
          spacing={3}
          sx={{
            '& .MuiCircularProgress-root': {
              margin: '24px'
            }
          }}
        >
        { !isLoaded
          ? <Grid
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
          : <>
              <ProjectsList
                appConfiguration={appConfiguration?.environments?.source}
                projects={sourceProjects}
                header='Source Projects'
                handleShowModal={handleShowModal}
                environment='source'
              />
              <ProjectsList
                appConfiguration={appConfiguration?.environments?.target}
                projects={targetProjects}
                header='Target Projects'
                handleShowModal={handleShowModal}
                environment='target'
              />
            </>
          }
        </Grid>
      </Container>

      { showCreateSourceProjectModal &&
        <CreateProjectModal
          showModal={showModal}
          setShowModal={setShowModal}
          projects={sourceProjects}
          setProjects={setSourceProjects}
          environment={appConfiguration?.environments?.source?.environment}
          xAuthToken={appConfiguration?.environments?.source?.xAuthToken}
        />
      }
      { showCreateTargetProjectModal &&
        <CreateProjectModal
          showModal={showModal}
          setShowModal={setShowModal}
          projects={targetProjects}
          setProjects={setTargetProjects}
          environment={appConfiguration?.environments?.target?.environment}
          xAuthToken={appConfiguration?.environments?.target?.xAuthToken}
        />
      }
    </>
  );
}

const ProjectsList = ({
  appConfiguration,
  projects,
  header,
  handleShowModal,
  environment,
}) => {
  return (
    <Grid item xs={6} >
      <Card>
        <CardHeader
          title={
            <Grid
              container
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              alignContent="center">
                <Grid item xs={6} display="flex" alignContent="center" alignItems="center">
                  <Typography variant="h4" component="span">{header}</Typography>
                  { appConfiguration?.environment &&
                    <Chip label={appConfiguration.environment} size="small" sx={{ marginLeft: '0.5rem' }} />
                  }
                </Grid>
                <Grid item xs={6} textAlign="right">
                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => handleShowModal(environment)}
                  >New Project</Button>
                </Grid>
            </Grid>
          }
        />
        <Divider />
        <CardContent>
          <List>
            { projects.map((project) => (
              <ListItem key={project.id} component="div">
                <NextLink href={`/projects/${environment}/${project.id}`} passHref>
                  <ListItemButton>
                    <ListItemAvatar>
                      {project.includeContentTypes
                        ?
                          <>
                            <LanguageIcon />
                            <Tooltip title="Includes Content Types">
                              <DifferenceIcon />
                            </Tooltip>
                          </>
                        : <LanguageIcon />
                      }
                    </ListItemAvatar>
                    <ListItemText primary={`${project.name} (${project.id})`} secondary={project.description} />
                    <StatusIndicator status={project.state.status} message={project.state.message} />
                  </ListItemButton>
                </NextLink>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>
    </Grid>
  )
}

Projects.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Projects;
