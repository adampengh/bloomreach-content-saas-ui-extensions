import React, { useContext, useEffect, useState } from 'react';
import SidebarLayout from 'src/layouts/SidebarLayout';

// Components
import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Container,
  Grid,
  TextField
} from '@mui/material';

// Contexts
import { ConfigurationContext } from 'src/contexts/ConfigurationContext';
import {getOperationDetails, requestAnExport} from "../../api/batch-export";


function ExportImport() {
  const {
    appConfiguration,
  } = useContext(ConfigurationContext)

  const [dataTypes, setDataTypes] = useState([""])
  const [sourcePath, setSourcePath] = useState("")
  const [skippedExportItems, setSkippedExportItems] = useState(0)
  const [elapsedExportTime, setElapsedExportTime] = useState(0)
  const [exportProjectId, setExportProjectId] = useState("")
  const [exportJobStatus, setExportJobStatus] = useState("")
  const [exportJobRunning, setExportJobRunning] = useState(false)
  const [downloadReady, setDownloadReady] = useState(false)

  const {
    environment,
    xAuthToken,
    projectId,
  } = appConfiguration.source

  useEffect(() => {
    setDataTypes(["resourcebundle", "page", "document", "folder"])
    setExportProjectId(projectId)
  }, [appConfiguration])

  const handleSubmitExport = (event) => {
    event.preventDefault();
    requestAnExport(environment,xAuthToken,exportProjectId, dataTypes, sourcePath)
        .then(resp => {
          if(resp.data.status === "STARTING") {
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
    //TODO: implement
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
                    <TextField
                      required
                      id="dataTypes"
                      name="dataTypes"
                      label="Data types"
                      helperText="resourcebundle, page, resourcebundle, folder"
                      value={dataTypes || ''}
                      onChange={(e) => setDataTypes(e.target.value.split(","))}
                    />
                    <TextField
                      required
                      id="sourcePath"
                      name="sourcePath"
                      label="Source Path"
                      helperText="/content/documents/<folder>"
                      value={sourcePath || ''}
                      onChange={(e) => setSourcePath(e.target.value)}
                    />
                    <TextField
                      required
                      id="projectId"
                      name="projectId"
                      label="Project ID"
                      value={ projectId || ''}
                      onChange={(e) => setExportProjectId(e.target.value)}
                    />
                  </div>
                  <div>
                    <Button
                      sx={{ margin: 1 }}
                      variant="contained"
                      type="submit"
                    >
                      Start export
                    </Button>
                    { exportJobRunning && <p>Job status: {exportJobStatus} time: {elapsedExportTime}s skipped: {skippedExportItems}</p>}
                    { downloadReady && <Button
                        sx={{ margin: 1 }}
                        variant="contained"
                        onClick={e => handleExportDownload(e.target.value)}
                    >
                      Download
                    </Button>}
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
