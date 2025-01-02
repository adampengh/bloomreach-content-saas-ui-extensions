import {
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';

import { DocumentIcon } from 'src/icons';

export const HorizontalList = ({
  heading,
  items,
}) => {
  return (
    <Grid container sx={{ mb: 2 }}>
      <Grid item xs={12} md={4}>
        <Typography variant='h4'>{heading}</Typography>
      </Grid>
      <Grid item xs={12} md={8}>
        <List dense sx={{ p: 0 }}>
          {items?.map((item) => (
            <ListItem key={item.path} dense disableGutters sx={{ m: 0, py: 0.5}}>
              <ListItemIcon sx={{ minWidth: '36px' }}>
                <DocumentIcon />
              </ListItemIcon>
              <ListItemText primary={item.displayName} secondary={item.path} />
            </ListItem>
          ))}
        </List>
      </Grid>
    </Grid>
  )
}
