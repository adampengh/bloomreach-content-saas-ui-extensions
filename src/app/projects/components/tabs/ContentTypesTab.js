import {
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from '@mui/material';

// Icons
import { ContentTypeIcon } from 'src/icons'

export const ContentTypesTab = ({
  projectData,
}) => {
  console.log('contentTypes', projectData?.items?.contentTypes)
  return (
    <>
      <List sx={{ padding: 0 }}>
        {projectData?.items?.contentTypes?.map(item =>
          <ListItem key={item.name} component='div'
            // secondaryAction={
            //   <IconButton
            //     edge='end'
            //     aria-label='delete'
            //     // onClick={() => handleClickDeleteIcon(channel.id)}
            //   >
            //     <DeleteIcon />
            //   </IconButton>
            // }
          >
            <ListItemAvatar>
              <ContentTypeIcon />
            </ListItemAvatar>
            <ListItemText primary={item.displayName} secondary={item.name} />
          </ListItem>
        )}
      </List>
    </>
  )
}
