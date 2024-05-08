import React, { useContext, useEffect, useState } from 'react'

// API
import {
  putChannelParameter,
  getChannelParameter,
  getChannelParameters,
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

// Constants
import { DEFAULT_CHANNEL_PROPERTY_VALUES } from 'src/lib/constants'

// Context
import { ErrorContext } from 'src/contexts'

// Icons
import { CloseIcon } from 'src/icons'


export default function EditChannelParameterModal({
  showModal,
  setShowModal,
  selectedParameter,
  setParameters,
  channelId,
  environment,
  xAuthToken,
}) {
  // Context
  const { handleShowSnackbar } = useContext(ErrorContext)
  // State
  const [formData, setFormData] = useState(DEFAULT_CHANNEL_PROPERTY_VALUES)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (selectedParameter) {
      setFormData(selectedParameter)
    }
  }, [selectedParameter])

  const handleClose = () => {
    setShowModal(false)
  };

  const handleSubmit = async (event) => {
    event.preventDefault()

    // Get x-resource-version
    const xResourceVersion = await getChannelParameter(environment, xAuthToken, channelId, selectedParameter.name)
      .then(response => response.headers['x-resource-version'])
      .catch(error => handleShowSnackbar('error', error.message))

    // Update existing channel property
    await putChannelParameter(environment, xAuthToken, channelId, formData.name, formData, xResourceVersion)
      .then(() => handleShowSnackbar('success', 'Channel Property Updated'))
      .catch(error => handleShowSnackbar('error', error.message))

    // Get all channel properties
    await getChannelParameters(environment, xAuthToken, channelId)
      .then(response => setParameters(response.data))
      .catch(error => handleShowSnackbar('error', error.message))

    await setShowModal(false)
  }

  const handleNameChange = (event) => {
    event.preventDefault()
    // eslint-disable-next-line no-useless-escape
    const pattern = /[\.\/\:\[\]\*\'\"\|\s]/
    setFormData(prevState => ({
      ...prevState,
      name: event.target.value
    }))
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
          Edit Channel Property
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
            id='name'
            label='Name'
            name='name'
            type='text'
            fullWidth
            variant='standard'
            helperText={hasError ? 'Name cannot contain . / : [ ] * \' " | and any whitespace character' : ''}
            onChange={handleNameChange}
            value={formData?.name}
          />
          <TextField
            margin='dense'
            id='displayName'
            label='Display Name'
            name='displayName'
            type='text'
            fullWidth
            variant='standard'
            value={formData?.displayName || ''}
            onChange={(event) => {
              setFormData(prevState => ({
                ...prevState,
                displayName: event.target.value
              }))
            }}
          />
          <TextField
            disabled
            margin='dense'
            id='valueType'
            label='Value Type'
            name='valueType'
            type='text'
            fullWidth
            variant='standard'
            value={formData?.valueType}
          />
          <TextField
            margin='dense'
            id='defaultValue'
            label='Default Value'
            name='defaultValue'
            type='text'
            fullWidth
            variant='standard'
            value={formData?.defaultValue || ''}
            onChange={(event) => {
              setFormData(prevState => ({
                ...prevState,
                defaultValue: event.target.value
              }))
            }}
          />
          <FormGroup>
            <FormControlLabel
              label='Required'
              sx={{ marginLeft: '0px' }}
              onClick={(event) => {
                setFormData(prevState => ({
                  ...prevState,
                  required: event.target.checked
                }))
              }}
              control={
                <Checkbox
                  id='required'
                  name='required'
                />
              }
            />
          </FormGroup>
          <FormGroup>
            <FormControlLabel
              label='Hidden'
              sx={{ marginLeft: '0px' }}
              onClick={(event) => {
                setFormData(prevState => ({
                  ...prevState,
                  hidden: event.target.checked
                }))
              }}
              control={
                <Checkbox
                  id='hidden'
                  name='hidden'
                />
              }
            />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            variant='contained'
            type='submit'
            disabled={!!hasError || !formData.name}
          >Save</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
