import React from 'react'

// API
import { createDeveloperProject } from 'api'

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
} from '@mui/material'

export default function CreateProjectModal({
    showCreateProjectModal,
    setShowCreateProjectModal,
    sourceDeveloperProjects,
    environment,
    xAuthToken,
}) {
    const handleClose = () => {
        setShowCreateProjectModal(false)
    };

    const handleCreateNewProject = (event) => {
        event.preventDefault()
        const name = event.target.querySelector('#projectName').value
        const includeContentTypes = event.target.querySelector('#includeContentTypes').checked
        createDeveloperProject(environment, xAuthToken, name, includeContentTypes)
            .then(response => {
                console.log('success', response)
                setShowCreateProjectModal(false)
            })
    }

    const hasContentTypesProject = !!sourceDeveloperProjects?.filter(project => project.includeContentTypes === true).length

    return (
        <Dialog open={showCreateProjectModal} onClose={handleClose}>
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': { m: 1, width: '100%' }
                }}
                noValidate
                autoComplete="off"
                onSubmit={handleCreateNewProject}
            >
                <DialogTitle>Create New Development Project</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Create a new development project and optionally add ability to edit Content Types
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="projectName"
                        label="Project Name"
                        type="text"
                        fullWidth
                        variant="standard"
                    />
                    <FormGroup>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    id='includeContentTypes'
                                    name='includeContentTypes'
                                    disabled={hasContentTypesProject} />
                            }
                            label="Includes Content Type Changes" />
                    </FormGroup>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button variant="contained" type="submit">Create Project</Button>
                </DialogActions>
            </Box>
        </Dialog>
    );
}
