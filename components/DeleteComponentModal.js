import { useContext, useEffect, useState } from 'react'

// API
import {
  deleteComponent,
  getAllComponents,
} from 'api'

// Components
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  DialogContentText,
  Typography,
} from '@mui/material';

// Contexts
import { ConfigurationContext } from 'src/contexts/ConfigurationContext';
import { ErrorContext } from 'src/contexts/ErrorContext';

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
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '100%' }
        }}
        autoComplete="off"
        onSubmit={handleDeleteComponents}
      >
        <DialogTitle id="alert-dialog-title">
          <Typography variant="h3" component="h3">Confirm Deletion</Typography>
        </DialogTitle>
        <DialogContent sx={{ pb: '64px' }}>
          <DialogContentText id="alert-dialog-description">
            Delete {selectedComponents.length} components from {channelId}
            <ul>
              {selectedComponents?.map((component, index) =>
                <li key={index}>{component}</li>
              )}
            </ul>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            type="submit"
          >
            Delete Components
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  )
}

export default DeleteComponentModal
