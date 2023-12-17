import React, { useContext } from 'react'

// API
import {
  deleteChannelParameter,
  getChannelParameters,
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
} from '@mui/material'

// Context
import { ErrorContext } from 'src/contexts/ErrorContext';

// Icons
import CloseIcon from '@mui/icons-material/Close';


export default function DeleteChannelParameterModal({
  showModal,
  setShowModal,
  selectedParameter,
  setSelectedParameter,
  parameters,
  setParameters,
  channelId,
  environment,
  xAuthToken,
}) {
  // Context
  const { handleShowSnackbar } = useContext(ErrorContext)

  const handleClose = () => {
    setShowModal(false)
  };

  const handleSubmit = async (event) => {
    event.preventDefault()

    // Delete channel property
    await deleteChannelParameter(environment, xAuthToken, channelId, selectedParameter.name)
      .then(() => handleShowSnackbar('success', 'Channel Property Deleted'))
      .catch(error => handleShowSnackbar('error', error.message))

    // Get all channel properties
    await getChannelParameters(environment, xAuthToken, channelId)
      .then(response => setParameters(response.data))
      .catch(error => handleShowSnackbar('error', error.message))

    await setShowModal(false)
  }

  return (
    <Dialog
      open={showModal}
      onClose={handleClose}
      fullWidth={true}
      maxWidth={'sm'}
    >
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '100%' }
        }}
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit}
      >
        <DialogTitle>
          Delete Channel Property
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
          <DialogContentText>Confirm delete channel property: <strong>{selectedParameter?.name}</strong></DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            type="submit"
          >Delete</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
