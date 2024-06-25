'use client'
import React, { useContext, useEffect, useState } from 'react'
import { CopyBlock } from 'react-code-blocks'
import bloomreachTheme from 'src/theme/code-block/bloomreachTheme'

import sampleJson from 'src/mocks/sample-component'

// Components
import { TabPanel } from 'src/components'
import {
  Breadcrumbs,
  Box,
  Card,
  CardContent,
  Container,
  Grid,
  Link,
  Tabs,
  Tab,
  Typography,
} from '@mui/material';

// Contexts
import { LoadingContext } from 'src/contexts'

export const DetailTemplateModule = () => {
  const [value, setValue] = useState(0)

  const { setLoading } = useContext(LoadingContext)

  useEffect(() => {
    setLoading({ loading: true, message: 'Loading...' })

    // For demonstration purposes, set loading to false after 2000ms
    setTimeout(() => setLoading({ loading: false, message: ''}), 2000)
  }, [])

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Container maxWidth='xl'>
      <Breadcrumbs aria-label='breadcrumb' sx={{ marginBottom: '1.5rem'}}>
        <Link
          underline='hover'
          color='inherit'
          href='/content-types'
        >
          Content Types
        </Link>
        <Typography color='text.primary'>PAGE TITLE</Typography>
      </Breadcrumbs>

      <Grid
        container
        direction='row'
        justifyContent='center'
        alignItems='stretch'
        alignContent='stretch'
        sx={{
          '& .MuiCircularProgress-root': {
            margin: '24px'
          }
        }}
      >
        <Grid item xs={12}>
          <Card>
            <CardContent sx={{ fontWeight: 'bold', letterSpacing: '.05rem' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label='basic tabs example'>
                  <Tab label='Item One' />
                  <Tab label='Item Two' />
                  <Tab label='JSON' />
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
      </Grid>
    </Container>
  )
}
