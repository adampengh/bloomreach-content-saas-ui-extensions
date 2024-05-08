'use client'

// Components
import { Typography, Button, Grid } from '@mui/material';

// Icons
import { AddTwoToneIcon } from 'src/icons';

const PageTitle = ({ heading = '', subHeading = '', docs = '', ...rest }) => {
  return (
    <Grid
      container
      justifyContent='space-between'
      alignItems='center'
      {...rest}
    >
      <Grid item>
        <Typography variant='h1' component='h1'>
          {heading}
        </Typography>
        <Typography variant='subtitle2'>{subHeading}</Typography>
      </Grid>
      { docs && <Grid item>
        <Button
          href={docs}
          target='_blank'
          rel='noopener noreferrer'
          sx={{ mt: { xs: 2, md: 0 } }}
          variant='contained'
          startIcon={<AddTwoToneIcon fontSize='small' />}
        >
          {heading} Documentation
        </Button>
      </Grid> }
    </Grid>
  );
};

export default PageTitle;
