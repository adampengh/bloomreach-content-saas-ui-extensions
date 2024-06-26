import React from 'react'

// API
import {
  createDeveloperProject,
  getAllProjects,
} from 'bloomreach-content-management-apis'

// Components
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
} from '@mui/material'

export default function CreateProjectModal({
  showModal,
  setShowModal,
  projects,
  setProjects,
  environment,
  xAuthToken,
}) {
  const handleClose = () => {
    setShowModal(false)
  };

  const handleCreateNewProject = async (event) => {
    event.preventDefault()
    const name = event.target.querySelector('#projectName').value
    const includeContentTypes = event.target.querySelector('#includeContentTypes').checked
    await createDeveloperProject(environment, xAuthToken, name, includeContentTypes)
      .then(() => {
        setShowModal(false)
      })

    await getAllProjects(environment, xAuthToken)
      .then((response) => {
        let projects = response.data
        console.log('projects', projects)
        projects.sort((projectA, projectB) => {
          const timestamp = (project) => new Date(project.system.createdAt).valueOf()
          return timestamp(projectB) - timestamp(projectA)
        })
        setProjects(projects)
      })
      .catch((error) => console.error(error.message))
  }

  const hasContentTypesProject = !!projects?.filter(project => project.includeContentTypes === true).length

  return (
    <Dialog open={showModal} onClose={handleClose}>
      <Box
        component='form'
        sx={{
          '& .MuiTextField-root': { m: 1, width: '100%' }
        }}
        noValidate
        autoComplete='off'
        onSubmit={handleCreateNewProject}
      >
        <DialogTitle>
          <Typography variant='h3' sx={{ fontWeight: 'bold' }}>Create New Development Project</Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Create a new development project and optionally add ability to edit Content Types
          </DialogContentText>
          <TextField
            autoFocus
            margin='dense'
            id='projectName'
            label='Project Name'
            type='text'
            fullWidth
            variant='standard'
          />
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  id='includeContentTypes'
                  name='includeContentTypes'
                  disabled={hasContentTypesProject} />
              }
              label='Includes Content Type Changes' />
          </FormGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant='contained' type='submit'>Create Project</Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
