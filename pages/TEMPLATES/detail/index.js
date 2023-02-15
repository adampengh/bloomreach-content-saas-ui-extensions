import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { CopyBlock } from 'react-code-blocks'
import bloomreachTheme from 'src/theme/code-block/bloomreachTheme'

import sampleJson from 'mock-data/sample-component'

// APIs
import { getContentType } from 'api';

// Layouts
import SidebarLayout from 'src/layouts/SidebarLayout';

// Components
import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
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

function ContentTypes() {
  const router = useRouter()
  const { id } = router.query

  const [value, setValue] = useState(0);

  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [contentType, setContentType] = useState(null)

  const {
    appConfiguration
  } = useContext(ConfigurationContext)

  const {
    environment,
    xAuthToken,
    projectId,
  } = appConfiguration.source

  useEffect(() => {
    if (environment && xAuthToken && id) {
      setIsLoaded(true)
    } else {
      setIsLoaded(true)
    }
  }, [environment, xAuthToken, id])

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <PageTitleWrapper>
        <PageTitle
          heading={`DETAIL PAGE`}
          subHeading={`X-Resource-Version:`}
        />
      </PageTitleWrapper>

      <Container maxWidth="xl">
        <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: '1.5rem'}}>
          <Link
            underline="hover"
            color="inherit"
            href="/content-types"
          >
            Content Types
          </Link>
          <Typography color="text.primary">PAGE TITLE</Typography>
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
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                      <Tab label="Item One" />
                      <Tab label="Item Two" />
                      <Tab label="JSON" />
                    </Tabs>
                  </Box>
                  <TabPanel value={value} index={0}>
                    Item One
                  </TabPanel>
                  <TabPanel value={value} index={1}>
                    Item Two
                  </TabPanel>
                  <TabPanel value={value} index={2}>
                    { sampleJson &&
                      <CopyBlock
                        text={JSON.stringify(sampleJson, null, 4)}
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
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

ContentTypes.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default ContentTypes;
