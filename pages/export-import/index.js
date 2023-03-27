import React, { useContext, useEffect, useState } from 'react';
import SidebarLayout from 'src/layouts/SidebarLayout';

// API
import {
  downloadExportedFiles,
  getAllProjects,
  getOperationDetails,
  requestAnExport
} from 'api';

// Components
import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Container,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
} from '@mui/material';

// Contexts
import { ConfigurationContext } from 'src/contexts/ConfigurationContext';

const ITEM_HEIGHT = 36;
const ITEM_PADDING_TOP = 0;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const DATA_TYPES = [
  'resourcebundle',
  'page',
  'document',
  'folder',
];

function ExportImport() {
  const {
    appConfiguration,
  } = useContext(ConfigurationContext)

  const {
    environment,
    xAuthToken,
    projectId,
  } = appConfiguration.environments?.source

  const [dataTypes, setDataTypes] = useState(DATA_TYPES)
  const [sourcePath, setSourcePath] = useState("")
  const [skippedExportItems, setSkippedExportItems] = useState(0)
  const [elapsedExportTime, setElapsedExportTime] = useState(0)
  const [exportOperationId, setExportOperationId] = useState(null)
  const [exportJobStatus, setExportJobStatus] = useState("")
  const [exportJobRunning, setExportJobRunning] = useState(false)
  const [downloadReady, setDownloadReady] = useState(false)

  const [projectsList, setProjectsList] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)

  useEffect(() => {
    setSelectedProject(projectId)

    // Get source projects list
    if (environment && xAuthToken) {
      getAllProjects(environment, xAuthToken)
        .then((response) => {
          console.log(response)
          let projects = response.data
          if (projectId) {
            projects.find(project => project.id === projectId)
          }
          console.log('projects', projects)
          setProjectsList(response.data)
          setSelectedProject(projectId ? projects.find(project => project.id === projectId) : projects[0])
        })
    }

    // Get target projects list
    if (appConfiguration.environments?.target.environment && appConfiguration.environments?.target.xAuthToken) {
      getAllProjects(appConfiguration.environments?.target.environment, appConfiguration.environments?.target.xAuthToken)
        .then((response) => {
          console.log(response)
          let projects = response.data
          if (projectId) {
            projects.find(project => project.id === projectId)
          }
          console.log('projects', projects)
          setProjectsList(response.data)
          setSelectedProject(projectId ? projects.find(project => project.id === projectId) : projects[0])
        })
    }
  }, [appConfiguration])

  const handleDataTypesChange = (event) => {
    const {
      target: { value },
    } = event;
    setDataTypes(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value,
    );
  };

  const handleProjectChange = (e) => {
    e.preventDefault()
    setSelectedProject(projectsList.find(project => project.id === e.target.value))
  }

  const handleSubmitExport = (event) => {
    event.preventDefault();
    requestAnExport(environment, xAuthToken, selectedProject.id, dataTypes, sourcePath)
      .then(resp => {
        if(resp.data.status === "STARTING") {
          setExportOperationId(resp.data.operationId)
          handleExportOperation(resp.data.operationId)
        }}
      )
  }

  const handleExportOperation = (operationId)  => {
    setExportJobRunning(true)
    setDownloadReady(false)
    let elapsedTime = 0;
    const mainLoopId = setInterval(function () {
      getOperationDetails(environment, xAuthToken, operationId)
        .then(resp => {
          if (resp.data.status === "COMPLETED") {
            setExportJobRunning(false)
            setDownloadReady(true)
            setElapsedExportTime(0)
            clearInterval(mainLoopId)
          } else {
            setExportJobStatus(resp.data.status)
            elapsedTime += 1
            setElapsedExportTime(elapsedTime)
            setSkippedExportItems(resp.data.skipCount+skippedExportItems)
          }
        })
    }, 1000);
  }

  const handleExportDownload = (event) => {
    event.preventDefault()
    downloadExportedFiles(environment, xAuthToken, exportOperationId)
      .then(response => {
        const blob = new Blob([response.data], {type: "application/octet-stream"})
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', `${exportOperationId}.zip`)
        document.body.appendChild(link)
        link.click()

        window.URL.revokeObjectURL(url)
        link.remove()
      })
  }

  const handleSubmitImport = (event) => {
    event.preventDefault();
    //TODO: implement
  }

  return (
    <>
      <PageTitleWrapper>
        <PageTitle
          heading="Export & Import"
          subHeading="Batch Export & Import operation"
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
              <CardHeader title="Export" />
              <Divider />
              <CardContent>
                <Box
                  component="form"
                  sx={{
                    '& .MuiTextField-root': { m: 1, width: '90%' }
                  }}
                  noValidate
                  autoComplete="off"
                  onSubmit={handleSubmitExport}
                >
                  <div>
                    <FormControl required sx={{ m: 1, width: 300 }}>
                      <InputLabel id="demo-multiple-checkbox-label">Data Types</InputLabel>
                      <Select
                        label="Data Types"
                        labelId="demo-multiple-checkbox-label"
                        id="demo-multiple-checkbox"
                        multiple
                        value={dataTypes}
                        onChange={handleDataTypesChange}
                        input={<OutlinedInput label="Data Types" />}
                        renderValue={(selected) => selected.join(', ')}
                        MenuProps={MenuProps}
                      >
                        {DATA_TYPES.map((dataType) => (
                          <MenuItem key={dataType} value={dataType}>
                            <Checkbox checked={dataTypes.indexOf(dataType) > -1} />
                            <ListItemText primary={dataType} />
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      required
                      id="sourcePath"
                      name="sourcePath"
                      label="Source Path"
                      helperText="/content/documents/<folder>"
                      placeholder='reference-spa/pages'
                      value={sourcePath || ''}
                      onChange={(e) => setSourcePath(e.target.value)}
                    />
                    <FormControl
                      variant="outlined"
                      sx={{ m: 1, minWidth: 240, marginTop: 2 }}
                    >
                      <InputLabel id="channel">Project</InputLabel>
                      <Select
                        id="projectId"
                        labelId="projectId"
                        label="Project ID"
                        value={selectedProject?.id || ''}
                        onChange={(e) => handleProjectChange(e)}
                      >
                        <MenuItem value='core'>Core</MenuItem>
                        <Divider />
                        {projectsList.map(project => (
                          <MenuItem key={project.id} value={project.id}>
                            {project.name} ({project.id})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </div>
                  <div>
                    <Button
                      sx={{ margin: 1 }}
                      variant="contained"
                      type="submit"
                      disabled={!sourcePath}
                    >
                      Start export
                    </Button>
                    { exportJobRunning && <p>Job status: {exportJobStatus} time: {elapsedExportTime}s skipped: {skippedExportItems}</p>}
                    { downloadReady &&
                      <Button
                        sx={{ margin: 1 }}
                        variant="contained"
                        onClick={(e) => handleExportDownload(e)}
                      >
                        Download
                      </Button>
                    }
                  </div>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={6}>
            <Card>
              <CardHeader title="Import" />
              <Divider />
              <CardContent>
                <Box
                  component="form"
                  sx={{
                    '& .MuiTextField-root': { m: 1, width: '90%' }
                  }}
                  noValidate
                  autoComplete="off"
                  onSubmit={handleSubmitImport}>
                  <div>
                    <FormControl
                      variant="outlined"
                      sx={{ m: 1, minWidth: '90%', marginTop: 2 }}
                    >
                      <InputLabel id="channel">Project</InputLabel>
                      <Select
                        id="projectId"
                        labelId="projectId"
                        label="Project ID"
                        value={selectedProject?.id || ''}
                        onChange={(e) => handleProjectChange(e)}
                      >
                        {projectsList.map(project => (
                          <MenuItem key={project.id} value={project.id}>
                            {project.name} ({project.id})
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                    <TextField
                      required
                      type="file"
                      id="sourcePath"
                      name="sourcePath"
                    />
                    <Button
                      sx={{ margin: 1 }}
                      variant="contained"
                      type="submit"
                    >
                      Import
                    </Button>
                  </div>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

ExportImport.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default ExportImport;
