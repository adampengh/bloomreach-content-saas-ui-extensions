'use client'

// Components
import {
  Card,
  CardContent,
  CardHeader,
  Divider,
  Container,
  Grid,
} from '@mui/material';

const PagesCopyModule = () => {
  return (
    <>
      <Container maxWidth='xl' sx={{ pb: 3 }}>
        <Grid
          container
          direction='row'
          justifyContent='center'
          alignItems='stretch'
          alignContent='stretch'
          spacing={3}
        >
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title='Source Channel' />
              <Divider />
              <CardContent>
                Card
              </CardContent>
            </Card>
          </Grid>

          {/* Target Channel */}
          <Grid item xs={12} md={6}>
            <Card>
              <CardHeader title='Target Channel' />
              <Divider />
              <CardContent>
                Card
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  )
}

export default PagesCopyModule
