'use client'

import {
  Box,
  Typography,
  Container,
  Button,
  Grid,
} from '@mui/material';
import { MainContent } from './styles';

const ErrorPage = () => {
  return (
    <MainContent>
      <Grid
        container
        sx={{ height: '100%' }}
        alignItems='stretch'
        spacing={0}
      >
        <Grid
          xs={12}
          md={12}
          alignItems='center'
          display='flex'
          justifyContent='center'
          item
        >
          <Container maxWidth='lg'>
            <Box textAlign='center'>
              <Typography variant='h1' sx={{ my: 2 }}>
                There was an error, please try again later
              </Typography>
              <Typography
                variant='h4'
                color='text.secondary'
                fontWeight='normal'
                sx={{ mb: 4 }}
              >
                The server encountered an internal error and was not able to complete your request
              </Typography>
              <Button href='/' variant='contained' sx={{ ml: 1 }}>
                Go back
              </Button>
            </Box>
          </Container>
        </Grid>
      </Grid>
    </MainContent>
  )
}

export default ErrorPage;
