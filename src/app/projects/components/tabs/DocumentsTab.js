import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';

// Icons
import { DocumentIcon } from 'src/icons'

export const DocumentsTab = ({
  projectData,
}) => {
  console.log('documents', projectData?.items?.documents, !projectData?.items?.documents)
  if (!projectData?.items?.documents) return null

  return (
    <>
      <List sx={{ padding: 0 }}>
        {projectData?.items?.documents?.map(item =>
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
              <DocumentIcon />
            </ListItemAvatar>
            <ListItemText primary={item.displayName} secondary={item.path} />
          </ListItem>
        )}
      </List>
    </>
  )
}
