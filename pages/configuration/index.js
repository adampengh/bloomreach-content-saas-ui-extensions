import React, { useContext, useEffect, useState } from 'react';
import SidebarLayout from 'src/layouts/SidebarLayout';

// API
import { getAllProjects } from 'api'

// Components
import CreateProjectModal from './CreateProjectModal';
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
  InputLabel,
  MenuItem,
  Grid,
  Select,
  TextField,
} from '@mui/material';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

// Contexts
import { ConfigurationContext } from 'src/contexts/ConfigurationContext';


function Configuration() {
  const {
    appConfiguration,
    storeApplicationConfiguration,
  } = useContext(ConfigurationContext)

  const [showCreateProjectModal, setShowCreateProjectModal] = useState(false);

  const [sourceConfig, setSourceConfig] = useState(appConfiguration.source)
  const [targetConfig, setTargetConfig] = useState(appConfiguration.target)

  const [sourceDeveloperProjects, setSourceDeveloperProjects] = useState([])
  const [targetDeveloperProjects, setTargetDeveloperProjects] = useState([])

  const [snackPack, setSnackPack] = useState([]);
  const [open, setOpen] = useState(false);
  const [messageInfo, setMessageInfo] = React.useState(undefined);

  useEffect(() => {
    setSourceConfig(appConfiguration.source)
    setTargetConfig(appConfiguration.target)

    if (appConfiguration.source?.environment && appConfiguration.source?.xAuthToken) {
      getAllProjects(appConfiguration.source?.environment, appConfiguration?.source?.xAuthToken)
        .then(response => {
          setSourceDeveloperProjects(response.data)
        })
    }

    if (appConfiguration.target?.environment && appConfiguration.target?.xAuthToken) {
      getAllProjects(appConfiguration.target?.environment, appConfiguration?.target?.xAuthToken)
        .then(response => {
          setTargetDeveloperProjects(response.data)
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

  const handleSourceProjectIdClick = () => {
    if (appConfiguration?.source?.environment && appConfiguration?.source?.xAuthToken) {
      getAllProjects(appConfiguration.source.environment, appConfiguration?.source?.xAuthToken)
        .then(response => {
          setSourceDeveloperProjects(response.data)
        })
    }
  }

  const handleTargetProjectIdClick = () => {
    if (appConfiguration?.target?.environment && appConfiguration?.target?.xAuthToken) {
      getAllProjects(appConfiguration.target.environment, appConfiguration?.target?.xAuthToken)
        .then(response => {
          setTargetDeveloperProjects(response.data)
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
    setSnackPack((prev) => [...prev, { message, key: new Date().getTime() }]);
  }

  const handleSubmitTargetChannel = (event) => {
    event.preventDefault();
    storeApplicationConfiguration({
      ...appConfiguration,
      target: targetConfig,
    })

    const message = 'Target Configuration Saved'
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

  return (
    <>
      <PageTitleWrapper>
        <PageTitle
          heading="Configuration"
          subHeading="Configuration used throughout the application"
        />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={6}>
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
                            onClick={() => setShowCreateProjectModal(true)}
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

          <Grid item xs={6}>
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
                            onClick={() => setShowCreateProjectModal(true)}
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

      { showCreateProjectModal &&
        <CreateProjectModal
          showCreateProjectModal={showCreateProjectModal}
          setShowCreateProjectModal={setShowCreateProjectModal}
          sourceDeveloperProjects={sourceDeveloperProjects}
          environment={sourceConfig?.environment}
          xAuthToken={sourceConfig?.xAuthToken}
        />
      }

      <Snackbar
        key={messageInfo ? messageInfo.key : undefined}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        TransitionProps={{ onExited: handleExited }}
        message={messageInfo ? messageInfo.message : undefined}
        sx={{ zIndex: 1000 }}
        action={
          <React.Fragment>
            <IconButton
              aria-label="close"
              color="inherit"
              sx={{ p: 0.5 }}
              onClick={handleClose}
            >
              <CloseIcon />
            </IconButton>
          </React.Fragment>
        }
      />
    </>
  );
}

Configuration.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Configuration;
