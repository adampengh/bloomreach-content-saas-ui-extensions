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

const TemplatePageComponent = () => {
  return (
    <Container maxWidth="xl">
      <Grid
        container
        direction="row"
        justifyContent="flex-start"
        align-content="stretch"
        align-items="stretch"
        spacing={4}
      >
        <Grid item xs={12} md={3}>
          <Card sx={{ maxWidth: '100%', height: '100%' }}>
            <NextLink href='/TEMPLATES/listing' passHref legacyBehavior>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="200"
                  image="https://via.placeholder.com/400x300"
                  alt="placeholder"
                />
                <CardContent>
                  <Typography gutterBottom variant="h3" component="div">
                    Listing Page
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    This template should be used for creating listings of items, such as projects, components, etc.
                  </Typography>
                </CardContent>
              </CardActionArea>
            </NextLink>
          </Card>
        </Grid>
        <Grid item xs={12} md={3}>
          <Card sx={{ maxWidth: '100%', height: '100%' }}>
            <NextLink href='/TEMPLATES/detail' passHref legacyBehavior>
              <CardActionArea>
                <CardMedia
                  component="img"
                  height="200"
                  image="https://via.placeholder.com/400x300"
                  alt="placeholder"
                />
                <CardContent>
                  <Typography gutterBottom variant="h3" component="div">
                    Detail Page
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    This page should be used for displaying the details of a single item, such as a single component or content type
                  </Typography>
                </CardContent>
              </CardActionArea>
            </NextLink>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

export default TemplatePageComponent
