'use client'

import React, { useContext, useEffect, useState } from 'react'
import NextLink from 'next/link';

// APIs
import { getAllChannels } from 'bloomreach-content-management-apis';

// Components
import { ChannelIcon, Loader } from 'src/components'
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

const ChannelsComponent = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [channels, setChannels] = useState([])
  const [projects, setProjects] = useState([])

  const { appConfiguration } = useContext(ConfigurationContext)
  const { environment, xAuthToken, projectId } = appConfiguration.environments?.source

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
        ? <Loader open={!isLoaded} />
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
                              <NextLink href={`/channels/${channel.id}`} passHref legacyBehavior>
                                <ListItemButton>
                                  <ListItemAvatar>
                                    <ChannelIcon icon={channel.icon} />
                                  </ListItemAvatar>
                                  <ListItemText primary={channel.name} secondary={channel.id} />
                                </ListItemButton>
                              </NextLink>
                            </ListItem>
                          );
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
  )
}

export default ChannelsComponent;
