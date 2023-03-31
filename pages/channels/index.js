import React, { useContext, useEffect, useState } from 'react'
import Head from 'next/head';
import NextLink from 'next/link';

// APIs
import { getAllChannels } from 'api';

// Layouts
import SidebarLayout from 'src/layouts/SidebarLayout';

// Components
import ChannelIcon from 'components/ChannelIcon'
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

function Channels() {
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
  } = appConfiguration.environments?.source

  useEffect(() => {
    if (environment && xAuthToken) {
      getAllChannels(environment, xAuthToken)
        .then((response) => {
          let data = response.data;
          if (projectId) {
            data = response.data.filter(channel => channel.branch === projectId)
          }
          setProjects(Array.from(new Set(data.map(channel => channel.projectName))))
          setChannels(data)
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
        <title>Channels</title>
      </Head>
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
          alignContent="stretch"
          sx={{
            '& .MuiGrid-item': {
              textAlign: 'center'
            },
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
            <>
              {projects.map((project) => (
                <Grid item xs={12} key={project}>
                  <Card>
                    <CardHeader title={project} sx={{ textAlign: 'left' }} />
                    <Divider />
                    <CardContent>
                      <List>
                        { channels
                          .filter(channel => channel.projectName === project)
                          .map((channel) => {
                            return (
                              <ListItem key={channel.id} component="div">
                                <NextLink href={`/channels/${channel.id}`} passHref>
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
            </>
          }
        </Grid>
      </Container>
    </>
  );
}

Channels.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Channels;
