'use client'

import {
  Box,
  Typography,
  Hidden,
  Container,
  Button,
  Grid,
} from '@mui/material';
import { MainContent, GridWrapper, TypographyPrimary, TypographySecondary } from './styles';

const ErrorPage = () => {
  return (
    <MainContent>
      <Grid
        container
        sx={{ height: '100%' }}
        alignItems="stretch"
        spacing={0}
      >
        <Grid
          xs={12}
          md={12}
          alignItems="center"
          display="flex"
          justifyContent="center"
          item
        >
          <Container maxWidth="lg">
            <Box textAlign="center">
              <Typography variant="h1" sx={{ my: 2 }}>
                There was an error, please try again later
              </Typography>
              <Typography
                variant="h4"
                color="text.secondary"
                fontWeight="normal"
                sx={{ mb: 4 }}
              >
                The server encountered an internal error and was not able to complete your request
              </Typography>
              <Button href="/" variant="contained" sx={{ ml: 1 }}>
                Go back
              </Button>
            </Box>
          </Container>
        </Grid>
        {/* <Hidden mdDown>
          <GridWrapper
            xs={12}
            md={6}
            alignItems="center"
            display="flex"
            justifyContent="center"
            item
          >
            <Container maxWidth="sm">
              <Box textAlign="center">
                <TypographyPrimary variant="h1" sx={{ my: 2 }}>
                  Bloomreach SaaS UI Extension
                </TypographyPrimary>
                <TypographySecondary
                  variant="h4"
                  fontWeight="normal"
                  sx={{ mb: 4 }}
                >
                  High performance React template built with lots of powerful MUI (Material-UI) components across multiple product niches for fast & perfect apps development processes.
                </TypographySecondary>
                <Button href="/" size="large" variant="contained">
                  Overview
                </Button>
              </Box>
            </Container>
          </GridWrapper>
        </Hidden> */}
      </Grid>
    </MainContent>
  )
}

export default ErrorPage;
