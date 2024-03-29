import React, { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router'
import SidebarLayout from 'src/layouts/SidebarLayout';

// API
import {
  getAllProjects
} from 'bloomreach-content-management-apis'

// Components
import CreateProjectModal from 'components/projects/CreateProjectModal';
import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import StatusIndicator from 'components/StatusIndicator';
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
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';

// Contexts
import { ConfigurationContext } from 'src/contexts/ConfigurationContext';
import { ErrorContext } from 'src/contexts/ErrorContext';

// Icons
import AddIcon from '@mui/icons-material/Add';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';

function Configuration() {
  const { query } = useRouter();
  const { environment, apiKey } = query;

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
    if (environment && apiKey) {
      console.log('environment', environment)
      console.log('apiKey', apiKey)

      const config = {
        ...sourceConfig,
        environment: environment,
        xAuthToken: apiKey
      }
      setSourceConfig(config)
      storeApplicationConfiguration({
        ...appConfiguration,
        environments: {
          source: config,
          target: targetConfig
        }
      })
    }
  }, [environment, apiKey])

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

  const handleSourceProjectIdClick = () => {
    if (appConfiguration?.environments?.source?.environment && appConfiguration?.environments?.source?.xAuthToken) {
      getAllProjects(appConfiguration.environments?.source.environment, appConfiguration?.environments?.source?.xAuthToken)
        .then(response => setSourceDeveloperProjects(response.data))
        .catch((error) => handleShowSnackbar('error', error.message))
    }
  }

  const handleTargetProjectIdClick = () => {
    if (appConfiguration?.environments?.target?.environment && appConfiguration?.environments?.target?.xAuthToken) {
      getAllProjects(appConfiguration.environments?.target.environment, appConfiguration?.environments?.target?.xAuthToken)
        .then(response => setTargetDeveloperProjects(response.data))
        .catch((error) => handleShowSnackbar('error', error.message))
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
      <Head>
        <title>Configuration</title>
      </Head>
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
            <Environment
              title='Source Environment'
              environment={appConfiguration?.environments?.source?.environment}
              xAuthToken={appConfiguration?.environments?.source?.xAuthToken}
              config={sourceConfig}
              setConfig={setSourceConfig}
              developerProjects={sourceDeveloperProjects}
              setDeveloperProjects={setSourceDeveloperProjects}
              handleSubmit={handleSubmitSourceChannel}
              handleProjectClick={handleSourceProjectIdClick}
              handleShowModal={handleShowModal}
            />
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
            <Environment
              title='Target Environment'
              environment={appConfiguration?.environments?.target?.environment}
              xAuthToken={appConfiguration?.environments?.target?.xAuthToken}
              config={targetConfig}
              setConfig={setTargetConfig}
              developerProjects={targetDeveloperProjects}
              setDeveloperProjects={setTargetDeveloperProjects}
              handleSubmit={handleSubmitTargetChannel}
              handleProjectClick={handleTargetProjectIdClick}
              handleShowModal={handleShowModal}
            />
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

const Environment = ({
  title,
  environment,
  xAuthToken,
  config,
  setConfig,
  developerProjects,
  handleSubmit,
  handleProjectClick,
  handleShowModal
}) => {
  return (
    <Card>
      <CardHeader title={title} />
      <Divider />
      <CardContent>
        <Box
          component="form"
          sx={{
            '& .MuiTextField-root': { width: '100%' }
          }}
          noValidate
          autoComplete="off"
          onSubmit={handleSubmit}
        >
          <Stack spacing={3}>
            <TextField
              required
              autoComplete="off"
              id="environment"
              name="environment"
              label="Environment"
              helperText="https://<environment>.bloomreach.io"
              value={config?.environment || ''}
              onChange={(e) => setConfig({...config, environment: e.target.value})}
            />
            <TextField
              required
              autoComplete="off"
              id="xAuthToken"
              name="xAuthToken"
              label="Authorization Token"
              value={config?.xAuthToken || ''}
              onChange={(e) => setConfig({...config, xAuthToken: e.target.value})}
            />
            { environment && xAuthToken &&
              <Grid
                container
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ width: '100%' }}
              >
                <Grid
                  item
                  flexGrow="1"
                  sx={{ paddingRight: 2 }}>
                  <FormControl
                    onMouseDown={handleProjectClick}
                    variant="outlined"
                    sx={{ width: '100%', marginRight: 1 }}
                  >
                    <InputLabel id="sourceProjectId">Project ID</InputLabel>
                    <Select
                      id="sourceProjectId"
                      labelId="sourceProjectId"
                      label="Source Project ID"
                      value={config?.projectId || 'core'}
                      onChange={(e) => setConfig({...config, projectId: e.target.value})}
                    >
                      <MenuItem value='core'><strong>Core</strong></MenuItem>
                      <Divider />
                      {developerProjects.map(project => (
                        <MenuItem key={project.id} value={project.id} sx={{ justifyContent: 'space-between', fontWeight: 'bold' }}>
                          {project.name}
                          <StatusIndicator status={project.state.status} message={project.state.message} />
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item>
                  <Tooltip title="Add Project">
                  <Button
                    variant="outlined"
                    onClick={() => handleShowModal('source')}
                    sx={{ height: '57px' }}
                  >
                    <AddIcon />
                  </Button>
                  </Tooltip>
                </Grid>
              </Grid>
            }
            <Button
              variant="contained"
              type="submit"
            >
              Save
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  )
}

Configuration.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Configuration;
