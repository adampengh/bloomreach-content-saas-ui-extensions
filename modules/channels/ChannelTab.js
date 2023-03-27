import {
  Grid,
  TextField,
} from '@mui/material';

export const ChannelTab = ({ channel }) => {
  return (
    <Grid
      container
      direction="row"
      justifyContent="space-between"
      alignItems="stretch"
      spacing={3}
      sx={{ width: '100%' }}
    >
      <Grid item xs={6}>
        <TextField
          disabled
          id="id"
          name="id"
          label="Channel ID"
          value={channel.id}
        />
      </Grid>
      <Grid item xs={6}>
        <TextField
          disabled
          id="id"
          name="id"
          label="Channel ID"
          value={channel.id}
        />
      </Grid>
    </Grid>
  )
}
