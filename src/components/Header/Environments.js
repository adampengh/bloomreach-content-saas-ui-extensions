'use client'

import React, { useContext, useEffect, useState } from 'react';

// API
import {
  getAllProjects
} from 'bloomreach-content-management-apis'

// Components
import StatusIndicator from 'components/StatusIndicator';
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
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

const Environments = () => {
  // Context
  const {
    appConfiguration,
    storeApplicationConfiguration,
  } = useContext(ConfigurationContext)

  // State
  const [sourceConfig, setSourceConfig] = useState(appConfiguration?.environments?.source)
  const [targetConfig, setTargetConfig] = useState(appConfiguration?.environments?.target)

  const [sourceDeveloperProjects, setSourceDeveloperProjects] = useState([])
  const [targetDeveloperProjects, setTargetDeveloperProjects] = useState([])

  useEffect(() => {
    setSourceConfig(appConfiguration.environments?.source)
    setTargetConfig(appConfiguration.environments?.target)

    if (appConfiguration.environments?.source?.environment && appConfiguration.environments?.source?.xAuthToken) {
      getAllProjects(appConfiguration.environments?.source?.environment, appConfiguration?.environments?.source?.xAuthToken)
        .then(response => setSourceDeveloperProjects(response.data))
        .catch((error) => handleShowSnackbar('error', error.message))
    }

    if (appConfiguration.environments?.target?.environment && appConfiguration.environments?.target?.xAuthToken) {
      getAllProjects(appConfiguration.environments?.target?.environment, appConfiguration?.environments?.target?.xAuthToken)
        .then(response => setTargetDeveloperProjects(response.data))
        .catch((error) => handleShowSnackbar('error', error.message))
    }
  }, [appConfiguration])

  const handleSwapEnvironments = () => {
    const source = sourceConfig
    const target = targetConfig
    setSourceConfig(target)
    setTargetConfig(source)
    storeApplicationConfiguration({
      ...appConfiguration,
      environments: {
        source: target,
        target: source,
      }
    })
  }

  return (
    <>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '100%' }
        }}
        autoComplete="off"
        // onSubmit={handleCopyComponents}
      >
        <FormControl
          variant="outlined"
          sx={{ ml: 1, minWidth: 180 }}
        >
          <InputLabel id="activeEnvironmentDropdown">Active Environment</InputLabel>
          <Select
            id="activeEnvironmentDropdown"
            labelId="activeEnvironmentDropdown"
            label="Active Environment"
            value={sourceConfig?.projectId || ''}
            // onChange={(e) => setTargetConfig({...targetConfig, projectId: e.target.value})}
          >
            <MenuItem value='source'>Source</MenuItem>
            <MenuItem value='target'>Target</MenuItem>
            {/* {targetDeveloperProjects.map(project => (
              <MenuItem key={project.id} value={project.id}>
                {project.name} ({project.id})
              </MenuItem>
            ))} */}
          </Select>
        </FormControl>
      </Box>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '100%' }
        }}
        autoComplete="off"
        // onSubmit={handleCopyComponents}
      >
        <FormControl
          variant="outlined"
          sx={{ width: '100%', marginRight: 1 }}
        >
          <InputLabel id="sourceProjectId">Project ID</InputLabel>
          <Select
            id="sourceProjectId"
            labelId="sourceProjectId"
            label="Source Project ID"
            // value={config?.projectId || 'core'}
            onChange={(e) => setConfig({...config, projectId: e.target.value})}
          >
            <MenuItem value='core'><strong>Core</strong></MenuItem>
            <Divider />
            {/* {developerProjects.map(project => (
              <MenuItem key={project.id} value={project.id} sx={{ justifyContent: 'space-between', fontWeight: 'bold' }}>
                {project.name}
                <StatusIndicator status={project.state.status} message={project.state.message} />
              </MenuItem>
            ))} */}
          </Select>
        </FormControl>
      </Box>
    </>
  )
}

export default Environments
