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
import {
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Container,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  ListItemButton,
} from '@mui/material';

// Contexts
import { ConfigurationContext } from 'src/contexts/ConfigurationContext';

// Icons
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
  const [projects, setProjects] = useState([])

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
          setProjects(response.data)
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
            <Grid item xs={12} >
              <Card>
                <CardHeader title='List of Projects' />
                <Divider />
                <CardContent>
                  <List>
                    { projects.map((project) => {
                      return (
                        <ListItem key={project.id} component="div">
                          <NextLink href={`/projects/${project.id}`} passHref>
                            <ListItemButton>
                              <ListItemAvatar>
                                <LanguageIcon />
                              </ListItemAvatar>
                              <ListItemText primary={project.name} secondary={project.id} />
                              <ListItemText primary={project.state.status} />
                            </ListItemButton>
                          </NextLink>
                        </ListItem>
                      )
                    })}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          }
        </Grid>
      </Container>
    </>
  );
}

Projects.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Projects;
