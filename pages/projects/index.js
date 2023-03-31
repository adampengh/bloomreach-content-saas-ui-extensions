import React, { useContext, useEffect, useState } from 'react'
import Head from 'next/head';
import NextLink from 'next/link';

// APIs
import { getAllProjects } from 'api';

// Layouts
import SidebarLayout from 'src/layouts/SidebarLayout';

// Components
import CreateProjectModal from 'components/CreateProjectModal';
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

  const {
    appConfiguration
  } = useContext(ConfigurationContext)

  const {
    environment,
    xAuthToken,
  } = appConfiguration.environments?.source

  useEffect(() => {
    if (environment && xAuthToken) {
      // Get source projects
      getAllProjects(environment, xAuthToken)
        .then((response) => {
          let projects = response.data
          console.log('projects', projects)
          projects.sort((projectA, projectB) => {
            const timestamp = (project) => new Date(project.system.createdAt).valueOf()
            return timestamp(projectB) - timestamp(projectA)
          })
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
          projects.sort((projectA, projectB) => {
            const timestamp = (project) => new Date(project.system.createdAt).valueOf()
            return timestamp(projectB) - timestamp(projectA)
          })
          setTargetProjects(projects)
          setIsLoaded(true)
        })
        .catch((error) => {
          setIsLoaded(true)
        })
    }
  }, [appConfiguration])

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
                            <Chip label={appConfiguration.environments?.source?.environment} size="small" sx={{ marginLeft: '0.5rem' }} />
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
                          <NextLink href={`/projects/source/${project.id}`} passHref>
                            <ListItemButton>
                              <ListItemAvatar>
                               {project.includeContentTypes
                                ? <>
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
                            { appConfiguration?.environments?.target?.environment &&
                              <Chip label={appConfiguration.environments.target.environment} size="small" sx={{ marginLeft: '0.5rem' }} />
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
                          <NextLink href={`/projects/target/${project.id}`} passHref>
                            <ListItemButton>
                              <ListItemAvatar>
                                <LanguageIcon />
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
            </>
          }
        </Grid>
      </Container>
    </>
  );
}

Projects.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Projects;
