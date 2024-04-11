'use client'
import React, { useContext, useEffect, useState } from 'react';

// API
import {
  createImportJob,
  getImportOperationStatus,
} from 'bloomreach-content-management-apis';

// Components
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  FormControl,
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
import { ErrorContext } from 'src/contexts/ErrorContext';


const ImportComponent = ({
  environment,
  xAuthToken,
  projectsList,
  selectedProject,
}) => {
  const theme = useTheme();
  const { handleShowSnackbar } = useContext(ErrorContext)

  // State
  const [file, setFile] = useState('')
  const [importJobStatus, setImportJobStatus] = useState("")
  const [importJobRunning, setImportJobRunning] = useState(false)

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
  )
}

export default ImportComponent;
