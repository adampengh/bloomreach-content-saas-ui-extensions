import React, { useContext, useEffect, useState } from 'react';
import SidebarLayout from 'src/layouts/SidebarLayout';

// API
import {
  getAllProjects
} from 'api'

// Components
import CreateProjectModal from 'src/components/CreateProjectModal';
import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import {
  Alert,
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
  Typography,
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';

// Contexts
import { ConfigurationContext } from 'src/contexts/ConfigurationContext';

// Icons
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

function Configuration() {
  const {
    appConfiguration,
    storeApplicationConfiguration,
  } = useContext(ConfigurationContext)

  const [showModal, setShowModal] = useState(false);
  const [showCreateSourceProjectModal, setShowCreateSourceProjectModal] = useState(false)
  const [showCreateTargetProjectModal, setShowCreateTargetProjectModal] = useState(false)

  const [sourceConfig, setSourceConfig] = useState(appConfiguration.source)
  const [targetConfig, setTargetConfig] = useState(appConfiguration.target)

  const [sourceDeveloperProjects, setSourceDeveloperProjects] = useState([])
  const [targetDeveloperProjects, setTargetDeveloperProjects] = useState([])

  const [snackPack, setSnackPack] = useState([]);
  const [open, setOpen] = useState(false);
  const [messageInfo, setMessageInfo] = useState(undefined);
  const [messageSeverity, setMessageSeverity] = useState('success')

  useEffect(() => {
    setSourceConfig(appConfiguration.source)
    setTargetConfig(appConfiguration.target)

    if (appConfiguration.source?.environment && appConfiguration.source?.xAuthToken) {
      getAllProjects(appConfiguration.source?.environment, appConfiguration?.source?.xAuthToken)
        .then(response => {
          setSourceDeveloperProjects(response.data)
        })
        .catch((error) => {
          // console.error('Error fetching source projects:', error)
          const message = error.message
          setMessageSeverity('error')
          setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
        })
    }

    if (appConfiguration.target?.environment && appConfiguration.target?.xAuthToken) {
      getAllProjects(appConfiguration.target?.environment, appConfiguration?.target?.xAuthToken)
        .then(response => {
          setTargetDeveloperProjects(response.data)
        })
        .catch((error) => {
          // console.error('Error fetching target projects:', error.toJSON())
          const message = error.message
          setMessageSeverity('error')
          setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
        })
    }
  }, [appConfiguration])

  useEffect(() => {
    if (snackPack.length && !messageInfo) {
      // Set a new snack when we don't have an active one
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (snackPack.length && messageInfo && open) {
      // Close an active snack when a new one is added
      setOpen(false);
    }
  }, [snackPack, messageInfo, open])

  const handleSwapEnvironments = () => {
    const source = sourceConfig
    const target = targetConfig
    setSourceConfig(target)
    setTargetConfig(source)
    storeApplicationConfiguration({
      ...appConfiguration,
      source: target,
      target: source,
    })
  }

  const handleSourceProjectIdClick = () => {
    if (appConfiguration?.source?.environment && appConfiguration?.source?.xAuthToken) {
      getAllProjects(appConfiguration.source.environment, appConfiguration?.source?.xAuthToken)
        .then(response => {
          setSourceDeveloperProjects(response.data)
        })
        .catch((error) => {
          setMessageSeverity('error')
          setMessageInfo(error.message)
        })
    }
  }

  const handleTargetProjectIdClick = () => {
    if (appConfiguration?.target?.environment && appConfiguration?.target?.xAuthToken) {
      getAllProjects(appConfiguration.target.environment, appConfiguration?.target?.xAuthToken)
        .then(response => {
          setTargetDeveloperProjects(response.data)
        })
        .catch((error) => {
          setMessageSeverity('error')
          setMessageInfo(error.message)
        })
    }
  }

  const handleSubmitSourceChannel = (event) => {
    event.preventDefault();
    storeApplicationConfiguration({
      ...appConfiguration,
      source: sourceConfig,
    })

    const message = 'Source Configuration Saved'
    setMessageSeverity('success')
    setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
  }

  const handleSubmitTargetChannel = (event) => {
    event.preventDefault();
    storeApplicationConfiguration({
      ...appConfiguration,
      target: targetConfig,
    })

    const message = 'Target Configuration Saved'
    setMessageSeverity('success')
    setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
  }

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };

  const handleExited = () => {
    setMessageInfo(undefined);
  };

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
                    { appConfiguration.source?.environment && appConfiguration.source?.xAuthToken &&
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
            alignItem='flex-start'
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
                    { appConfiguration.target?.environment && appConfiguration.target?.xAuthToken &&
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
                        onMouseDown={handleTargetProjectIdClick}
                        variant="outlined"
                        sx={{ m: 1, minWidth: 240, marginTop: 3 }}
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
                        <Grid item sx={{ fm: 1, marginTop: 3 }}>
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

      <Snackbar
        key={messageInfo ? messageInfo.key : undefined}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        TransitionProps={{ onExited: handleExited }}
        sx={{ zIndex: 1000 }}
      >
        <Alert
          onClose={handleClose}
          variant="filled"
          severity={messageSeverity}
          sx={{ width: '100%', boxShadow: '2px 2px 4px rgba(0, 0, 0, 0.3)' }}
        >
          {messageInfo?.message}
        </Alert>
      </Snackbar>
    </>
  );
}

Configuration.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Configuration;
