import { useContext, useState } from 'react'
import axios from 'axios'

// API
import {
  getAllContentTypes,
} from 'bloomreach-content-management-apis'

// Components
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  IconButton,
  Typography,
} from '@mui/material';
import {
  LoadingButton
 } from '@mui/lab';

// Contexts
import { ConfigurationContext, ErrorContext } from 'src/contexts'

// Icons
import CloseIcon from '@mui/icons-material/Close';

const DeleteContentTypeModal = ({
  showModal,
  setShowModal,
  selectedRows,
  setSelectedRows,
  setPageData,
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
    setShowModal(false)
    setSelectedRows([])
  };

  const handleSubmit = async (event) => {
    event.preventDefault()
    await setIsProcessing(true)

    for await (const contentType of selectedRows) {
      console.log('contentType', contentType)
      await axios.delete(`/api/contenttypes?environment=${environment}&contentTypeName=${contentType}`, {
        headers: {
          'x-auth-token': xAuthToken
        }
      })
        .then(() => handleShowSnackbar('success', `Deleted ${contentType}`))
        .catch(error => {
          console.error('deleteContentType', error)
          handleShowSnackbar('error', error.message)
        })
    }

    getAllContentTypes(environment, xAuthToken, 'development')
      .then((response) => {
        const columns = response.data.map(item => {
          return {
            type: item.type,
            id: item.name,
            displayName: item.presentation.displayName,
            fields: item.fields.length,
            enabled: item.enabled,
          }
        })
        setPageData(columns)
      })
      .catch((error) => {
        console.error('getAllContentTypes', error)
      })

    await setIsProcessing(false)
    await setSelectedRows([])
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
        autoComplete='off'
        onSubmit={handleSubmit}
      >
        <DialogTitle id='alert-dialog-title'>
          <Typography variant='h3' component='p'>Confirm Deletion</Typography>
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
            Delete content types:
            <ul>
              {selectedRows?.map((contentType, index) =>
                <li key={index}>{contentType}</li>
              )}
            </ul>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            disabled={isProcessing}
          >Cancel</Button>
          <LoadingButton
            loading={isProcessing}
            color='error'
            // loadingPosition="start"
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
  )
}

export default DeleteContentTypeModal
