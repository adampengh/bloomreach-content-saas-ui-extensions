'use client'

// Components
import { Container, Grid } from '@mui/material'
import { DeliverApiSettingsV1 } from './DeliveryApiSettingsV1'
import { DeliverApiSettingsV2 } from './DeliveryApiSettingsV2'

export const DeliveryApiSettingsModule = () => {
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
        <Grid item xs={6}>
          <DeliverApiSettingsV1 />
        </Grid>
        <Grid item xs={6}>
          <DeliverApiSettingsV2 />
        </Grid>
      </Grid>
    </Container>
  )
}
