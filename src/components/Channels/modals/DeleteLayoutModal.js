import React, { useContext, useState } from 'react'

// API
import {
  deleteLayout,
  getAllLayouts,
} from 'bloomreach-content-management-apis'

// Components
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material'
import {
  LoadingButton
 } from '@mui/lab';

// Context
import { ErrorContext } from 'src/contexts/ErrorContext';

// Icons
import CloseIcon from '@mui/icons-material/Close';


export default function DeleteLayoutModal({
  showModal,
  setShowModal,
  layouts,
  setLayouts,
  selectedItems,
  setSelectedItems,
  channelId,
  environment,
  xAuthToken,
}) {
  // State
  const [isProcessing, setIsProcessing] = useState(false)

  // Context
  const { handleShowSnackbar } = useContext(ErrorContext)

  const handleClose = () => {
    setShowModal(false)
  };

  const handleSubmit = async (event) => {
    event.preventDefault()
    await setIsProcessing(true)

    for await (const layout of selectedItems) {
      await deleteLayout(environment, xAuthToken, channelId, layout)
      .then(response => {
        console.log('deleteLayout', layout)
      })
      .catch(error => handleShowSnackbar('error', error.message))
    }

    await getAllLayouts(environment, xAuthToken, channelId)
      .then(response => {
        const columns = response.data.map(item => {
          return {
            id: item.name,
            type: item.type,
            label: item.label,
            extends: item.extends || ''
          }
        })
        setLayouts(columns)
      })
      .catch(error => handleShowSnackbar('error', error.message))

    await setShowModal(false)
    await handleShowSnackbar('success', 'Layout(s) Deleted')
    await setIsProcessing(false)
    await setSelectedItems([])
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
          Delete Layout
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
          Delete {selectedItems.length} layouts from {channelId}
            <ul>
              {selectedItems?.map((item, index) =>
                <li key={index}>{item}</li>
              )}
            </ul>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <LoadingButton
            color="error"
            loading={isProcessing}
            loadingPosition="start"
            variant="contained"
            type="submit"
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
