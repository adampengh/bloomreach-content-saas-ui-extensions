import React, { use, useContext, useEffect, useRef, useState } from 'react';
import Head from 'next/head';
import SidebarLayout from 'src/layouts/SidebarLayout';
import dayjs from 'dayjs';

// API
import {
  downloadExportedFiles,
  getAllChannels,
  getAllProjects,
  getOperationDetails,
  requestAnExport,
  getFolder,
  getAllCoreChannels,
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
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';

import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

// Icons
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import DescriptionIcon from '@mui/icons-material/Description';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FolderIcon from '@mui/icons-material/Folder';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import LanguageIcon from '@mui/icons-material/Language';

// Contexts
import { ConfigurationContext } from 'src/contexts/ConfigurationContext';

const DATA_TYPES = ['document', 'folder', 'page', 'resourcebundle'];

function ExportImport() {
  // States
  const [dataTypes, setDataTypes] = useState(DATA_TYPES)
  const [downloadReady, setDownloadReady] = useState(false)
  const [elapsedExportTime, setElapsedExportTime] = useState(0)
  const [exportJobRunning, setExportJobRunning] = useState(false)
  const [exportJobStatus, setExportJobStatus] = useState("")
  const [exportOperationId, setExportOperationId] = useState(null)
  const [projectsList, setProjectsList] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)
  const [skippedExportItems, setSkippedExportItems] = useState(0)
  const [sourcePath, setSourcePath] = useState("")
  const [sourceFolders, setSourceFolders] = useState(null)

  const [channels, setChannels] = useState([])
  const [coreChannels, setCoreChannels] = useState([])
  const [selectedCoreChannel, setSelectedCoreChannel] = useState(null)
  const [selectedSourceProject, setSelectedSourceProject] = useState('core')

  const [dateTime, setDateTime] = useState(null);
  const [modifiedAfter, setModifiedAfter] = useState(null);

  // Context
  const { appConfiguration } = useContext(ConfigurationContext)
  const { environment, xAuthToken, projectId } = appConfiguration.environments?.source

  useEffect(() => {
    setSelectedProject(projectId)

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

      // Get All Core Channels
      getAllCoreChannels(environment)
        .then((response) => setCoreChannels(response.data))
        .catch((error) => console.error(error))
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
        .catch(error => console.error(error))
    }
  }, [appConfiguration])


  const handleDataTypesChange = (dataType) => {
    const updatedCheckedState = dataTypes.includes(dataType)
      ? dataTypes.filter((d) => d !== dataType)
      : [...dataTypes, dataType];
    setDataTypes(updatedCheckedState);
  };


  const handleCoreChannelChange = (event) => {
    setSelectedCoreChannel(event.target.value)

    getAllChannels(environment, xAuthToken)
      .then((response) => {
        const channels = response.data
          .filter((channel) => channel.branchOf === event.target.value) // Filter channels by selected core channel
        setChannels(channels)
      })
      .catch(error => console.error(error))

    getFolder(environment, xAuthToken, `/content/documents/${event.target.value}`)
      .then((response) => {
        setSourceFolders(response.data)
      })
      .catch(error => console.error(error))
  }


  const handleSourceProjectChange = (event) => {
    event.preventDefault()
    setSelectedSourceProject(event.target.value)
  }


  const handleSubmitExport = (event) => {
    event.preventDefault();
    const projectId = selectedSourceProject === 'core' ? 'core' : selectedSourceProject.branch
    requestAnExport(environment, xAuthToken, projectId, dataTypes, sourcePath, modifiedAfter)
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
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Head>
        <title>Content Batch Export/Import</title>
      </Head>
      <PageTitleWrapper>
        <PageTitle
          heading="Content Batch Export & Import"
          subHeading="Batch Export & Import operation"
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
              <CardHeader title={<Typography variant='h3'>Export</Typography>} />
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
                    {/* 1. Select Data Types */}
                    <FormControl component="fieldset" sx={{ padding: 1 }}>
                      <FormLabel component="legend"><strong>1. Select Data Types</strong></FormLabel>
                      <FormGroup row>
                        {DATA_TYPES.map((dataType) => (
                          <FormControlLabel
                            key={dataType}
                            control={
                              <Checkbox checked={dataTypes.indexOf(dataType) > -1} onChange={() => handleDataTypesChange(dataType)}/>
                            }
                            label={dataType}
                          />
                        ))}
                      </FormGroup>
                    </FormControl>

                    <Divider sx={{ my: 3 }} />

                    {/* 2. Select Channel/Project */}
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <Typography variant='body1' sx={{ marginLeft: 0.5}}><strong>2. Select Channel/Project</strong></Typography>
                      </Grid>
                      <Grid item xs>
                        <FormControl
                          variant="outlined"
                          sx={{ m: 1, width: '90%'}}
                        >
                          <InputLabel id="channel">Channel</InputLabel>
                          <Select
                            id="projectId"
                            labelId="projectId"
                            label="Channel"
                            value={selectedCoreChannel || ''}
                            onChange={handleCoreChannelChange}
                          >
                            {coreChannels?.sort((a, b) => a.name.localeCompare(b.name))
                              .map(channel => (
                                <MenuItem key={channel.name} value={channel.name}>
                                  <strong>{channel.name}</strong>
                                </MenuItem>
                              )
                            )}
                          </Select>
                        </FormControl>
                      </Grid>
                      <Grid item xs>
                        <FormControl
                          variant="outlined"
                          sx={{ m: 1, width: '90%'}}
                        >
                          <InputLabel id="channel">Project </InputLabel>
                          <Select
                            id="projectId"
                            labelId="projectId"
                            label="Project ID"
                            value={selectedSourceProject || 'core'}
                            onChange={(e) => handleSourceProjectChange(e)}
                          >
                            <MenuItem value='core'><strong>Core</strong></MenuItem>
                            <Divider />
                            {channels?.map(channel => (
                              <MenuItem key={channel.id} value={channel}>
                                <strong>{channel.projectName}</strong>&nbsp;({channel.id})
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </Grid>
                    </Grid>

                    {/* 3. Select Source Folder */}
                    <Divider sx={{ my: 3 }} />

                    {sourceFolders && <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <Typography variant='body1' sx={{ marginLeft: 0.5}}><strong>3. Select Source Folder</strong></Typography>
                      </Grid>
                      <Grid item xs>
                        <Typography variant='body1' sx={{ marginLeft: 0.5}}>Selected source path: <strong>{sourcePath}</strong></Typography>
                        <FolderList
                          sourceFolders={sourceFolders}
                          setSourcePath={setSourcePath}
                        />
                      </Grid>
                    </Grid> }

                    {/* 4. Select Modified After DateTime */}
                    {sourcePath &&
                      <>
                        <Divider sx={{ my: 3 }} />
                        <Grid container spacing={1}>
                          <Grid item xs={12}>
                            <Typography variant='body1' sx={{ marginLeft: 0.5 }}><strong>4. Select Modified After DateTime (optional)</strong></Typography>
                          </Grid>
                          <Grid item xs display='flex' alignItems='center'>
                            <DateTimePicker
                              renderInput={(props) => <TextField {...props} />}
                              label="Modified After (optional)"
                              value={dateTime}
                              onChange={(newValue) => {
                                setModifiedAfter(dayjs(newValue).format('YYYY-MM-DDTHH:mm:ssZ'))
                                setDateTime(newValue);
                              }}
                            />
                            {dateTime &&
                              <IconButton onClick={() => {
                                setModifiedAfter(null)
                                setDateTime(null)
                              }}>
                                <HighlightOffIcon />
                              </IconButton>
                            }
                          </Grid>
                        </Grid>
                      </>
                    }
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


          {/* TARGET ENVIRONMENT */}
          <Grid item xs={6}>
            <Card>
              <CardHeader title={<Typography variant='h3'>Import</Typography>} />
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
                        // onChange={(e) => handleProjectChange(e)}
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
      </LocalizationProvider>
    </>
  );
}

const FolderList = ({ sourceFolders, setSourcePath }) => {
  const TreeViewRef = useRef(null);
  if (!sourceFolders) return null

  const renderTree = (folders, documents) => {
    return (
      <>
        {folders?.map((folder) => {
          return (
            <TreeItem
              key={folder.path}
              nodeId={folder.path}
              label={
                <Typography display='flex' alignItems='center'>
                  <FolderIcon fontSize='12px' sx={{ marginRight: '4px'}} />
                  <span>{folder.displayName || folder.path.split('/').pop()}</span>
                </Typography>
              }
            >
              {renderTree(folder.folders, folder.documents)}
            </TreeItem>
          )
        })}
        {documents?.map((document) => {
          return (
            <TreeItem
              key={document.path}
              nodeId={document.path}
              label={
                <Typography display='flex' alignItems='center'>
                  <DescriptionIcon fontSize='12px' sx={{ marginRight: '4px'}} />
                  <span>{document.displayName || document.path.split('/').pop()}</span>
                </Typography>
              }
            />
          )
        })}
      </>
    )
  }

  return (
    <TreeView
      aria-label="file system navigator"
      defaultExpanded={[sourceFolders?.path]}
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{
        height: 480,
        flexGrow: 1,
        maxWidth: '100%',
        overflowY: 'auto',
        background: '#f0f0f0',
        padding: 1
      }}
      onNodeSelect={(event, nodeIds) => {
        setSourcePath(nodeIds)
      }}
      >
      <TreeItem
        ref={TreeViewRef}
        key={sourceFolders.path}
        nodeId={sourceFolders.path}
        label={
          <Typography display='flex' alignItems='center'>
            <LanguageIcon fontSize='12px' sx={{ marginRight: '4px'}} />
            <span>{sourceFolders.displayName || sourceFolders.path.split('/').pop()}</span>
          </Typography>
        }
      >
        {renderTree(sourceFolders.folders, sourceFolders.documents)}
      </TreeItem>
    </TreeView>
  )
}

ExportImport.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default ExportImport;
