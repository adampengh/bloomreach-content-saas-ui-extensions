import React, { useContext, useEffect, useState } from 'react';
import Head from 'next/head';
import SidebarLayout from 'src/layouts/SidebarLayout';

// API
import {
  downloadExportedFiles,
  getAllProjects,
  getOperationDetails,
  requestAnExport,
  createImportJob,
  getImportOperationStatus,
} from 'bloomreach-content-management-apis';

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
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  useTheme,
} from '@mui/material';

// Contexts
import { ConfigurationContext } from 'src/contexts/ConfigurationContext';
import { ErrorContext } from 'src/contexts/ErrorContext';

// Constants
const DATA_TYPES = [
  'resourcebundle',
  'page',
  'document',
  'folder',
];

function ExportImport() {
  const theme = useTheme();

  const { appConfiguration } = useContext(ConfigurationContext)
  const { handleShowSnackbar } = useContext(ErrorContext)

  const { environment, xAuthToken, projectId } = appConfiguration.environments?.source

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

  // Import state
  const [file, setFile] = useState('')
  const [importJobStatus, setImportJobStatus] = useState("")
  const [importJobRunning, setImportJobRunning] = useState(false)

  useEffect(() => {
    // Get source projects list
    if (environment && xAuthToken) {
      getAllProjects(environment, xAuthToken)
        .then((response) => {
          let projects = response.data
          if (projectId) {
            projects.find(project => project.id === projectId)
          }
          setProjectsList(response.data)
          setSelectedProject(projectId ? projects.find(project => project.id === projectId) : projects[0])
        })
    }

    // Get target projects list
    if (appConfiguration.environments?.target.environment && appConfiguration.environments?.target.xAuthToken) {
      getAllProjects(appConfiguration.environments?.target.environment, appConfiguration.environments?.target.xAuthToken)
        .then((response) => {
          let projects = response.data
          if (projectId) {
            projects.find(project => project.id === projectId)
          }
          setProjectsList(response.data)
          setSelectedProject(projectId ? projects.find(project => project.id === projectId) : projects[0])
        })
    }
  }, [appConfiguration])

  const handleDataTypesChange = async (event) => {
    const name = event.target.name
    const checked = event.target.checked

    if (checked) {
      await setDataTypes([...dataTypes, name])
    } else {
      await setDataTypes(dataTypes.filter(dataType => dataType !== name))
    }
  };

  const handleProjectChange = (e) => {
    e.preventDefault()
    if (e.target.value === 'core') {
      setSelectedProject('core')
    } else {
      setSelectedProject(projectsList.find(project => project.id === e.target.value))
    }
  }

  const handleSubmitExport = (event) => {
    event.preventDefault();
    requestAnExport(environment, xAuthToken, sourcePath, null, selectedProject.id, dataTypes)
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


  // ================================================
  // Content Import
  // ================================================
  const validateImportFile = (filename) => {
    const allowedExtensions = /(\.ndjson)$/i
    return allowedExtensions.test(filename)
  }

  const handleImportFileChange = (event) => {
    const file = event.target.files[0]
    const filename = file.name
    if (!validateImportFile(filename)) {
      handleShowSnackbar('error', 'Invalid file type. Only .ndjson files are allowed.')
      setFile('')
    } else {
      setFile(file)
    }
  }

  const handleSubmitImport = (event) => {
    event.preventDefault();
    createImportJob(environment, xAuthToken, selectedProject.id, file)
      .then((response) => {
        if(response.data.status === "STARTING") {
          handleImportOperation(response.data.operationId)
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const handleImportOperation = (operationId)  => {
    setImportJobRunning(true)
    setDownloadReady(false)
    const importInterval = setInterval(function () {
      getImportOperationStatus(environment, xAuthToken, operationId)
        .then(response => {
          if (response.data.status === "COMPLETED") {
            setImportJobRunning(false)
            setImportJobStatus(response.data)
            clearInterval(importInterval)
          } else {
            setImportJobStatus(response.data)
          }
        })
    }, 1000);
  }


  return (
    <>
      <Head>
        <title>Content Export/Import</title>
      </Head>
      <PageTitleWrapper>
        <PageTitle
          heading="Export & Import"
          subHeading="Batch Export & Import Operation"
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
                    <FormControl required sx={{ p: 1, width: 300 }}>
                      <FormLabel component="legend"><strong>Data Types</strong></FormLabel>
                      <FormGroup sx={{ padding: 1 }}>
                        {DATA_TYPES.map((dataType) => (
                          <FormControlLabel
                            key={dataType}
                            control={
                              <Checkbox
                                name={dataType}
                                checked={dataTypes.indexOf(dataType) > -1}
                                onChange={handleDataTypesChange}
                              />
                            }
                            label={dataType}
                          />
                        ))}
                      </FormGroup>
                    </FormControl>
                    <TextField
                      required
                      id="sourcePath"
                      name="sourcePath"
                      label="Source Path"
                      helperText="/content/documents/<folder>"
                      placeholder='/content/documents/'
                      value={sourcePath}
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
                        value={selectedProject === 'core' ? selectedProject : (selectedProject?.id || '')}
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
                      <InputLabel id="channel">Project ID</InputLabel>
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
                      onChange={handleImportFileChange}
                    />
                    <Button
                      sx={{ margin: 1 }}
                      variant="contained"
                      type="submit"
                      disabled={!(selectedProject && file && !importJobRunning)}
                    >
                      Import
                    </Button>

                    { importJobStatus &&
                      <Paper sx={{ margin: 1 }}>
                        <TableContainer sx={{ marginTop: 2 }}>
                          <Table size="small">
                            <TableHead sx={{background: theme.palette.primary.main}}>
                              <TableRow>
                                <TableCell colSpan={2} sx={{color: theme.palette.common.white}}>Import Job Status</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              <TableRow>
                                <TableCell align='left'>Status:</TableCell>
                                <TableCell>{importJobStatus.status}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell align='left'>Start Time:</TableCell>
                                <TableCell>{importJobStatus.startTime}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell align='left'>End Time:</TableCell>
                                <TableCell>{importJobStatus.endTime}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell align='left'>Read Count:</TableCell>
                                <TableCell>{importJobStatus.readCount}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell align='left'>Write Count:</TableCell>
                                <TableCell>{importJobStatus.writeCount}</TableCell>
                              </TableRow>
                              <TableRow>
                                <TableCell align='left'>Skipped Count:</TableCell>
                                <TableCell>{importJobStatus.skipCount}</TableCell>
                              </TableRow>
                              {importJobStatus.errorLog &&
                                <TableRow>
                                  <TableCell align='left'>Errors:</TableCell>
                                  <TableCell></TableCell>
                                </TableRow>
                              }
                              {importJobStatus.errorLog.map((error, index) => (
                                <TableRow key={index}>
                                  <TableCell align='left'>{error.path}</TableCell>
                                  <TableCell>{error.error}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </Paper>
                    }
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
