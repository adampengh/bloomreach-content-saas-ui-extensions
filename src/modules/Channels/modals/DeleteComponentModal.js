import { useContext, useState } from 'react'

// API
import {
  deleteComponent,
  getAllComponents,
} from 'bloomreach-content-management-apis'

// Components
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  IconButton,
  Typography,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'

// Contexts
import { ConfigurationContext, ErrorContext } from 'src/contexts'

// Icons
import { CloseIcon } from 'src/icons'


const DeleteComponentModal = ({
  showDeleteComponentsModal,
  setShowDeleteComponentsModal,
  selectedComponents,
  setSelectedComponents,
  channelId,
  selectedComponentGroup,
  setComponents,
  setPageSize,
}) => {
  // State
  const [isProcessing, setIsProcessing] = useState(false)

  // Context
  const { appConfiguration } = useContext(ConfigurationContext)
  const { handleShowSnackbar } = useContext(ErrorContext)
  const {
    environment,
    xAuthToken,
  } = appConfiguration.environments?.source

  const handleClose = () => {
    setShowDeleteComponentsModal(false)
    setSelectedComponents([])
  };

  const handleDeleteComponents = async (event) => {
    event.preventDefault()
    await setIsProcessing(true)

    for await (const component of selectedComponents) {
      const componentGroup = component.split('/')[0]
      const componentName = component.split('/')[1]
      await deleteComponent(environment, xAuthToken, channelId, componentGroup, componentName)
        .then(response => console.log('deleteComponent', response))
        .catch(error => {
          console.log('deleteComponent', error)
          handleShowSnackbar('error', `Error deleting ${component.id}`)
        })
    }

    await getAllComponents(environment, xAuthToken, channelId, selectedComponentGroup.name)
      .then(response => {
        const columns = response.data.map(item => {
          return {
            id: item.id,
            ctype: item.ctype,
            label: item.label,
          }
        })
        handleShowSnackbar('success', 'Components deleted')
        setComponents(columns)
        setPageSize(columns.length)
      })

    await setIsProcessing(false)
    await setSelectedComponents([])
    await setShowDeleteComponentsModal(false)
  }

  return (
    <Dialog
      open={showDeleteComponentsModal}
      onClose={handleClose}
      fullWidth={true}
      maxWidth={'sm'}
    >
      <Box
        component='form'
        sx={{
          '& .MuiTextField-root': { m: 1, width: '100%' }
        }}
        autoComplete='off'
        onSubmit={handleDeleteComponents}
      >
        <DialogTitle id='alert-dialog-title'>
          <Typography variant='h3' component='h3'>Confirm Deletion</Typography>
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
        <DialogContent sx={{ pb: '64px' }}>
          <DialogContentText id='alert-dialog-description'>
            Delete {selectedComponents.length} components from {channelId}
            <ul>
              {selectedComponents?.map((component, index) =>
                <li key={index}>{component}</li>
              )}
            </ul>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            disabled={isProcessing}
          >Cancel</Button>
          <LoadingButton
            loading={isProcessing}
            color='error'
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
            Delete Components
          </LoadingButton>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default DeleteComponentModal
