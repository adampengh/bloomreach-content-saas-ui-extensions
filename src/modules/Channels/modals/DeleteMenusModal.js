import React, { useContext, useState } from 'react'

// API
import {
  deleteMenu,
  getAllMenus,
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
import { LoadingButton } from '@mui/lab'

// Context
import { ConfigurationContext, ErrorContext } from 'src/contexts'

// Icons
import { CloseIcon } from 'src/icons'


export default function DeleteMenusModal({
  showModal,
  setShowModal,
  selectedItems,
  setSelectedItems,
  setMenus,
  channelId,
}) {
  // State
  const [isProcessing, setIsProcessing] = useState(false)

  // Context
  const { appConfiguration } = useContext(ConfigurationContext)
  const {
    environment,
    xAuthToken,
  } = appConfiguration.environments?.source
  const { handleShowSnackbar } = useContext(ErrorContext)

  const handleClose = () => {
    setShowModal(false)
  };

  const handleSubmit = async (event) => {
    event.preventDefault()
    await setIsProcessing(true)

    for await (const menu of selectedItems) {
      await deleteMenu(environment, xAuthToken, channelId, menu)
      .then(() => console.log('deleteMenu', menu))
      .catch(error => handleShowSnackbar('error', error.message))
    }

    await getAllMenus(environment, xAuthToken, channelId)
      .then(response => {
        const columns = response.data.map(item => {
          console.log('item', item)
          return {
            id: item
          }
        })
        setMenus(columns)
      })
      .catch(error => handleShowSnackbar('error', error.message))

    await setShowModal(false)
    await handleShowSnackbar('success', 'Menu(s) Deleted')
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
        component='form'
        sx={{
          '& .MuiTextField-root': { m: 1, width: '100%' }
        }}
        noValidate
        autoComplete='off'
        onSubmit={handleSubmit}
      >
        <DialogTitle>
          Delete Menus
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
          Delete {selectedItems.length} menus from {channelId}
            <ul>
              {selectedItems?.map((item, index) =>
                <li key={index}>{item}</li>
              )}
            </ul>
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
