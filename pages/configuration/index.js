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


function Configuration() {
  const {
    appConfiguration,
    storeApplicationConfiguration,
  } = useContext(ConfigurationContext)

  const [sourceConfig, setSourceConfig] = useState(appConfiguration.source)
  const [targetConfig, setTargetConfig] = useState(appConfiguration.target)

  useEffect(() => {
    setSourceConfig(appConfiguration.source)
    setTargetConfig(appConfiguration.target)
  }, [appConfiguration])

  const handleSubmitSourceChannel = (event) => {
    event.preventDefault();
    storeApplicationConfiguration({
      source: sourceConfig,
      target: appConfiguration.target,
    })
  }

  const handleSubmitTargetChannel = (event) => {
    event.preventDefault();
    storeApplicationConfiguration({
      source: appConfiguration.source,
      target: targetConfig,
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
          <Grid item xs={6}>
            <Card>
              <CardHeader title="Source Environment" />
              <Divider />
              <CardContent>
                <Box
                  component="form"
                  sx={{
                    '& .MuiTextField-root': { m: 1, width: '90%' }
                  }}
                  noValidate
                  autoComplete="off"
                  onSubmit={handleSubmitSourceChannel}
                >
                  <div>
                    <TextField
                      required
                      id="environment"
                      name="environment"
                      label="Environment"
                      helperText="https://<environment>.bloomreach.io"
                      value={sourceConfig?.environment || ''}
                      onChange={(e) => setSourceConfig({...sourceConfig, environment: e.target.value})}
                    />
                    <TextField
                      required
                      id="xAuthToken"
                      name="xAuthToken"
                      label="X-Auth-Token"
                      value={sourceConfig?.xAuthToken || ''}
                      onChange={(e) => setSourceConfig({...sourceConfig, xAuthToken: e.target.value})}
                    />
                    <TextField
                      required
                      id="projectId"
                      name="projectId"
                      label="Project ID"
                      value={sourceConfig?.projectId || ''}
                      onChange={(e) => setSourceConfig({...sourceConfig, projectId: e.target.value})}
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

          <Grid item xs={6}>
            <Card>
              <CardHeader title="Target Environment" />
              <Divider />
              <CardContent>
                <Box
                  component="form"
                  sx={{
                    '& .MuiTextField-root': { m: 1, width: '90%' }
                  }}
                  noValidate
                  autoComplete="off"
                  onSubmit={handleSubmitTargetChannel}
                >
                  <div>
                    <TextField
                      name="environment"
                      label="Environment"
                      helperText="https://<environment>.bloomreach.io"
                      value={targetConfig?.environment || ''}
                      onChange={(e) => setTargetConfig({...targetConfig, environment: e.target.value})}
                    />
                    <TextField
                      name="xAuthToken"
                      label="X-Auth-Token"
                      value={targetConfig?.xAuthToken || ''}
                      onChange={(e) => setTargetConfig({...targetConfig, xAuthToken: e.target.value})}
                    />
                    <TextField
                      name="projectId"
                      label="Project ID"
                      value={targetConfig?.projectId || ''}
                      onChange={(e) => setTargetConfig({...targetConfig, projectId: e.target.value})}
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
