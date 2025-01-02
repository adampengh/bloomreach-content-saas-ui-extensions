import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';

// Icons
import { WebIcon } from 'src/icons'

export const PagesTab = ({
  projectData,
}) => {
  console.log('pages', projectData?.items?.pages)
  return (
    <>
      <List sx={{ padding: 0 }}>
        {projectData?.items?.pages?.map(item =>
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
              <WebIcon />
            </ListItemAvatar>
            <ListItemText primary={item.displayName} secondary={item.path} />
          </ListItem>
        )}
      </List>
    </>
  )
}
