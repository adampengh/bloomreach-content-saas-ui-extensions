'use client'

import React, { useContext, useEffect, useState } from 'react'
import NextLink from 'next/link'
import axios from 'axios'

// APIs
import { getAllWebhookConfigurations } from 'bloomreach-content-management-apis'

// Components
import {
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  Chip,
  Typography,
  Button,
  Divider,
  IconButton,
} from '@mui/material'

// Contexts
import { ConfigurationContext, ErrorContext, LoadingContext } from 'src/contexts'

// Icons
import {
  AddIcon,
  DeleteIcon,
  WebhookIcon,
} from 'src/icons'
import { CreateWebhookModal } from './modals/CreateWebhookModal'

export const WebhooksListingModule = () => {
  console.group('WebhooksModule')

  // Context
  const { appConfiguration } = useContext(ConfigurationContext)
  const { environment, xAuthToken } = appConfiguration.environments?.source
  const { handleShowSnackbar } = useContext(ErrorContext)
  const { setLoading } = useContext(LoadingContext)

  // State
  const [ webhooks, setWebhooks ] = useState([])

  useEffect(() => {
    if (environment && xAuthToken) {
      setLoading({ loading: true, message: 'Loading webhook configurations...'})
      // Get source projects
      getAllWebhookConfigurations(environment, xAuthToken)
        .then((response) => {
          let webhookConfigurations = response.data
          console.log('webhookConfigurations', webhookConfigurations)
          setWebhooks(webhookConfigurations)
          setLoading({ loading: false, message: '' })
        })
        .catch(() => {
          setLoading({ loading: false, message: '' })
        })
    }
  }, [appConfiguration])

  console.groupEnd()

  const handleDeleteWebhookConfiguration = async (webhookConfigurationId) => {
    console.log('Delete webhook configuration', webhookConfigurationId)
    setLoading({ loading: true, message: 'Deleting webhook configuration...'})
    await axios('/api/webhook', {
      method: 'DELETE',
      headers: { 'x-auth-token': xAuthToken },
      params: { environment, webhookConfigurationId }
    })
      .then(response => {
        console.log('response', response)
        getAllWebhookConfigurations(environment, xAuthToken)
          .then((response) => {
            let webhookConfigurations = response.data
            console.log('webhookConfigurations', webhookConfigurations)
            setWebhooks(webhookConfigurations)
            setLoading({ loading: false, message: '' })
            handleShowSnackbar('success', 'Webhook configuration deleted')
          })
          .catch(() => {
            setLoading({ loading: false, message: '' })
            handleShowSnackbar('error', 'Error deleting webhook configuration')
          })
      })
      .catch((error) => {
        console.error('error', error)
        setLoading({ loading: false, message: '' })
        handleShowSnackbar('error', 'Error deleting webhook configuration')
      })
  }

  return (
    <Container maxWidth='xl'>
      <Grid
        container
        direction='row'
        justifyContent='center'
        alignItems='stretch'
        alignContent='stretch'
        spacing={3}
      >
        <Grid item xs={12}>
          <Listing
            webhooks={webhooks}
            setWebhooks={setWebhooks}
            handleDeleteWebhookConfiguration={handleDeleteWebhookConfiguration}
          />
        </Grid>
      </Grid>
    </Container>
  )
}

const Listing = ({ webhooks, setWebhooks, handleDeleteWebhookConfiguration }) => {
  const [ showModal, setShowModal ] = useState(false)

  return (
    <>
      <Card>
        <CardHeader
          title={
            <Grid
              container
              direction='row'
              justifyContent='space-between'
              alignItems='center'
              alignContent='center'>
                <Grid item xs={6} display='flex' alignContent='center' alignItems='center'>
                  <Typography variant='h4' component='span'>All Webhooks</Typography>
                </Grid>
                <Grid item xs={6} textAlign='right'>
                  {/* TODO: Add New Webhook Configuration Modal */}
                  <Button
                    variant='outlined'
                    startIcon={<AddIcon />}
                    onClick={() => setShowModal(true)}
                  >New Webhook Configuration</Button>
                </Grid>
            </Grid>
          }
        />
        <Divider />
        <CardContent>
          <List>
            { webhooks.map((item) => (
              <ListItem
                key={item.id}
                // component='div'
                secondaryAction={
                  <IconButton edge='end' aria-label='delete' onClick={() => handleDeleteWebhookConfiguration(item.id)}>
                    <DeleteIcon />
                  </IconButton>
                }
              >
                <NextLink href={`/webhooks/${item.id}`} passHref legacyBehavior>
                  <ListItemButton sx={{ pr: '16px !important' }}>
                    <ListItemAvatar>
                      <WebhookIcon />
                    </ListItemAvatar>
                    <ListItemText primary={item.name} secondary={`Triggers: ${item.triggers.join(',')}`} />
                    <Chip
                      label={item.enabled ? 'Enabled': 'Disabled'}
                      color={item.enabled ? 'success': 'default'}
                      size='small'
                      sx={{ marginLeft: '0.5rem', fontWeight: 'bold' }}
                    />
                  </ListItemButton>
                </NextLink>
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      <CreateWebhookModal
        showModal={showModal}
        setShowModal={setShowModal}
        setWebhooks={setWebhooks}
      />
    </>
  );
}
