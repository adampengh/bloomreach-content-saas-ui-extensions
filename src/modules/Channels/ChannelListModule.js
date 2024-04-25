'use client'

import React, { useContext, useEffect, useState } from 'react'
import NextLink from 'next/link'

// APIs
import { getAllChannels } from 'bloomreach-content-management-apis'

// Components
import { ChannelIcon } from 'src/components'
import {
  Alert,
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
import { ConfigurationContext, LoadingContext } from 'src/contexts'


export const ChannelListModule = () => {
  // Context
  const { appConfiguration } = useContext(ConfigurationContext)
  const { environment, xAuthToken, projectId } = appConfiguration.environments?.source
  const { setLoading } = useContext(LoadingContext)

  // State
  const [channels, setChannels] = useState([])
  const [projects, setProjects] = useState([])

  useEffect(() => {
    console.log('projectId', projectId)
    if (environment && xAuthToken) {
      setLoading({ loading: true, message: 'Loading Channels' })
      getAllChannels(environment, xAuthToken)
        .then((response) => {
          let data = response.data;
          console.log('Channels', data)
          if (projectId) {
            data = response.data.filter(channel => channel.branch === projectId)
          }
          setProjects(Array.from(new Set(data.map(channel => channel.projectName))))
          setChannels(data)
          setLoading({ loading: false, message: '' })
        })
        .catch((error) => {
          console.error('Error fetching channels', error)
          setLoading({ loading: false, message: '' })
        })
    }
  }, [appConfiguration])

  return (
    <Container maxWidth='xl'>
      <Grid
        container
        direction='row'
        justifyContent='center'
        alignItems='stretch'
        alignContent='stretch'
        sx={{
          '& .MuiGrid-item': {
            textAlign: 'center'
          }
        }}
      >
        {projectId === 'core' &&
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Alert severity='warning'>
                  <NextLink href={'/configuration'} passHref legacyBehavior>Please Select a Developer Project</NextLink>
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        }

        {projects.map((project) => (
          <Grid item xs={12} key={project}>
            <Card>
              <CardHeader title={project} sx={{ textAlign: 'left' }} />
              <Divider />
              <CardContent>
                <List>
                  { channels
                    .filter(channel => channel.projectName === project)
                    .map((channel) => (
                      <ListItem key={channel.id} component='div'>
                        <NextLink href={`/channels/${channel.id}`} passHref legacyBehavior>
                          <ListItemButton>
                            <ListItemAvatar>
                              <ChannelIcon icon={channel.icon} />
                            </ListItemAvatar>
                            <ListItemText primary={channel.name} secondary={channel.id} />
                          </ListItemButton>
                        </NextLink>
                      </ListItem>
                    ))
                  }
                </List>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  )
}

