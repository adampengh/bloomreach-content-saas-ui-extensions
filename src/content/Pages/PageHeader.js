import { Grid, Typography } from '@mui/material';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import SvgIcon from '@mui/material/SvgIcon';

function PageHeader() {
  return (
    <Grid container alignItems="center">
      <Grid item>
        <Typography variant="h1" component="h1" gutterBottom>
          Pages
        </Typography>
      </Grid>
    </Grid>
  );
}

export default PageHeader;
