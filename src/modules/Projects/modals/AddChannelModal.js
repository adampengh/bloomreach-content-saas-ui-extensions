import React, { useContext, useEffect, useState } from 'react'

// API
import {
  addChannelToProject,
  getAllChannels,
  getDeveloperProject,
} from 'bloomreach-content-management-apis'

// Components
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  IconButton,
  Typography,
} from '@mui/material'

// Contexts
import { ConfigurationContext, ErrorContext, LoadingContext } from 'src/contexts'

// Icons
import { CloseIcon } from 'src/icons'

// Utils
import { pollingPromise } from 'src/lib/utils'


export default function AddChannelModal({
  showModal,
  setShowModal,
  channels,
  setChannels,
  coreChannels,
  instance,
  projectId,
}) {
  // Context
  const { appConfiguration } = useContext(ConfigurationContext)
  const { environment, xAuthToken } = appConfiguration?.environments?.[instance]
  const { handleShowSnackbar } = useContext(ErrorContext)
  const { setLoading } = useContext(LoadingContext)

  // State
  const [availableChannels, setAvailableChannels] = useState([])
  const [checked, setChecked] = useState([]);

  useEffect(() => {
    // Filter out core channels that have already been added to the project
    if (channels) {
      const channelsNotInProject = coreChannels?.filter(coreChannel =>
        channels?.find(channel => channel.branchOf === coreChannel.name) ? false : true
      )
      setAvailableChannels(channelsNotInProject)
    }
  }, [channels])


  const handleClose = () => {
    setShowModal(false)
  };


  const handleAddChannelToProject = async (event) => {
    console.group('Add Channel to Project')
    event.preventDefault()

    // Add each checked channel to the project
    for await (const currentChannel of checked) {
      await addChannel(environment, xAuthToken, projectId, currentChannel.name)
    }

    // Get all channels for the project after the channels have been added
    await getAllChannels(environment, xAuthToken)
      .then(response => {
        const newChannelsList = response.data.filter(channel => channel.branch === projectId)
        setChannels(newChannelsList)
      })
      .catch(error => console.error('Error Getting Channels', error))


    await handleShowSnackbar('success', checked.length > 1 ? 'Channels Added' : 'Channel Added')
    await setChecked([])
    await setShowModal(false)
    console.groupEnd()
  }


  const addChannel = async (environment, xAuthToken, projectId, channelName) => {
    console.group('Adding Channel', channelName)
    await setLoading({ loading: true, message: `Adding Channel: ${channelName}` })

    await addChannelToProject(environment, xAuthToken, projectId, channelName)
      .then(response => console.log('Channel Added:', response.data))
      .catch(error => console.error('Error Adding Channel to Project', error))

    // Get the status of the project
    // Poll until the project status is 'IN_PROGRESS'
    const getProjectStatus = async () => {
      console.log(new Date(), 'Calling Project API');
      return await getDeveloperProject(environment, xAuthToken, projectId)
        .then(response => {
          return response.data?.state?.status
        })
        .catch(err => console.error(err))
    };

    // Test the project status, it should be 'IN_PROGRESS' before we can try to add another channel
    let count = 0;
    const testProjectStatus = (status) => {
      const MAX_RETRIES = 10;
      count++
      console.log(new Date(), 'Testing', status, status === 'IN_PROGRESS' ? 'OK' : 'Not yet...');
      return count === MAX_RETRIES || status === 'IN_PROGRESS';
    };


    // Poll the project status until it is 'IN_PROGRESS' or until we reach the max retries
    console.log(new Date(), 'Starting Polling Project');
    const { promise, stopPolling } = pollingPromise(getProjectStatus, testProjectStatus, 1000);
    await promise.then(() => console.log(new Date(), 'Channel has been added to project'))
    console.log(new Date(), 'Canceling Polling Project');
    await stopPolling();
    await setLoading({ loading: false, message: '' })

    console.groupEnd()
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
      open={showModal}
      onClose={handleClose}
    >
      <Box
        component='form'
        sx={{
          '& .MuiTextField-root': { m: 1, width: '100%' }
        }}
        autoComplete='off'
        onSubmit={handleAddChannelToProject}
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          <Typography variant='h3'>Add Channel to Project</Typography>
          <IconButton
            aria-label='close'
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
          <FormGroup sx={{ width: '100%', marginTop: 1 }}>
            <strong>Available Channels:</strong>
            {availableChannels?.map((channel, index) =>
              <FormControlLabel
                key={index}
                onClick={handleToggle ? handleToggle(channel) : null}
                control={ <Checkbox checked={checked.indexOf(channel) !== -1} /> }
                label={channel.name}
              />
            )}
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant='contained'
            type='submit'
            disabled={checked.length < 1}
          >{checked.length > 1 ? 'Add Channels' : 'Add Channel'}</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
