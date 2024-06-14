'use client'

import NextLink from 'next/link';

// Components
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Container,
  Grid,
  Typography,
} from '@mui/material';

export const TemplatePageModule = () => {

  const page = [
    {
      title: 'Listing Page',
      description: 'This template should be used for creating listings of items, such as projects, components, etc.',
      image: 'https://via.placeholder.com/400x300',
      path: '/TEMPLATES/listing'
    },
    {
      title: 'Grid Page',
      description: 'This template should be used for creating listings of items, such as projects, components, etc.',
      image: 'https://via.placeholder.com/400x300',
      path: '/TEMPLATES/grid'
    },
    {
      title: 'Detail Page',
      description: 'This page should be used for displaying the details of a single item, such as a single component or content type',
      image: 'https://via.placeholder.com/400x300',
      path: '/TEMPLATES/detail'
    }
  ]

  return (
    <Container maxWidth={false}>
      <Grid
        container
        direction='row'
        justifyContent='flex-start'
        align-content='stretch'
        align-items='stretch'
        spacing={4}
      >
        {/* Loop through the page array and create a card for each item */}
        {page.map((item, index) => (
          <Grid item xs={12} md={3} xl={2} key={index}>
            <Card sx={{ maxWidth: '100%', height: '100%' }}>
              <NextLink href={item.path} passHref legacyBehavior>
                <CardActionArea>
                  <CardMedia
                    component='img'
                    height='200'
                    image={item.image}
                    alt='placeholder'
                  />
                  <CardContent>
                    <Typography gutterBottom variant='h3' component='div'>
                      {item.title}
                    </Typography>
                    <Typography variant='body2' color='text.secondary'>
                      {item.description}
                    </Typography>
                  </CardContent>
                </CardActionArea>
              </NextLink>
            </Card>
          </Grid>
        ))}

      </Grid>
    </Container>
  )
}
