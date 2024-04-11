'use client'

// Components
import {
  Alert,
  AlertTitle,
  Card,
  Container,
  Grid,
} from '@mui/material';

const ComponentsPageErrorContent = () => {
  return (
    <Container maxWidth="xl">
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        alignContent="stretch"
        sx={{
          '& .MuiCircularProgress-root': {
            margin: '24px'
          }
        }}
      >
        <Grid item xs={12}>
          <Card>
            <Alert severity="error">
              <AlertTitle><strong>Invalid URL Format</strong></AlertTitle>
                <p>The URL should be in the format of /components/:channelId/:componentGroup/:componentName</p>
                <p><strong>Example:</strong> /components/reference-spa-v1A2b/brx-reference-spa/referencespa-single-banner-carousel</p>
              </Alert>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

export default ComponentsPageErrorContent
