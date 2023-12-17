import React, { useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { CopyBlock } from 'react-code-blocks'
import bloomreachTheme from 'src/theme/code-block/bloomreachTheme'

// APIs
import { getContentType } from 'bloomreach-content-management-apis';

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
  const { id: contentTypeName } = router.query

  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [contentType, setContentType] = useState(null)
  const [xResourceVersion, setXResourceVersion] = useState(null)

  const {
    appConfiguration
  } = useContext(ConfigurationContext)

  const {
    environment,
    xAuthToken,
  } = appConfiguration.environments?.source

  useEffect(() => {
    if (environment && xAuthToken && contentTypeName) {
      getContentType(environment, xAuthToken, contentTypeName)
        .then((response) => {
          setContentType(response.data)
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
  }, [environment, xAuthToken, contentTypeName])

  return (
    <>
      { contentType &&
        <PageTitleWrapper>
          <PageTitle
            heading={`${contentType?.presentation?.displayName} (${contentType?.name})`}
            subHeading={`X-Resource-Version: ${xResourceVersion}`}
          />
        </PageTitleWrapper>
      }

      <Container maxWidth="xl">
        <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: '1.5rem'}}>
          <Link
            underline="hover"
            color="inherit"
            href="/content-types"
          >
            Content Types
          </Link>
          <Typography color="text.primary">{contentType?.presentation?.displayName}</Typography>
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
                  {contentType &&
                    <CopyBlock
                      text={JSON.stringify(contentType, null, 4)}
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
