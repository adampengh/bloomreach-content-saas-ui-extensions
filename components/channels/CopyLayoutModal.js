import React, { useContext, useEffect, useState } from 'react'

// API
import {
  getAllChannels,
  getLayout,
  putLayout,
} from 'bloomreach-content-management-apis'

// Components
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'
import {
  LoadingButton
 } from '@mui/lab';

// Contexts
import { ConfigurationContext } from 'src/contexts/ConfigurationContext';
import { ErrorContext } from 'src/contexts/ErrorContext';

// Icons
import CloseIcon from '@mui/icons-material/Close';

export default function CopyLayoutModal({
  showModal,
  setShowModal,
  selectedItems,
  setSelectedItems,
  channelId,
}) {
  // State
  const [isProcessing, setIsProcessing] = useState(false)

  // Context
  const { appConfiguration } = useContext(ConfigurationContext)
  const { handleShowSnackbar } = useContext(ErrorContext)

  const [selectedEnvironment, setSelectedEnvironment] = useState('source')
  const [channels, setChannels] = useState([])
  const [checked, setChecked] = useState([]);

  useEffect(() => {
    getAllChannels(appConfiguration.environments?.[selectedEnvironment]?.environment, appConfiguration.environments?.[selectedEnvironment]?.xAuthToken)
      .then((response) => {
        const data = response.data.filter(channel => channel.branch === appConfiguration.environments?.[selectedEnvironment]?.projectId)
        setChannels(data)
      })
      .catch((error) => {
        console.error('error', error.message)
      })
  }, [selectedEnvironment])

  const handleClose = () => {
    setShowModal(false)
  };

  const handleEnvironmentChange = (event) => {
    event.preventDefault()
    setSelectedEnvironment(event.target.value)

    getAllChannels(appConfiguration.environments?.[event.target.value]?.environment, appConfiguration.environments?.[event.target.value]?.xAuthToken)
      .then((response) => {
        const data = response.data.filter(channel => channel.branch === appConfiguration.environments?.[event.target.value]?.projectId)
        setChannels(data)
      })
      .catch((error) => {
        console.error('error', error.message)
      })
  }

  const handleCopyItems = async (event) => {
    event.preventDefault()
    await setIsProcessing(true)
    console.log('handleCopyItems', selectedItems)
    console.log('selectedEnvironment', selectedEnvironment)
    console.log('checked', checked)

    for await (const channel of checked) {
      for await (const layout of selectedItems) {
        console.log('copy layout', layout, 'to channel', channel.id)

        // Check if layout exists in destination channel
        const xResourceVersion = await getLayout(
          appConfiguration?.environments?.[selectedEnvironment]?.environment,
          appConfiguration?.environments?.[selectedEnvironment]?.xAuthToken,
          channel.id,
          layout
        )
          .then(response => {
            console.log('Check for Existing Layout Success', response.headers)
            return response.headers['x-resource-version']
          })
          .catch(error => console.error('Get Layout Error', error.message))

        // Get Layout
        const layoutData = await getLayout(
          appConfiguration?.environments?.source?.environment,
          appConfiguration?.environments?.source?.xAuthToken,
          channelId,
          layout
        )
          .then(response => {
            console.log('Get Layout Success', response.headers)
            return response.data
          })
          .catch(error => console.error('Get Layout Error', error.message))
        console.log('layoutData', layoutData)
        console.log('xResourceVersion', xResourceVersion)

        // Put Layout
        if (layoutData) {
          await putLayout(
            appConfiguration?.environments?.[selectedEnvironment]?.environment,
            appConfiguration?.environments?.[selectedEnvironment]?.xAuthToken,
            channel.id,
            layout,
            layoutData,
            xResourceVersion
          )
            .then(response => {
              console.log('Put Layout Success')
            })
            .catch(error => console.error('Put Layout Error', error))
        }
      }
    }

    await setIsProcessing(false)
    await handleShowSnackbar('success', 'Layouts Copied')
    await setChecked([])
    await setSelectedItems([])
    await setShowModal(false)
  }

  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  return (
    <Dialog
      fullWidth={true}
      maxWidth={'sm'}
      open={showModal}
      onClose={handleClose}
    >
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '100%' }
        }}
        autoComplete="off"
        onSubmit={handleCopyItems}
      >
        <DialogTitle>
          Copy Confirmation
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
          <DialogContentText>
            <p>Layouts to Copy ({selectedItems.length}):</p>
            <ul>
              {selectedItems.map(component => (
                <li key={component}>{component}</li>
              ))}
            </ul>
            <FormControl
              required
              variant="outlined"
              sx={{ m: 1, width: '100%', marginTop: 3 }}
            >
              <InputLabel id="targetProjectId">Environment</InputLabel>
              <Select

                id="environment"
                labelId="Environment"
                label="Environment"
                value={selectedEnvironment}
                onChange={handleEnvironmentChange}
              >
                <MenuItem key={0} value={'source'}>
                  {appConfiguration?.environments?.source?.environment} (Source)
                </MenuItem>
                <MenuItem key={0} value={'target'}>
                  {appConfiguration?.environments?.target?.environment} (Target)
                </MenuItem>
              </Select>
            </FormControl>

            <FormGroup sx={{ m: 1, width: '100%', marginTop: 3 }}>
              <strong>Channels:</strong>
              {channels.map((channel, index) => {
                return (
                  <FormControlLabel
                    key={index}
                    onClick={handleToggle ? handleToggle(channel) : null}
                    control={ <Checkbox checked={checked.indexOf(channel) !== -1} /> }
                    label={channel.name} />
                )
              })}
            </FormGroup>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <LoadingButton
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
            Copy Layouts
          </LoadingButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
