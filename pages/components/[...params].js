import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { CopyBlock } from 'react-code-blocks'
import bloomreachTheme from 'src/theme/code-block/bloomreachTheme'

// APIs
import { getComponent } from 'bloomreach-content-management-apis';

// Layouts
import SidebarLayout from 'src/layouts/SidebarLayout';

// Components
import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import {
  Box,
  Breadcrumbs,
  Card,
  CardContent,
  Checkbox,
  CircularProgress,
  Container,
  FormControlLabel,
  FormGroup,
  Grid,
  Link,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material';

// Contexts
import { ConfigurationContext } from 'src/contexts/ConfigurationContext';

function ContentTypes() {
  const router = useRouter()
  const { params } = router.query
  const channelId = params?.[0]
  const componentGroup = params?.[1]
  const componentName = params?.[2]

  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)

  const [tab, setTab] = useState(0);
  const [component, setComponent] = useState(null)
  const [xResourceVersion, setXResourceVersion] = useState(null)

  const {
    appConfiguration
  } = useContext(ConfigurationContext)

  const {
    environment,
    xAuthToken,
  } = appConfiguration?.environments?.source

  useEffect(() => {
    if (environment && xAuthToken && channelId && componentGroup && componentName) {
      getComponent(environment, xAuthToken, channelId, componentGroup, componentName)
        .then((response) => {
          setComponent(response.data)
          setXResourceVersion(response.headers['x-resource-version'])
          setIsLoaded(true)
          setError(null)
        })
        .catch((error) => {
          setError(error.message)
          setIsLoaded(true)
        })
    } else {
      setIsLoaded(true)
    }
  }, [environment, xAuthToken, channelId, componentGroup, componentName])

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <>
      <PageTitleWrapper>
        <PageTitle
          heading='Component'
          subHeading={`X-Resource-Version:`}
        />
      </PageTitleWrapper>
      <Container maxWidth="xl">
        <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: '1.5rem'}}>
          <Link
            underline="hover"
            color="inherit"
            href="/components"
          >
            Components
          </Link>
          <Typography color="text.primary"></Typography>
        </Breadcrumbs>

        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          alignContent="stretch"
          sx={{
            '& .MuiCircularProgress-root': {
              margin: '24px'
            }
          }}
        >
        { !isLoaded
          ?
            <Grid
              item
              xs={12}
              justifyContent="center"
              alignItems="stretch"
              alignContent="stretch"
            >
              <Card>
                <CircularProgress />
              </Card>
            </Grid>
          :
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ fontWeight: 'bold', letterSpacing: '.05rem' }}>
                  <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={tab} onChange={handleTabChange} aria-label="basic tabs example">
                      <Tab label="Configuration" />
                      <Tab label="Properties" />
                      <Tab label="JSON" />
                    </Tabs>
                  </Box>
                  <TabPanel tab={tab} index={0}>
                    <Box
                      component="form"
                      sx={{
                        '& .MuiTextField-root': { m: 1, width: '100%' }
                      }}
                      noValidate
                      autoComplete="off"
                      // onSubmit={handleSubmitSourceChannel}
                    >
                      <div style={{ marginBottom: '1rem' }}>
                        <TextField
                          autoComplete="off"
                          id="id"
                          name="id"
                          label="ID"
                          value={component?.id}
                          disabled={true}
                          // onChange={(e) => setSourceConfig({...sourceConfig, environment: e.target.value})}
                        />
                      </div>
                      <div style={{ marginBottom: '1rem' }}>
                        <TextField
                          autoComplete="off"
                          id="label"
                          name="label"
                          label="Label"
                          value={component?.label}
                          // onChange={(e) => setSourceConfig({...sourceConfig, environment: e.target.value})}
                        />
                      </div>
                      <div style={{ marginBottom: '1rem' }}>
                        <TextField
                          autoComplete="off"
                          id="icon"
                          name="icon"
                          label="Icon"
                          value={component?.icon}
                          // onChange={(e) => setSourceConfig({...sourceConfig, environment: e.target.value})}
                        />
                      </div>
                      <div style={{ marginBottom: '1rem' }}>
                        <TextField
                          autoComplete="off"
                          id="ctype"
                          name="ctype"
                          label="Ctype"
                          value={component?.ctype}
                          // onChange={(e) => setSourceConfig({...sourceConfig, environment: e.target.value})}
                        />
                      </div>
                      <div style={{ marginBottom: '1rem' }}>
                        <TextField
                          autoComplete="off"
                          id="xtype"
                          name="xtype"
                          label="Xtype"
                          value={component?.xtype}
                          // onChange={(e) => setSourceConfig({...sourceConfig, environment: e.target.value})}
                        />
                      </div>
                      <div style={{ marginBottom: '1rem' }}>
                        <FormGroup sx={{ marginLeft: '0.5rem' }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                id='hidden'
                                name='hidden'/>
                            }
                            label="Hidden" />
                        </FormGroup>
                        <FormGroup sx={{ marginLeft: '0.5rem' }}>
                          <FormControlLabel
                            control={
                              <Checkbox
                                id='system'
                                name='system'/>
                            }
                            label="System" />
                        </FormGroup>
                      </div>
                    </Box>
                  </TabPanel>
                  <TabPanel tab={tab} index={1}>
                    Item Two
                  </TabPanel>
                  <TabPanel tab={tab} index={2}>
                    { component &&
                      <CopyBlock
                        text={JSON.stringify(component, null, 4)}
                        language='json'
                        wrapLines
                        theme={bloomreachTheme}
                        showLineNumbers={true}
                        codeBlock
                      />
                    }
                  </TabPanel>
                </CardContent>
              </Card>
            </Grid>
          }
        </Grid>
      </Container>
    </>
  );
}

function TabPanel(props) {
  const { children, tab, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={tab !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {tab === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

ContentTypes.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default ContentTypes;
