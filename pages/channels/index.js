import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import NextLink from 'next/link';

// Layouts
import SidebarLayout from 'src/layouts/SidebarLayout';

// Components
import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import {
  Card,
  CardContent,
  CardHeader,
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


function Channels() {
  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [channels, setChannels] = useState([])
  const [projects, setProjects] = useState([])

  const {
    appConfiguration
  } = useContext(ConfigurationContext)

  const {
    environment,
    xAuthToken,
    projectId,
  } = appConfiguration

  useEffect(() => {
    if (environment && xAuthToken) {
      axios(`https://${environment}.bloomreach.io/management/site/v1/channels`, {
        headers: {
          'x-auth-token': xAuthToken
        }
      })
        .then((response) => {
          let data = response.data;
          if (projectId) {
            data = response.data.filter(channel => channel.branch === projectId)
          }
          setProjects(Array.from(new Set(data.map(channel => channel.projectName))))
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


  return (
    <>
      <PageTitleWrapper>
        <PageTitle
          heading="Channels"
        />
      </PageTitleWrapper>
      <Container maxWidth="xl">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={4}
          rowSpacing={4}
        >
          {projects.map((project) => (
            <Grid item xs={12} key={project}>
              <Card>
                <CardHeader title={project} />
                <Divider />
                <CardContent>
                  <List>
                    { channels
                      .filter(channel => channel.projectName === project)
                      .map((channel) => {
                        return (
                          <ListItem key={channel.id} component="div">
                            <NextLink href="/" passHref>
                              <ListItemButton>
                                <ListItemAvatar>
                                  <ChannelIcon icon={channel.icon} />
                                </ListItemAvatar>
                                <ListItemText primary={channel.name} secondary={channel.id} />
                              </ListItemButton>
                            </NextLink>
                          </ListItem>
                        )
                    })}
                  </List>
                </CardContent>
              </Card>
            </Grid>
            ))}
        </Grid>
      </Container>
    </>
  );
}

Channels.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Channels;
