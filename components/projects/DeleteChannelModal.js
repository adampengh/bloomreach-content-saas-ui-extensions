import React, { useContext, useEffect, useState } from 'react'

// API
import {
  deleteChannelBranch,
  getAllChannels,
  getLayout,
  putLayout,
} from 'api'

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
} from '@mui/material'

// Contexts
import { ConfigurationContext } from 'src/contexts/ConfigurationContext';
import { ErrorContext } from 'src/contexts/ErrorContext';

// Icons
import CloseIcon from '@mui/icons-material/Close';


export default function AddChannelModal({
  showDeleteChannelModal,
  setShowDeleteChannelModal,
  channelToDelete,
  instance,
}) {
  // Context
  const { appConfiguration } = useContext(ConfigurationContext)
  const { handleShowSnackbar } = useContext(ErrorContext)

  const {
    environment,
    xAuthToken,
  } = appConfiguration?.environments?.[instance]

  const handleClose = () => {
    setShowDeleteChannelModal(false)
  };

  // useEffect(() => {
  //   // Filter out core channels that have already been added to the project
  //   const channels = pageState?.coreChannels?.filter(coreChannel => {
  //     return pageState?.channels?.find(channel => channel.branchOf === coreChannel.name) ? false : true
  //   })
  //   setAvailableChannels(channels)
  //   console.log('channels', channels)
  // }, [pageState.channels])


  const handleDeleteChannelBranch = async (event) => {
    event.preventDefault()

    await deleteChannelBranch(environment, xAuthToken, channelToDelete)
      .then(response => {
        console.log('response')
        handleShowSnackbar('success', 'Channel Deleted')
      })
      .catch(error => {
        console.error(error)
        handleShowSnackbar('error', error.message)
      })

    await setShowDeleteChannelModal(false)
  }

  return (
    <Dialog
      fullWidth={true}
      maxWidth={'sm'}
      open={showDeleteChannelModal}
      onClose={handleClose}
    >
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '100%' }
        }}
        autoComplete="off"
        onSubmit={handleDeleteChannelBranch}
      >
        <DialogTitle>
          Confirm Delete Channel
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
            {channelToDelete}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant="contained"
            type="submit"
          >Delete Channel</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
