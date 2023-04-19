import React, { useContext, useEffect, useState } from 'react'

// API
import {
  getAllChannels,
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
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'

// Contexts
import { ConfigurationContext } from 'src/contexts/ConfigurationContext';
import { ErrorContext } from 'src/contexts/ErrorContext';

export default function CopyContentTypeModal({
  showCopyModal,
  setShowCopyModal,
  selectedRows,
  setSelectedRows,
  // channelId,
}) {
  // Context
  const { appConfiguration } = useContext(ConfigurationContext)
  const { handleShowSnackbar } = useContext(ErrorContext)

  const [selectedEnvironment, setSelectedEnvironment] = useState('source')
  const [channels, setChannels] = useState([])
  const [checked, setChecked] = useState([]);

  // useEffect(() => {
  //   getAllDeveloperChannels(appConfiguration.environments?.[selectedEnvironment]?.environment, appConfiguration.environments?.[selectedEnvironment]?.xAuthToken)
  //     .then((response) => {
  //       const data = response.data.filter(channel => channel.branch === appConfiguration.environments?.[selectedEnvironment]?.projectId)
  //       setChannels(data)
  //     })
  //     .catch((error) => {
  //       console.error('error', error.message)
  //     })
  // }, [selectedEnvironment])

  const handleClose = () => {
    setShowCopyModal(false)
  };

  const handleEnvironmentChange = (event) => {
    // event.preventDefault()
    // setSelectedEnvironment(event.target.value)

    // getAllDeveloperChannels(appConfiguration.environments?.[event.target.value]?.environment, appConfiguration.environments?.[event.target.value]?.xAuthToken)
    //   .then((response) => {
    //     const data = response.data.filter(channel => channel.branch === appConfiguration.environments?.[event.target.value]?.projectId)
    //     setChannels(data)
    //   })
    //   .catch((error) => {
    //     console.error('error', error.message)
    //   })
  }

  const handleCopyComponents = async (event) => {
    // event.preventDefault()
    // console.log('handleCopyComponents', selectedRows)
    // console.log('selectedEnvironment', selectedEnvironment)
    // console.log('checked', checked)

    // for await (const channel of checked) {
    //   for await (const component of selectedRows) {
    //     console.log('copy component', component, 'to channel', channel.id)
    //     const componentGroup = component.split('/')[0]
    //     console.log('componentGroup', componentGroup)
    //     const componentName = component.split('/')[1]
    //     console.log('componentName', componentName)

    //     // Check if component exists in destination channel
    //     const xResourceVersion = await getComponent(
    //       appConfiguration?.environments?.[selectedEnvironment]?.environment,
    //       appConfiguration?.environments?.[selectedEnvironment]?.xAuthToken,
    //       channel.id,
    //       componentGroup,
    //       componentName
    //     )
    //       .then(response => {
    //         console.log('Check for Existing Component Success', response.headers)
    //         return response.headers['x-resource-version']
    //       })
    //       .catch(error => console.error('Get Component Error', error.message))

    //     // Get component
    //     const componentData = await getComponent(
    //       appConfiguration?.environments?.source?.environment,
    //       appConfiguration?.environments?.source?.xAuthToken,
    //       channelId,
    //       componentGroup,
    //       componentName
    //     )
    //       .then(response => {
    //         console.log('Get Component Success', response.headers)
    //         return response.data
    //       })
    //       .catch(error => console.error('Get Component Error', error.message))
    //     console.log('componentData', componentData)
    //     console.log('xResourceVersion', xResourceVersion)

    //     // Put component
    //     if (componentData) {
    //       await putComponent(
    //         appConfiguration?.environments?.[selectedEnvironment]?.environment,
    //         appConfiguration?.environments?.[selectedEnvironment]?.xAuthToken,
    //         channel.id,
    //         componentGroup,
    //         componentName,
    //         componentData,
    //         xResourceVersion
    //       )
    //         .then(response => {
    //           console.log('Put Component Success')
    //         })
    //         .catch(error => console.error('Put Component Error', error))
    //     }
    //   }
    // }

    // await handleShowSnackbar('success', 'Components Coppied')
    // await setChecked([])
    // await setSelectedRows([])
    // await setShowCopyModal(false)
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
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '100%' }
        }}
        autoComplete="off"
        onSubmit={handleCopyComponents}
      >
        <DialogTitle>Copy Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>
            <p>Components to Copy ({selectedRows.length}):</p>
            <ul>
              {selectedRows.map(component => (
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
          <Button
            variant="contained"
            type="submit"
          >Copy Components</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
