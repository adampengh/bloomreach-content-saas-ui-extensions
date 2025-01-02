import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';

// Icons
import { ResourceBundleIcon } from 'src/icons'

export const ResourceBundlesTab = ({
  projectData,
}) => {
  console.log('resourceBundles', projectData?.items?.resourceBundles)
  return (
    <>
      <List sx={{ padding: 0 }}>
        {projectData?.items?.resourceBundles?.map(item =>
          <ListItem key={item.path} component='div'
          // secondaryAction={
          //   <Grid container>
          //     <Grid item>
          //       <IconButton
          //         aria-label='delete'
          //         // onClick={() => handleClickDeleteIcon(channel.id)}
          //       >
          //         <ContentCopyIcon />
          //       </IconButton>
          //     </Grid>
          //     <Grid item>
          //       <IconButton
          //         aria-label='delete'
          //         // onClick={() => handleClickDeleteIcon(channel.id)}
          //       >
          //         <DeleteIcon />
          //       </IconButton>
          //     </Grid>
          //   </Grid>
          // }
        >
            <ListItemAvatar>
              <ResourceBundleIcon />
            </ListItemAvatar>
            <ListItemText primary={item.displayName} secondary={item.path} />
          </ListItem>
        )}
      </List>
    </>
  )
}
