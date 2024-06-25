import React, { useContext } from 'react'

// API
import {
  deleteChannelBranch,
  getAllChannels,
  getDeveloperProject,
} from 'bloomreach-content-management-apis'

// Components
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from '@mui/material'

// Contexts
import { ConfigurationContext, ErrorContext, LoadingContext } from 'src/contexts'

// Icons
import { CloseIcon } from 'src/icons'

// Utils
import { pollingPromise } from 'src/lib/utils'


export default function DeleteChannelModal({
  showModal,
  setShowModal,
  setChannels,
  channelToDelete,
  instance,
  projectId,
}) {
  // Context
  const { appConfiguration } = useContext(ConfigurationContext)
  const { environment, xAuthToken } = appConfiguration?.environments?.[instance]
  const { handleShowSnackbar } = useContext(ErrorContext)
  const { setLoading } = useContext(LoadingContext)

  const handleClose = () => {
    setShowModal(false)
  };


  const handleRemoveChannelFromProject = async (event) => {
    console.group('Remove Channel From Project')
    event.preventDefault()

    await setShowModal(false)

    // Remove the channel from the project
    await removeChannel(environment, xAuthToken, channelToDelete)

    // Get all channels for the project after the channels have been added
    await getAllChannels(environment, xAuthToken)
      .then(response => {
        const newChannelsList = response.data.filter(channel => channel.branch === projectId)
        setChannels(newChannelsList)
      })
      .catch(error => {
        console.error('Error Getting Channels', error)
        handleShowSnackbar('error', 'Error Removing Channel from Project')
      })

    await handleShowSnackbar('success', 'Channel Removed from Project')
    console.groupEnd()
  }


  const removeChannel = async (environment, xAuthToken, channelToDelete) => {
    console.group('Removing Channel', channelToDelete)
    await setLoading({ loading: true, message: `Removing Channel: ${channelToDelete}` })

    await deleteChannelBranch(environment, xAuthToken, channelToDelete)
      .then(response => console.log('Channel Removed:', response.data))
      .catch(error => console.error('Error Removing Channel from Project', error))

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
    await promise.then(() => console.log(new Date(), 'Channel has been removed from project'))
    console.log(new Date(), 'Canceling Polling Project');
    await stopPolling();
    await setLoading({ loading: false, message: '' })

    console.groupEnd()
  }

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
        onSubmit={handleRemoveChannelFromProject}
      >

        <DialogTitle>
          <Typography variant='h3' sx={{ fontWeight: 'bold' }}>Confirm Delete Channel</Typography>
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
          <DialogContentText>
            Are you sure you want to remove developer channel: <strong>{channelToDelete}</strong>?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant='contained'
            type='submit'
          >Delete Channel</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
