import React, { useContext, useEffect, useState } from 'react'

// API
import {
  addChannelToProject,
  getAllChannels,
} from 'bloomreach-content-management-apis'

// Components
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  IconButton,
} from '@mui/material'

// Contexts
import { ConfigurationContext } from 'src/contexts/ConfigurationContext';
import { ErrorContext } from 'src/contexts/ErrorContext';

// Icons
import CloseIcon from '@mui/icons-material/Close';

export default function AddChannelModal({
  showAddChannelModal,
  setShowAddChannelModal,
  channels,
  setChannels,
  coreChannels,
  instance,
  projectId,
}) {
  // Context
  const { appConfiguration } = useContext(ConfigurationContext)
  const { handleShowSnackbar } = useContext(ErrorContext)

  const [availableChannels, setAvailableChannels] = useState([])
  const [checked, setChecked] = useState([]);

  const {
    environment,
    xAuthToken,
  } = appConfiguration?.environments?.[instance]
  console.log('environment', environment)
  console.log('xAuthToken', xAuthToken)

  const handleClose = () => {
    setShowAddChannelModal(false)
  };

  useEffect(() => {
    // Filter out core channels that have already been added to the project
    if (channels) {
      const channelsNotInProject = coreChannels?.filter(coreChannel => {
        return channels?.find(channel => channel.branchOf === coreChannel.name) ? false : true
      })
      console.log('availableChannels', channelsNotInProject)
      setAvailableChannels(channelsNotInProject)
    }
  }, [channels])


  const handleAddChannelToProject = async (event) => {
    event.preventDefault()
    console.log('checked', checked)
    for await (const currentChannel of checked) {
      console.log('currentChannel', currentChannel.name)
      await addChannel(environment, xAuthToken, projectId, currentChannel.name)
    }

    const newChannelsList = await getAllChannels(environment, xAuthToken)
      .then(response => {
        console.log('reponse', response.data.filter(channel => channel.branch === projectId))
        return response.data.filter(channel => channel.branch === projectId)
      })
    console.log('newChannelsList', newChannelsList)
    await setChannels(newChannelsList)

    await handleShowSnackbar('success', 'Channels Added')
    await setChecked([])
    await setShowAddChannelModal(false)
  }

  const addChannel = async (environment, xAuthToken, projectId, channelName) => {
    await addChannelToProject(environment, xAuthToken, projectId, channelName)
      .then(response => console.log('channel added', response.data))
      .catch(error => console.error('error adding channel', error))
  }

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };


  return (
    <Dialog
      fullWidth={true}
      maxWidth={'sm'}
      open={showAddChannelModal}
      onClose={handleClose}
    >
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '100%' }
        }}
        autoComplete="off"
        onSubmit={handleAddChannelToProject}
      >
        <DialogTitle>
          Add Channels to Project
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <FormGroup sx={{ m: 1, width: '100%', marginTop: 3 }}>
              <strong>Channels:</strong>
              {availableChannels?.map((channel, index) =>
                <FormControlLabel
                  key={index}
                  onClick={handleToggle ? handleToggle(channel) : null}
                  control={ <Checkbox checked={checked.indexOf(channel) !== -1} /> }
                  label={channel.name} />
              )}
            </FormGroup>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            type="submit"
          >Add Channels</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
