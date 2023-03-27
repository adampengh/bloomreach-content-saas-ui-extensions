import React, { useContext, useEffect, useState } from 'react';
import SidebarLayout from 'src/layouts/SidebarLayout';

// API
import {
  getAllProjects
} from 'api'

// Components
import CreateProjectModal from 'components/CreateProjectModal';
import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';

// Contexts
import { ConfigurationContext } from 'src/contexts/ConfigurationContext';
import { ErrorContext } from 'src/contexts/ErrorContext';

// Icons
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

function Configuration() {
  // Context
  const {
    appConfiguration,
    storeApplicationConfiguration,
  } = useContext(ConfigurationContext)
  const { handleShowSnackbar } = useContext(ErrorContext)

  // State
  const [showModal, setShowModal] = useState(false);
  const [showCreateSourceProjectModal, setShowCreateSourceProjectModal] = useState(false)
  const [showCreateTargetProjectModal, setShowCreateTargetProjectModal] = useState(false)

  const [sourceConfig, setSourceConfig] = useState(appConfiguration?.environments?.source)
  const [targetConfig, setTargetConfig] = useState(appConfiguration?.environments?.target)

  const [sourceDeveloperProjects, setSourceDeveloperProjects] = useState([])
  const [targetDeveloperProjects, setTargetDeveloperProjects] = useState([])

  useEffect(() => {
    setSourceConfig(appConfiguration.environments?.source)
    setTargetConfig(appConfiguration.environments?.target)

    if (appConfiguration.environments?.source?.environment && appConfiguration.environments?.source?.xAuthToken) {
      getAllProjects(appConfiguration.environments?.source?.environment, appConfiguration?.environments?.source?.xAuthToken)
        .then(response => {
          setSourceDeveloperProjects(response.data)
        })
        .catch((error) => {
          handleShowSnackbar('error', error.message)
        })
    }

    if (appConfiguration.environments?.target?.environment && appConfiguration.environments?.target?.xAuthToken) {
      getAllProjects(appConfiguration.environments?.target?.environment, appConfiguration?.environments?.target?.xAuthToken)
        .then(response => {
          setTargetDeveloperProjects(response.data)
        })
        .catch((error) => {
          handleShowSnackbar('error', error.message)
        })
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

  const handleSourceProjectIdClick = () => {
    if (appConfiguration?.environments?.source?.environment && appConfiguration?.environments?.source?.xAuthToken) {
      getAllProjects(appConfiguration.environments?.source.environment, appConfiguration?.environments?.source?.xAuthToken)
        .then(response => {
          setSourceDeveloperProjects(response.data)
        })
        .catch((error) => {
          handleShowSnackbar('error', error.message)
        })
    }
  }

  const handleTargetProjectIdClick = () => {
    if (appConfiguration?.environments?.target?.environment && appConfiguration?.environments?.target?.xAuthToken) {
      getAllProjects(appConfiguration.environments?.target.environment, appConfiguration?.environments?.target?.xAuthToken)
        .then(response => {
          setTargetDeveloperProjects(response.data)
        })
        .catch((error) => {
          handleShowSnackbar('error', error.message)
        })
    }
  }

  const handleSubmitSourceChannel = (event) => {
    event.preventDefault();
    storeApplicationConfiguration({
      ...appConfiguration,
      environments: {
        source: sourceConfig,
        target: appConfiguration.environments.target
      }
    })

    handleShowSnackbar('success', 'Source Configuration Saved')
  }

  const handleSubmitTargetChannel = (event) => {
    event.preventDefault();
    storeApplicationConfiguration({
      ...appConfiguration,
      environments: {
        source: appConfiguration.environments.source,
        target: targetConfig,
      }
    })

    handleShowSnackbar('success', 'Target Configuration Saved')
  }

  const handleShowModal = (environment) => {
    if (environment === 'source') {
      setShowCreateSourceProjectModal(true)
    }
    if (environment === 'target') {
      setShowCreateTargetProjectModal(true)
    }
    setShowModal(true)
  }
  return (
    <>
      <PageTitleWrapper>
        <PageTitle
          heading="Configuration"
          subHeading="Configuration used throughout the application"
        />
      </PageTitleWrapper>
      <Container maxWidth="xl">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={5}>
            <Card>
              <CardHeader title="Source Environment" />
              <Divider />
              <CardContent>
                <Box
                  component="form"
                  sx={{
                    '& .MuiTextField-root': { m: 1, width: '90%' }
                  }}
                  noValidate
                  autoComplete="off"
                  onSubmit={handleSubmitSourceChannel}
                >
                  <div>
                    <TextField
                      required
                      autoComplete="off"
                      id="environment"
                      name="environment"
                      label="Environment"
                      helperText="https://<environment>.bloomreach.io"
                      value={sourceConfig?.environment || ''}
                      onChange={(e) => setSourceConfig({...sourceConfig, environment: e.target.value})}
                    />
                    <TextField
                      required
                      autoComplete="off"
                      id="xAuthToken"
                      name="xAuthToken"
                      label="X-Auth-Token"
                      value={sourceConfig?.xAuthToken || ''}
                      onChange={(e) => setSourceConfig({...sourceConfig, xAuthToken: e.target.value})}
                    />
                    { appConfiguration.environments?.source?.environment && appConfiguration.environments?.source?.xAuthToken &&
                      <Grid
                        container
                        direction="row"
                        justifyContent="space-between"
                        alignItems="stretch"
                        spacing={3}
                        sx={{ width: '100%' }}
                      >
                        <Grid item>
                          <FormControl
                            onMouseDown={handleSourceProjectIdClick}
                            variant="outlined"
                            sx={{ m: 1, minWidth: 160, marginTop: 3 }}
                          >
                            <InputLabel id="sourceProjectId">Project ID</InputLabel>
                            <Select
                              id="sourceProjectId"
                              labelId="sourceProjectId"
                              label="Source Project ID"
                              value={sourceConfig?.projectId || 'core'}
                              onChange={(e) => setSourceConfig({...sourceConfig, projectId: e.target.value})}
                            >
                              <MenuItem value='core'><strong>Core</strong></MenuItem>
                              <Divider />
                              {sourceDeveloperProjects.map(project => (
                                <MenuItem key={project.id} value={project.id}>
                                  {project.name} ({project.id})
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item sx={{ m: 1, marginTop: 3 }}>
                          <Button
                            sx={{ margin: 1 }}
                            variant="outlined"
                            onClick={() => handleShowModal('source')}
                          >
                            Create New Project
                          </Button>
                        </Grid>
                      </Grid>
                    }
                  </div>
                  <div>
                    <Button
                      sx={{ margin: 1 }}
                      variant="contained"
                      type="submit"
                    >
                      Save
                    </Button>
                  </div>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item
            display='flex'
            justifyContent='center'
            alignContent='flex-start'
            alignItems='flex-start'
            xs={2}
            sx={{
              '&.MuiGrid-item': {
                width: '100%',
                height: '140px',
                paddingTop: '4rem',
                textAlign: 'center'
              }
            }}
          >
            <Button
              variant="contained"
              startIcon={<SwapHorizIcon />}
              sx={{
                display: 'flex',
                flexDirection: 'column',
              }}
              onClick={handleSwapEnvironments}
            >
              Swap Environments
            </Button>
          </Grid>

          <Grid item xs={5}>
            <Card>
              <CardHeader title="Target Environment" />
              <Divider />
              <CardContent>
                <Box
                  component="form"
                  sx={{
                    '& .MuiTextField-root': { m: 1, width: '90%' }
                  }}
                  noValidate
                  autoComplete="off"
                  onSubmit={handleSubmitTargetChannel}
                >
                  <div>
                    <TextField
                      autoComplete="off"
                      name="environment"
                      label="Environment"
                      helperText="https://<environment>.bloomreach.io"
                      value={targetConfig?.environment || ''}
                      onChange={(e) => setTargetConfig({...targetConfig, environment: e.target.value})}
                    />
                    <TextField
                      autoComplete="off"
                      name="xAuthToken"
                      label="X-Auth-Token"
                      value={targetConfig?.xAuthToken || ''}
                      onChange={(e) => setTargetConfig({...targetConfig, xAuthToken: e.target.value})}
                    />
                    { appConfiguration.environments?.target?.environment && appConfiguration.environments?.target?.xAuthToken &&
                    <Grid
                      container
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      alignContent="center"
                      rowSpacing={3}
                      sx={{ width: '100%' }}
                    >
                      <Grid
                        item
                        display="flex"
                        flexDirection="row"
                        alignContent="center"
                        alignItems="center"
                        sx={{ marginTop: 3 }}
                      >
                        <FormControl
                          onMouseDown={handleTargetProjectIdClick}
                          variant="outlined"
                          sx={{ ml: 1, minWidth: 240 }}
                        >
                          <InputLabel id="targetProjectId">Project ID</InputLabel>
                          <Select
                            id="targetProjectId"
                            labelId="targetProjectId"
                            label="Target Project ID"
                            value={targetConfig?.projectId || ''}
                            onChange={(e) => setTargetConfig({...targetConfig, projectId: e.target.value})}
                          >
                            {targetDeveloperProjects.map(project => (
                              <MenuItem key={project.id} value={project.id}>
                                {project.name} ({project.id})
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        </Grid>
                        <Grid item>
                          <Button
                            sx={{ margin: 1 }}
                            variant="outlined"
                            onClick={() => handleShowModal('target')}
                          >
                            Create New Project
                          </Button>
                        </Grid>
                      </Grid>
                    }
                  </div>
                  <div>
                    <Button
                      sx={{ margin: 1 }}
                      variant="contained"
                      type="submit"
                    >
                      Save
                    </Button>
                  </div>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      { showCreateSourceProjectModal &&
        <CreateProjectModal
          showModal={showModal}
          setShowModal={setShowModal}
          projects={sourceDeveloperProjects}
          environment={sourceConfig?.environment}
          xAuthToken={sourceConfig?.xAuthToken}
        />
      }
      { showCreateTargetProjectModal &&
        <CreateProjectModal
          showModal={showModal}
          setShowModal={setShowModal}
          projects={targetDeveloperProjects}
          environment={targetConfig?.environment}
          xAuthToken={targetConfig?.xAuthToken}
        />
      }
    </>
  );
}

Configuration.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Configuration;
