import React, { useContext, useEffect, useState } from 'react'

// API
import {
  createComponentGroup,
  getAllChannels,
  getAllComponentGroups,
  getComponent,
  putComponent,
} from 'api'

// Components
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'
import { LoadingButton } from '@mui/lab';

// Contexts
import { ConfigurationContext } from 'src/contexts/ConfigurationContext';
import { ErrorContext } from 'src/contexts/ErrorContext';

// Icons
import CloseIcon from '@mui/icons-material/Close';

export default function CopyComponentModal({
  showCopyComponentsModal,
  setShowCopyComponentsModal,
  selectedComponents,
  setSelectedComponents,
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
      .catch((error) => console.error('error', error.message))
  }, [selectedEnvironment])

  const handleClose = () => {
    setShowCopyComponentsModal(false)
  };

  const handleEnvironmentChange = (event) => {
    event.preventDefault()
    setSelectedEnvironment(event.target.value)

    getAllChannels(appConfiguration.environments?.[event.target.value]?.environment, appConfiguration.environments?.[event.target.value]?.xAuthToken)
      .then((response) => {
        const data = response.data.filter(channel => channel.branch === appConfiguration.environments?.[event.target.value]?.projectId)
        setChannels(data)
      })
      .catch((error) => console.error('error', error.message))
  }

  const handleCopyComponents = async (event) => {
    event.preventDefault()
    await setIsProcessing(true)

    // Loop through selected channels
    for await (const channel of checked) {
      // Get all Component Groups in target channel
      let componentGroups = await getAllComponentGroups(
        appConfiguration?.environments?.[selectedEnvironment]?.environment,
        appConfiguration?.environments?.[selectedEnvironment]?.xAuthToken,
        channel.id
      )
        .then(response => response.data)
        .catch(error => console.error(error))

      // Loop through selected components
      for await (const component of selectedComponents) {
        console.log('copy component', component, 'to channel', channel.id)
        const componentGroup = component.split('/')[0]
        const componentName = component.split('/')[1]

        // Check if Component Group exists, if not, create a new Component Group
        if (!componentGroups.find(group => group.name === componentGroup)) {
          await createComponentGroup(
            appConfiguration?.environments?.[selectedEnvironment]?.environment,
            appConfiguration?.environments?.[selectedEnvironment]?.xAuthToken,
            channel.id,
            componentGroup,
            {
              name: componentGroup,
              hidden: "false",
              system: "false"
            })
            .then(response => {
              console.log('createComponentGroup', response)
              componentGroups = [...componentGroups, {
                name: componentGroup,
                hidden: "false",
                system: "false"
              }]
            })
            .catch(error => console.error('Error creating component group', error))
        }

        // Check if component exists in destination channel
        const xResourceVersion = await getComponent(
          appConfiguration?.environments?.[selectedEnvironment]?.environment,
          appConfiguration?.environments?.[selectedEnvironment]?.xAuthToken,
          channel.id,
          componentGroup,
          componentName
        )
          .then(response => {
            console.log('Check for Existing Component Success', response.headers)
            return response.headers['x-resource-version']
          })
          .catch(error => console.error('Get Component Error', error.message))

        // Get component
        const componentData = await getComponent(
          appConfiguration?.environments?.source?.environment,
          appConfiguration?.environments?.source?.xAuthToken,
          channelId,
          componentGroup,
          componentName
        )
          .then(response => {
            console.log('Get Component Success', response.headers)
            return response.data
          })
          .catch(error => console.error('Get Component Error', error))
        console.log('componentData', componentData)
        console.log('xResourceVersion', xResourceVersion)

        // Put component
        if (componentData) {
          await putComponent(
            appConfiguration?.environments?.[selectedEnvironment]?.environment,
            appConfiguration?.environments?.[selectedEnvironment]?.xAuthToken,
            channel.id,
            componentGroup,
            componentName,
            componentData,
            xResourceVersion
          )
            .then(response => console.log('Put Component Success'))
            .catch(error => console.error('Put Component Error', error))
        }
      }
    }

    await setIsProcessing(false)
    await handleShowSnackbar('success', 'Components Copied')
    await setChecked([])
    await setSelectedComponents([])
    await setShowCopyComponentsModal(false)
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
      open={showCopyComponentsModal}
      onClose={handleClose}
    >
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '100%' }
        }}
        autoComplete="off"
        onSubmit={handleCopyComponents}
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
          <p>Components to Copy ({selectedComponents.length}):</p>
          <ul>
            {selectedComponents.map(component => (
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
              <MenuItem value={'source'}>
                {appConfiguration?.environments?.source?.environment} (Source)
              </MenuItem>
              <MenuItem value={'target'}>
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
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            disabled={isProcessing}
          >Cancel</Button>
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
            Copy Components
          </LoadingButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
