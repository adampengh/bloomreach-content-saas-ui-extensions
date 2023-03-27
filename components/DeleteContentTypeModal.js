import { useContext, useEffect, useState } from 'react'

import {
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
} from '@mui/material';

const DeleteContentTypeModal = ({
  showDeleteModal,
  setShowDeleteModal,
  selectedRows,
  setSelectedRows,
  channelId,
}) => {

  const handleClose = () => {
    setShowDeleteModal(false)
    setSelectedRows([])
  };

  const handleDeleteItems = async (items) => {
    console.log('handleDeleteItems', items)
    // await Promise.all(items.map(async (item) => {
    //   const componentGroup = component.split('/')[0]
    //   const componentName = component.split('/')[1]
    //   await deleteComponent(environment, xAuthToken, channel.id, componentGroup, componentName)
    //     .then(response => console.log('deleteComponent', response))
    //     .catch(error => {
    //       console.log('deleteComponent', error)
    //       handleShowSnackbar('error', `Error deleting ${component.id}`)
    //     })
    // }))

    // await getAllComponents(environment, xAuthToken, channel.id, selectedComponentGroup.name)
    //   .then(response => {
    //     const columns = response.data.map(item => {
    //       return {
    //         id: item.id,
    //         ctype: item.ctype,
    //         label: item.label,
    //       }
    //     })
    //     console.log('new columns', columns)
    //     handleShowSnackbar('success', 'Components deleted')
    //     setComponents(columns)
    //     setPageSize(columns.length)
    //   })
  }

  return (
    <Dialog
      open={showDeleteModal}
      onClose={handleClose}
      fullWidth={true}
      maxWidth={'sm'}

    >
      <DialogTitle id="alert-dialog-title">
        {"Confirm Deletion"}
      </DialogTitle>
      <DialogContent sx={{ pb: '64px' }}>
        <DialogContentText id="alert-dialog-description">
          Delete {selectedRows} from {channelId}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button color="error" variant="contained" onClick={handleDeleteItems(selectedRows)} autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteContentTypeModal
