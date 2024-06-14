import React, { useContext } from 'react'

// API
import {
  deleteComponentGroup,
  getAllComponentGroups,
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

// Context
import { ErrorContext } from 'src/contexts'

// Icons
import { CloseIcon } from 'src/icons'


export default function DeleteComponentGroupModal({
  showModal,
  setShowModal,
  setComponentGroups,
  selectedComponentGroup,
  setSelectedComponentGroup,
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

    await deleteComponentGroup(environment, xAuthToken, channelId, selectedComponentGroup.name)
      .then(() => handleShowSnackbar('success', 'Component Group Deleted'))
      .catch(error => handleShowSnackbar('error', error.message))

    await getAllComponentGroups(environment, xAuthToken, channelId)
      .then(response => {
        setComponentGroups(response.data)
        setSelectedComponentGroup(response.data.filter(group => !group.system)[0])
      })
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
        component='form'
        sx={{
          '& .MuiTextField-root': { m: 1, width: '100%' }
        }}
        noValidate
        autoComplete='off'
        onSubmit={handleSubmit}
      >
        <DialogTitle>
          <Typography variant='h3' sx={{ fontWeight: 'bold' }}>Delete Component Group</Typography>
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
          <DialogContentText>Confirm delete component group: <strong>{selectedComponentGroup.name}</strong></DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            color='error'
            variant='contained'
            type='submit'
          >Delete</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
