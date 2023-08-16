import React, { useContext, useState } from 'react'

// API
import {
  getContentType,
  putContentType,
} from 'api'

// Components
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'
import {
  LoadingButton,
 } from '@mui/lab';

// Contexts
import { ConfigurationContext } from 'src/contexts/ConfigurationContext';
import { ErrorContext } from 'src/contexts/ErrorContext';


export default function CopyContentTypeModal({
  showModal,
  setShowModal,
  selectedRows,
  setSelectedRows,
  contentTypes,
  dependencyGraph,
}) {
  // State
  const [isProcessing, setIsProcessing] = useState(false)

  // Context
  const { appConfiguration } = useContext(ConfigurationContext)
  const { handleShowSnackbar } = useContext(ErrorContext)

  const handleClose = () => {
    setShowModal(false)
  };

  const handleCopyContentTypes = async (event) => {
    event.preventDefault()
    await setIsProcessing(true)

    // Get all content types and dependencies
    // Flatten the array of arrays
    const contentTypeAndDependencies = selectedRows.map(selectedRow => {
      return [...dependencyGraph.dependantsOf(selectedRow), selectedRow]
    }).flat()

    // Get all content types to copy and ensure the order is correct based on
    // the full dependency graph
    const contentTypesToCopy = dependencyGraph.overallOrder()
      .filter(contentType => contentTypeAndDependencies.includes(contentType))
      .reverse()

    // Copy content types
    for await (const contentType of contentTypesToCopy) {
      console.log('copy Content Type', contentType, 'to Target Environment')

      // Check if content type exists in target environment
      const xResourceVersion = await getContentType(
        appConfiguration?.environments?.target?.environment,
        appConfiguration?.environments?.target?.xAuthToken,
        contentType
      )
        .then(response => {
          console.log('Check for Existing Content Type Success', response.headers)
          return response.headers['x-resource-version']
        })
        .catch(error => console.error('Get Content Type Error', error.message))

      // Get content type
      const data = await getContentType(
        appConfiguration?.environments?.source?.environment,
        appConfiguration?.environments?.source?.xAuthToken,
        contentType
      )
        .then(response => {
          console.log('Get Content Type Success', response.headers)
          return response.data
        })
        .catch(error => console.error('Get Content Type Error', error.message))
      console.log('data', data)
      console.log('xResourceVersion', xResourceVersion)

      // Put component
      if (data) {
        await putContentType(
          appConfiguration?.environments?.target?.environment,
          appConfiguration?.environments?.target?.xAuthToken,
          contentType,
          data,
          xResourceVersion
        )
          .then(response => {
            console.log('Put Content Type Success')
          })
          .catch(error => console.error('Put Content Type Error', error))
      }
    }

    await setIsProcessing(false)
    await handleShowSnackbar('success', 'Content Type(s) Copied')
    await setSelectedRows([])
    await setShowModal(false)
  }

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
        onSubmit={handleCopyContentTypes}
      >
        <DialogTitle>Copy Confirmation</DialogTitle>
        <DialogContent>
          <p>Content Types to Copy:</p>
          <ul>
            {selectedRows.map(contentType => (
              <>
                <li key={contentType} style={{fontWeight: 700, lineHeight: 2}}>{contentType} ({dependencyGraph?.dependantsOf(contentType)?.length} dependencies)</li>
                {dependencyGraph.dependantsOf(contentType).length > 0 && (
                  <ul>
                    {dependencyGraph?.dependantsOf(contentType)?.map(dependant =>
                      <li key={dependant}>{dependant}</li>
                    )}
                  </ul>
                )}
              </>
            ))}
          </ul>

          <FormControl
            required
            variant="outlined"
            sx={{ m: 1, width: '100%', marginTop: 3 }}
          >
            <InputLabel id="targetProjectId">Environment</InputLabel>
            <Select
              disabled
              id="environment"
              labelId="Environment"
              label="Environment"
              value={'target'}
            >
              <MenuItem key={0} value={'target'}>
                {appConfiguration?.environments?.target?.environment} (Target)
              </MenuItem>
            </Select>
          </FormControl>
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
            Copy
          </LoadingButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
