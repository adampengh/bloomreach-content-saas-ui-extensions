import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { CopyBlock } from 'react-code-blocks'
import bloomreachTheme from 'src/theme/code-block/bloomreachTheme'

// APIs
import { getComponent } from 'api';

// Layouts
import SidebarLayout from 'src/layouts/SidebarLayout';

// Components
import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import {
  Breadcrumbs,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Link,
  Typography,
} from '@mui/material';

// Contexts
import { ConfigurationContext } from 'src/contexts/ConfigurationContext';

function ContentTypes() {
  const router = useRouter()
  console.log('router', router)
  const { params } = router.query
  console.log('params', params)
  const channelId = params?.[0]
  console.log('channelId', channelId)
  const componentGroup = params?.[1]
  console.log('componentGroup', componentGroup)
  const componentName = params?.[2]
  console.log('componentName', componentName)

  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [component, setComponent] = useState(null)
  const [xResourceVersion, setXResourceVersion] = useState(null)

  const {
    appConfiguration
  } = useContext(ConfigurationContext)

  const {
    environment,
    xAuthToken,
  } = appConfiguration.source

  useEffect(() => {
    if (environment && xAuthToken && channelId && componentGroup && componentName) {
      console.log('getComponent')
      getComponent(environment, xAuthToken, channelId, componentGroup, componentName)
        .then((response) => {
          console.log('component', response.data)
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
  }, [])

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
                  {component &&
                    <CopyBlock
                      text={JSON.stringify(component, null, 4)}
                      language='json'
                      wrapLines
                      theme={bloomreachTheme}
                      showLineNumbers={true}
                      codeBlock
                    />
                  }
                </CardContent>
              </Card>
            </Grid>
          }
        </Grid>
      </Container>
    </>
  );
}

ContentTypes.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default ContentTypes;
