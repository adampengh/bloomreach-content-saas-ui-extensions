'use client'
import React, { useContext, useEffect, useState } from 'react';

// API
import { getAllProjects } from 'bloomreach-content-management-apis';

// Components
import { Container, Grid } from '@mui/material';

// Contexts
import { ConfigurationContext } from 'src/contexts/ConfigurationContext';
import ExportComponent from './Export';
import ImportComponent from './Import';


const ExportImport = () => {
  const { appConfiguration } = useContext(ConfigurationContext)
  const { environment, xAuthToken, projectId } = appConfiguration.environments?.source

  const [projectsList, setProjectsList] = useState([])
  const [selectedProject, setSelectedProject] = useState(null)

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

  return (
    <Container maxWidth="xl">
      <Grid
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
      >
        <Grid item xs={6}>
          <ExportComponent
            environment={environment}
            xAuthToken={xAuthToken}
            projectsList={projectsList}
            setProjectsList={setProjectsList}
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
          />
        </Grid>

        <Grid item xs={6}>
          <ImportComponent
            environment={environment}
            xAuthToken={xAuthToken}
            projectsList={projectsList}
            setProjectsList={setProjectsList}
            selectedProject={selectedProject}
            setSelectedProject={setSelectedProject}
          />
        </Grid>
      </Grid>
    </Container>
  )
}

export default ExportImport;
