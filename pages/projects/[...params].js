import React, { useContext, useEffect, useState } from 'react'
import { CopyBlock } from 'react-code-blocks'
import bloomreachTheme from 'src/theme/code-block/bloomreachTheme'

// APIs
import { getDeveloperProject } from 'api';

// Layouts
import SidebarLayout from 'src/layouts/SidebarLayout';

// Components
import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import StatusIndicator from './StatusIndicator';
import {
  Breadcrumbs,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Link,
  Tabs,
  Tab,
  Typography,
} from '@mui/material';

// Contexts
import { ConfigurationContext } from 'src/contexts/ConfigurationContext';

function ContentTypes({params}) {
  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)

  const [instance, id] = params
  const [tab, setTab] = useState(0);
  const [projectData, setProjectData] = useState(null)

  const {
    appConfiguration
  } = useContext(ConfigurationContext)

  useEffect(() => {
    if (instance === 'source' && appConfiguration?.source?.environment && appConfiguration?.source?.xAuthToken) {
      getDeveloperProject(appConfiguration?.source?.environment, appConfiguration?.source?.xAuthToken, id)
        .then(response => setProjectData(response.data))
        .catch(err => console.log(err))
    }

    if (instance === 'target' && appConfiguration?.target?.environment && appConfiguration?.target?.xAuthToken) {
      getDeveloperProject(appConfiguration.target.environment, appConfiguration.target.xAuthToken, id)
        .then(response => setProjectData(response.data))
        .catch(err => console.log(err))
    }
    setIsLoaded(true)
  }, [instance, id, appConfiguration])

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <>
      <PageTitleWrapper>
        <Grid
          container
          alignContent='center'
        >
          <Grid item>
            <PageTitle
              heading={projectData?.name}
              subHeading={projectData?.id}
            />
          </Grid>
          <Grid item sx={{ marginLeft: '1rem', paddingTop: '0.5rem'}}>
            <StatusIndicator
              message={projectData?.state?.message}
              size='medium'
              status={projectData?.state?.status}
            />
          </Grid>
        </Grid>
      </PageTitleWrapper>

      <Container maxWidth="xl">
        <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: '1.5rem'}}>
          <Link
            color="inherit"
            href="/projects"
            underline="hover"
          >
            Projects
          </Link>
          <Typography color="text.primary">{projectData?.name}</Typography>
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
                    <Tabs value={tab} onChange={handleChange} aria-label="basic tabs example">
                      <Tab label="Item One" />
                      <Tab label="JSON" />
                    </Tabs>
                  </Box>
                  <TabPanel tab={tab} index={0}>
                    Item One
                  </TabPanel>
                  <TabPanel tab={tab} index={1}>
                    { projectData &&
                      <CopyBlock
                        text={JSON.stringify(projectData, null, 4)}
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

ContentTypes.getInitialProps = async (ctx) => {
  const { params } = ctx.query

  return { params: params }
}

ContentTypes.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default ContentTypes;
