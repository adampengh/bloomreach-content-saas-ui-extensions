import React, { useContext, useState } from 'react'
import { useRouter }  from 'next/navigation'
import axios from 'axios'

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
import {
  LoadingButton
 } from '@mui/lab';

// Context
import { ConfigurationContext, ErrorContext } from 'src/contexts'

// Icons
import { CloseIcon } from 'src/icons'


export default function DeleteProjectModal({
  showModal,
  setShowModal,
  projectData,
  instance,
}) {
  const router = useRouter()

  // State
  const [isProcessing, setIsProcessing] = useState(false)

  // Context
  const { appConfiguration } = useContext(ConfigurationContext)
  const { handleShowSnackbar } = useContext(ErrorContext)
  const {
    environment,
    xAuthToken,
  } = appConfiguration?.environments?.[instance]

  const handleClose = () => {
    setShowModal(false)
  };

  const handleSubmit = async (event) => {
    event.preventDefault()
    await setIsProcessing(true)

    await axios.delete(`/api/projects?environment=${environment}&projectId=${projectData.id}`, {
      headers: {
        'x-auth-token': xAuthToken
      }
    })
      .then((response) => {
        console.log(response.data)
        handleShowSnackbar('success', `Project "${projectData?.name}" Deleted`)
      })
      .catch((error) => {
        console.error(error)
        handleShowSnackbar('error', 'Error deleting project')
      })

    await setShowModal(false)
    await setIsProcessing(false)

    router.push('/projects')
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
          Delete Project
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
          <DialogContentText>Are you sure you want to delete project <strong>{projectData?.name}?</strong></DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <LoadingButton
            color='error'
            loading={isProcessing}
            loadingPosition='start'
            variant='contained'
            type='submit'
            sx={{
              '&.MuiLoadingButton-loading': {
                paddingLeft: 2
              },
              '& .MuiLoadingButton-loadingIndicatorStart': {
                position: 'relative',
                left: '-6px'
              }
            }}
          >
            Delete
          </LoadingButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
