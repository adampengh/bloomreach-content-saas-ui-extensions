import NextLink from 'next/link';
import {
  Alert,
  Box,
  Button,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
} from '@mui/material';

// Icons
import { DeleteIcon, LanguageIcon } from 'src/icons'

export const ChannelsTab = ({
  projectData,
  availableChannels,
  setShowAddChannelModal,
  handleClickDeleteIcon
}) => {
  return (
    <>
      { projectData?.items?.channels?.length === 0 &&
        <Box sx={{px:1, mb:3}}>
          <Alert severity='info' color='primary'>No Channels in this Project.</Alert>
        </Box>
      }
      <List sx={{ padding: 0 }}>
        {projectData?.items?.channels?.map(channel =>
          <ListItem key={channel.id} component='div'
            secondaryAction={
              <IconButton
                edge='end'
                aria-label='delete'
                onClick={() => handleClickDeleteIcon(channel.id)}
              >
                <DeleteIcon />
              </IconButton>
            }>
            <NextLink href={`/channels/${channel.id}`} passHref legacyBehavior disabled>
              <ListItemButton>
                <ListItemAvatar>
                  <LanguageIcon />
                </ListItemAvatar>
                <ListItemText primary={channel.displayName} secondary={channel.id} />
              </ListItemButton>
            </NextLink>
          </ListItem>
        )}
      </List>
      <Button
        disabled={!availableChannels.length > 0 || projectData?.state?.status !== 'IN_PROGRESS'}
        sx={{ margin: 1 }}
        variant='outlined'
        onClick={() => setShowAddChannelModal(true)}
      >Add Channels</Button>
    </>
  )
}
