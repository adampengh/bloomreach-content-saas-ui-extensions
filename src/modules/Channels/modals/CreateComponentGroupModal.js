import React, { useContext, useState } from 'react'

// API
import {
  createComponentGroup,
  getAllComponentGroups,
} from 'bloomreach-content-management-apis'

// Components
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  IconButton,
  TextField,
} from '@mui/material'

// Context
import { ErrorContext } from 'src/contexts'

// Icons
import { CloseIcon } from 'src/icons'


export default function CreateComponentGroupModal({
  showModal,
  setShowModal,
  setComponentGroups,
  setSelectedComponentGroup,
  channelId,
  environment,
  xAuthToken,
}) {
  // Context
  const { handleShowSnackbar } = useContext(ErrorContext)
  // State
  const [componentGroupName, setComponentGroupName] = useState(null)
  const [hasError, setHasError] = useState(false)

  const handleClose = () => {
    setShowModal(false)
  };

  const handleSubmit = async (event) => {
    event.preventDefault()
    const componentGroup = event.target.querySelector('#componentGroupName').value
    const hidden = event.target.querySelector('#hidden').checked

    const data = {
      name: componentGroup,
      hidden,
      system: 'false'
    }

    await createComponentGroup(environment, xAuthToken, channelId, componentGroup, data)
      .then(() => handleShowSnackbar('success', 'Component Group Created'))
      .catch(error => handleShowSnackbar('error', error.message))

    await getAllComponentGroups(environment, xAuthToken, channelId)
      .then(response => {
        setComponentGroups(response.data)
        const newComponentGroup = response.data.filter(group => group.name === componentGroup)[0]
        console.log('newComponentGroup', newComponentGroup)
        setSelectedComponentGroup(newComponentGroup)
      })
      .catch(error => handleShowSnackbar('error', error.message))

    await setShowModal(false)
  }

  const handleNameChange = (event) => {
    event.preventDefault()
    // eslint-disable-next-line no-useless-escape
    const pattern = /[\.\/\:\[\]\*\'\"\|\s]/
    setComponentGroupName(event.target.value)
    pattern.test(event.target.value) ? setHasError(true) : setHasError(false)
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
          Create Component Group
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
          <TextField
            autoFocus
            error={hasError}
            margin='dense'
            id='componentGroupName'
            label='Name'
            type='text'
            fullWidth
            variant='standard'
            value={componentGroupName || ''}
            helperText={hasError ? 'Name cannot contain . / : [ ] * \' " | and any whitespace character' : ''}
            onChange={handleNameChange}
          />
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  id='hidden'
                  name='hidden'
                />
              }
              label='Hidden' />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant='contained'
            type='submit'
            disabled={!!hasError}
          >Create</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
