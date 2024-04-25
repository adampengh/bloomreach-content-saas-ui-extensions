'use client'

import React, { useContext, useEffect, useState } from 'react'
import { CopyBlock } from 'react-code-blocks'
import bloomreachTheme from 'src/theme/code-block/bloomreachTheme'

// APIs
import { getContentType } from 'bloomreach-content-management-apis'

// Components
import PageTitle from 'src/components/PageTitle'
import PageTitleWrapper from 'src/components/PageTitleWrapper'
import {
  Breadcrumbs,
  Card,
  CardContent,
  Container,
  Grid,
  Link,
  Typography,
} from '@mui/material'

// Contexts
import { ConfigurationContext, LoadingContext } from 'src/contexts'


const ContentTypeDetailModule = ({ contentTypeName }) => {
  // State
  const [contentType, setContentType] = useState(null)
  const [xResourceVersion, setXResourceVersion] = useState(null)

  // Context
  const { appConfiguration } = useContext(ConfigurationContext)
  const { environment, xAuthToken } = appConfiguration.environments?.source
  const { setLoading } = useContext(LoadingContext)

  useEffect(() => {
    if (environment && xAuthToken && contentTypeName) {
      getContentType(environment, xAuthToken, contentTypeName)
        .then((response) => {
          setContentType(response.data)
          setXResourceVersion(response.headers['x-resource-version'])
          setLoading({ loading: false, message: '' })
        })
        .catch(() => setLoading({ loading: false, message: '' }))
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

      <Container maxWidth='xl'>
        <Breadcrumbs aria-label='breadcrumb' sx={{ marginBottom: '1.5rem'}}>
          <Link
            underline='hover'
            color='inherit'
            href='/content-types'
          >
            Content Types
          </Link>
          <Typography color='text.primary'>{contentType?.presentation?.displayName}</Typography>
        </Breadcrumbs>

        <Grid
          container
          direction='row'
          justifyContent='center'
          alignItems='stretch'
          alignContent='stretch'
        >
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
        </Grid>
      </Container>
    </>
  )
}

export default ContentTypeDetailModule
