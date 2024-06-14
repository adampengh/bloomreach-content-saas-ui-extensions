import React, { useContext, useEffect, useState } from 'react'

// API
import {
  getAllChannels,
  getMenu,
  putMenu,
  getMenuItems,
  putMenuItems,
  getMenuProperties,
  putMenuProperties,
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
  Typography,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'

// Contexts
import { ConfigurationContext, ErrorContext } from 'src/contexts'

// Icons
import { CloseIcon } from 'src/icons'


export default function CopyMenusModal({
  showCopyModal,
  setShowCopyModal,
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
    setShowCopyModal(false)
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
      for await (const menu of selectedItems) {
        console.log('copy menu', menu, 'to channel', channel.id)

        // ================================================
        // Copy Menu
        // ================================================
        // Check if Menu exists in destination channel
        const xResourceVersion = await getMenu(
          appConfiguration?.environments?.[selectedEnvironment]?.environment,
          appConfiguration?.environments?.[selectedEnvironment]?.xAuthToken,
          channel.id,
          menu
        )
          .then(response => {
            console.log('Check for Existing Menu Success', response.headers)
            return response.headers['x-resource-version']
          })
          .catch(error => console.error('Get Menu Error', error.message))

        // Get Menu
        const menuData = await getMenu(
          appConfiguration?.environments?.source?.environment,
          appConfiguration?.environments?.source?.xAuthToken,
          channelId,
          menu
        )
          .then(response => {
            console.log('Get Menu Success', response.headers)
            return response.data
          })
          .catch(error => console.error('Get Menu Error', error.message))
        console.log('menuData', menuData)
        console.log('xResourceVersion', xResourceVersion)

        // Put Menu
        if (menuData) {
          await putMenu(
            appConfiguration?.environments?.[selectedEnvironment]?.environment,
            appConfiguration?.environments?.[selectedEnvironment]?.xAuthToken,
            channel.id,
            menu,
            menuData,
            xResourceVersion
          )
            .then(() => console.log('Put Menu Success'))
            .catch(error => console.error('Put Menu Error', error))
        }

        // ================================================
        // Copy Menu Items
        // ================================================
        // Get Menu Items
        const menuItemsData = await getMenuItems(
          appConfiguration?.environments?.source?.environment,
          appConfiguration?.environments?.source?.xAuthToken,
          channelId,
          menu
        )
          .then(response => {
            console.log('Get Menu Items Success', response.headers)
            return response.data
          })
          .catch(error => console.error('Get Menu Items Error', error.message))
        console.log('menuItemsData', menuItemsData)


        // Check if Menu Items exists in destination channel
        // If so, store X-Resource-Version header value
        const xResourceVersionMenuItems = await getMenuItems(
          appConfiguration?.environments?.[selectedEnvironment]?.environment,
          appConfiguration?.environments?.[selectedEnvironment]?.xAuthToken,
          channel.id,
          menu
        )
          .then(response => {
            console.log('Check for Existing Menu Items Success', response.headers)
            return response.headers['x-resource-version']
          })
          .catch(error => console.error('Get Menu Items Error', error.message))


        // Put Menu Items
        if (menuItemsData) {
          await console.log('xResourceVersionMenuItems', xResourceVersionMenuItems)
          await putMenuItems(
            appConfiguration?.environments?.[selectedEnvironment]?.environment,
            appConfiguration?.environments?.[selectedEnvironment]?.xAuthToken,
            channel.id,
            menu,
            menuItemsData,
            xResourceVersionMenuItems
          )
            .then(() => console.log('Put Menu Items Success'))
            .catch(error => console.error('Put Menu Items Error', error))
        }

        // ================================================
        // Copy Menu Properties
        // ================================================
        // Get Menu Properties
        const menuPropertiesData = await getMenuProperties(
          appConfiguration?.environments?.source?.environment,
          appConfiguration?.environments?.source?.xAuthToken,
          channelId,
          menu
        )
          .then(response => {
            console.log('Get Menu Success', response.headers)
            return response.data
          })
          .catch(error => console.error('Get Menu Error', error.message))
        console.log('menuItemsData', menuItemsData)

        // Check if Menu Properties exists in destination channel
        const xResourceVersionMenuProperties = await getMenuProperties(
          appConfiguration?.environments?.[selectedEnvironment]?.environment,
          appConfiguration?.environments?.[selectedEnvironment]?.xAuthToken,
          channel.id,
          menu
        )
          .then(response => {
            console.log('Check for Existing Menu Success', response.headers)
            return response.headers['x-resource-version']
          })
          .catch(error => console.error('Get Menu Error', error.message))

        // Put Menu Properties
        if (menuPropertiesData) {
          await putMenuProperties(
            appConfiguration?.environments?.[selectedEnvironment]?.environment,
            appConfiguration?.environments?.[selectedEnvironment]?.xAuthToken,
            channel.id,
            menu,
            menuPropertiesData,
            xResourceVersionMenuProperties
          )
            .then(() => console.log('Put Menu Properties Success'))
            .catch(error => console.error('Put Menu Properties Error', error))
        }
      }
    }

    await setIsProcessing(false)
    await handleShowSnackbar('success', 'Menus Copied')
    await setChecked([])
    await setSelectedItems([])
    await setShowCopyModal(false)
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
      open={showCopyModal}
      onClose={handleClose}
    >
      <Box
        component='form'
        sx={{
          '& .MuiTextField-root': { m: 1, width: '100%' }
        }}
        autoComplete='off'
        onSubmit={handleCopyItems}
      >
        <DialogTitle>
          <Typography variant='h3' sx={{ fontWeight: 'bold' }}>Copy Confirmation</Typography>
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
          <DialogContentText>
            <p>Menus to Copy ({selectedItems.length}):</p>
            <ul>
              {selectedItems.map(component => (
                <li key={component}>{component}</li>
              ))}
            </ul>
            <FormControl
              required
              variant='outlined'
              sx={{ m: 1, width: '100%', marginTop: 3 }}
            >
              <InputLabel id='targetProjectId'>Environment</InputLabel>
              <Select

                id='environment'
                labelId='Environment'
                label='Environment'
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
            Copy Menus
          </LoadingButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
