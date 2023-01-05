import React, { useContext, useEffect, useState } from 'react';
import SidebarLayout from 'src/layouts/SidebarLayout';

// Components
import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import {
  Box,
  Button,
  Container,
  Grid,
  Card,
  CardContent,
  TextField
} from '@mui/material';

// Contexts
import { ConfigurationContext } from 'src/contexts/ConfigurationContext';


function Configuration() {
  const {
    appConfiguration,
    setApplicationConfiguration
  } = useContext(ConfigurationContext)

  const [environment, setEnvironment] = useState(appConfiguration?.environment)
  const [xAuthToken, setXAuthToken] = useState(appConfiguration?.xAuthToken)
  const [projectId, setProjectId] = useState(appConfiguration?.projectId)

  useEffect(() => {
    if (appConfiguration?.environment) {
      setEnvironment(appConfiguration.environment)
    }
    if (appConfiguration?.xAuthToken) {
      setXAuthToken(appConfiguration.xAuthToken)
    }
    if (appConfiguration?.projectId) {
      setProjectId(appConfiguration.projectId)
    }

    setApplicationConfiguration({
      environment,
      xAuthToken,
      projectId
    })
  }, [])

  const handleSubmit = (event) => {
    event.preventDefault();
    setApplicationConfiguration({
      environment,
      xAuthToken,
      projectId,
    })
  }

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
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box
                  component="form"
                  sx={{
                    '& .MuiTextField-root': { m: 2, width: '100ch' }
                  }}
                  noValidate
                  autoComplete="off"
                  onSubmit={handleSubmit}
                >
                  <div>
                    <TextField
                      required
                      id="environment"
                      name="environment"
                      label="Environment"
                      helperText="https://<environment>.bloomreach.io"
                      value={environment}
                      onChange={(e) => setEnvironment(e.target.value)}
                    />
                    <TextField
                      required
                      id="xAuthToken"
                      name="xAuthToken"
                      label="X-Auth-Token"
                      value={xAuthToken}
                      onInput={(e) => setXAuthToken(e.target.value)}
                    />
                    <TextField
                      required
                      id="projectId"
                      name="projectId"
                      label="Project ID"
                      value={projectId}
                      onInput={(e) => setProjectId(e.target.value)}
                    />
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
    </>
  );
}

Configuration.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Configuration;
