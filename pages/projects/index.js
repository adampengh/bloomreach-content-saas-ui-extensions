import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import NextLink from 'next/link';

// APIs
import { getAllProjects } from 'api';

// Layouts
import SidebarLayout from 'src/layouts/SidebarLayout';

// Components
import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import CreateProjectModal from 'src/components/CreateProjectModal';
import StatusIndicator from './StatusIndicator';
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
  Typography,
} from '@mui/material';

// Contexts
import { ConfigurationContext } from 'src/contexts/ConfigurationContext';

// Icons
import AddIcon from '@mui/icons-material/Add';
import LanguageIcon from '@mui/icons-material/Language';


const ChannelIcon = ({ icon }) => {
  const style = {
    backgroundImage: `url(${icon})`,
    backgroundSize: '36px',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
    width: '36px',
    height: '36px',
  }
  return <div style={style} />;
}


function Projects() {
  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  // const [channels, setChannels] = useState([])
  const [sourceProjects, setSourceProjects] = useState([])
  const [targetProjects, setTargetProjects] = useState([])

  const {
    appConfiguration
  } = useContext(ConfigurationContext)

  const {
    environment,
    xAuthToken,
    projectId,
  } = appConfiguration.source

  useEffect(() => {
    if (environment && xAuthToken) {
      getAllProjects(environment, xAuthToken)
        .then((response) => {
          let projects = response.data
          projects.sort((projectA, projectB) => {
            const timestamp = (project) => new Date(project.system.createdAt).valueOf()
            return timestamp(projectB) - timestamp(projectA)
          })
          setSourceProjects(projects)
          setIsLoaded(true)
          setError(null)
        })
        .catch((error) => {
          setError(error.message)
          setIsLoaded(true)
        })
    }

    if (appConfiguration?.target?.environment && appConfiguration?.target?.xAuthToken) {
      getAllProjects(appConfiguration?.target?.environment, appConfiguration?.target?.xAuthToken)
        .then((response) => {
          let projects = response.data
          projects.sort((projectA, projectB) => {
            const timestamp = (project) => new Date(project.system.createdAt).valueOf()
            return timestamp(projectB) - timestamp(projectA)
          })
          setTargetProjects(projects)
          setIsLoaded(true)
          setError(null)
        })
        .catch((error) => {
          setError(error.message)
          setIsLoaded(true)
        })
    }
  }, [appConfiguration])

  return (
    <>
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
                            <Typography variant="h4" component="span" >Source Projects</Typography>
                            <Chip label={appConfiguration.source.environment} size="small" sx={{ marginLeft: '0.5rem' }} />
                          </Grid>
                          <Grid item xs={6} textAlign="right">
                            <Button
                              variant="outlined"
                              startIcon={<AddIcon />}
                            >New Project</Button>
                          </Grid>
                      </Grid>
                    }
                  />
                  <Divider />
                  <CardContent>
                    <List>
                      { sourceProjects.map((project) => (
                        <ListItem key={project.id} component="div">
                          {/* <NextLink href={`/projects/${project.id}`} passHref> */}
                            <ListItemButton>
                              <ListItemAvatar>
                                <LanguageIcon />
                              </ListItemAvatar>
                              <ListItemText primary={`${project.name} (${project.id})`} secondary={project.description} />
                              <StatusIndicator status={project.state.status} message={project.state.message} />
                            </ListItemButton>
                          {/* </NextLink> */}
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>


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
                            <Typography variant="h4" component="span" >Target Projects</Typography>
                            { appConfiguration?.target?.environment &&
                              <Chip label={appConfiguration.target.environment} size="small" sx={{ marginLeft: '0.5rem' }} />
                            }
                          </Grid>
                          <Grid item xs={6} textAlign="right">
                            <Button
                              variant="outlined"
                              startIcon={<AddIcon />}
                            >New Project</Button>
                          </Grid>
                      </Grid>
                    }
                  />
                  <Divider />
                  <CardContent>
                    <List>
                      { targetProjects.map((project) => (
                        <ListItem key={project.id} component="div">
                          {/* <NextLink href={`/projects/${project.id}`} passHref> */}
                            <ListItemButton>
                              <ListItemAvatar>
                                <LanguageIcon />
                              </ListItemAvatar>
                              <ListItemText primary={`${project.name} (${project.id})`} secondary={project.description} />
                              <StatusIndicator status={project.state.status} message={project.state.message} />
                            </ListItemButton>
                          {/* </NextLink> */}
                        </ListItem>
                      ))}
                    </List>
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

Projects.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Projects;
