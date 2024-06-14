'use client'

import React, { useContext, useEffect } from 'react'
import NextLink from 'next/link';

// Components
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
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
import { LoadingContext } from 'src/contexts'

// Icons
import { AddIcon, LanguageIcon } from 'src/icons'


export const GridTemplateModule = () => {
  const { setLoading } = useContext(LoadingContext)

  useEffect(() => {
    setLoading({ loading: true, message: 'Loading...' })

    // For demonstration purposes, set loading to false after 2000ms
    setTimeout(() => setLoading({ loading: false, message: ''}), 2000)
  }, [])

  return (
    <Container maxWidth='xl'>
      <Grid
        container
        direction='row'
        justifyContent='center'
        alignItems='stretch'
        alignContent='stretch'
        spacing={3}
        sx={{
          '& .MuiCircularProgress-root': {
            margin: '24px'
          }
        }}
      >
        <Grid item xs={6}>
          <Listing />
        </Grid>
        <Grid item xs={6}>
          <Listing />
        </Grid>
      </Grid>
    </Container>
  )
}

const Listing = () => {
  const items = [
    {
      id: 'ferewer',
      name: 'Item Name'
    },
    {
      id: 'awerce',
      name: 'Item Name'
    },
  ]

  return (
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
                <Typography variant='h4' component='span' >List Title</Typography>
                <Chip label='Label' size='small' sx={{ marginLeft: '0.5rem' }} />
              </Grid>
              <Grid item xs={6} textAlign='right'>
                <Button
                  variant='outlined'
                  startIcon={<AddIcon />}
                >New Item</Button>
              </Grid>
          </Grid>
        }
      />
      <Divider />
      <CardContent>
        <List>
          { items.map((item) => (
            <ListItem key={item.id} component='div'>
              <NextLink href={`/projects/${item.id}`} passHref legacyBehavior>
                <ListItemButton>
                  <ListItemAvatar>
                    <LanguageIcon />
                  </ListItemAvatar>
                  <ListItemText primary={item.name} secondary={item.id} />
                  <Chip label='Label' color='primary' size='small' sx={{ marginLeft: '0.5rem' }} />
                </ListItemButton>
              </NextLink>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}

