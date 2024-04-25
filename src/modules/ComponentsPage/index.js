'use client'

import React, { useContext, useEffect, useState } from 'react'
import { CopyBlock } from 'react-code-blocks'
import bloomreachTheme from 'src/theme/code-block/bloomreachTheme'

// APIs
import { getComponent } from 'bloomreach-content-management-apis'

// Components
import { TabPanel } from 'src/components'
import {
  Box,
  Breadcrumbs,
  Card,
  CardContent,
  Checkbox,
  Container,
  FormControlLabel,
  FormGroup,
  Grid,
  Link,
  Tab,
  Tabs,
  TextField,
  Typography,
} from '@mui/material'

// Contexts
import { ConfigurationContext, LoadingContext } from 'src/contexts'


const ComponentsPage = ({ channelId, componentGroup, componentName }) => {
  const [tab, setTab] = useState(0);
  const [component, setComponent] = useState(null)

  const { appConfiguration } = useContext(ConfigurationContext)
  const { environment, xAuthToken } = appConfiguration?.environments?.source
  const { setLoading } = useContext(LoadingContext)

  useEffect(() => {
    if (environment && xAuthToken && channelId && componentGroup && componentName) {
      setLoading({ loading: true, message: '' })
      getComponent(environment, xAuthToken, channelId, componentGroup, componentName)
        .then((response) => {
          setComponent(response.data)
          setLoading({ loading: false, message: '' })
        })
        .catch(() => setLoading({ loading: false, message: '' }))
    } else {
      setLoading({ loading: false, message: '' })
    }
  }, [environment, xAuthToken, channelId, componentGroup, componentName])

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  if (!channelId && !componentGroup && !componentName) {
    return null;
  }

  return (
    <Container maxWidth='xl'>
      <Breadcrumbs aria-label='breadcrumb' sx={{ marginBottom: '1.5rem' }}>
        <Link
          underline='hover'
          color='inherit'
          href='/components'
        >
          Components
        </Link>
        <Typography color='text.primary'></Typography>
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
                <Tabs value={tab} onChange={handleTabChange} aria-label='basic tabs example'>
                  <Tab label='Configuration' />
                  <Tab label='Properties' />
                  <Tab label='JSON' />
                </Tabs>
              </Box>
              <TabPanel value={tab} index={0}>
                <Box
                  component='form'
                  sx={{
                    '& .MuiTextField-root': { m: 1, width: '100%' }
                  }}
                  noValidate
                  autoComplete='off'
                  // onSubmit={handleSubmitSourceChannel}
                >
                  <div style={{ marginBottom: '1rem' }}>
                    <TextField
                      autoComplete='off'
                      id='id'
                      name='id'
                      label='ID'
                      value={component?.id || ''}
                      disabled={true}
                      // onChange={(e) => setSourceConfig({...sourceConfig, environment: e.target.value})}
                    />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <TextField
                      autoComplete='off'
                      id='label'
                      name='label'
                      label='Label'
                      value={component?.label || ''}
                      // onChange={(e) => setSourceConfig({...sourceConfig, environment: e.target.value})}
                    />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <TextField
                      autoComplete='off'
                      id='icon'
                      name='icon'
                      label='Icon'
                      value={component?.icon || ''}
                      // onChange={(e) => setSourceConfig({...sourceConfig, environment: e.target.value})}
                    />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <TextField
                      autoComplete='off'
                      id='ctype'
                      name='ctype'
                      label='Ctype'
                      value={component?.ctype || ''}
                      // onChange={(e) => setSourceConfig({...sourceConfig, environment: e.target.value})}
                    />
                  </div>
                  <div style={{ marginBottom: '1rem' }}>
                    <TextField
                      autoComplete='off'
                      id='xtype'
                      name='xtype'
                      label='Xtype'
                      value={component?.xtype || ''}
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
                        label='Hidden' />
                    </FormGroup>
                    <FormGroup sx={{ marginLeft: '0.5rem' }}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            id='system'
                            name='system'/>
                        }
                        label='System' />
                    </FormGroup>
                  </div>
                </Box>
              </TabPanel>
              <TabPanel value={tab} index={1}>
                Item Two
              </TabPanel>
              <TabPanel value={tab} index={2}>
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
      </Grid>
    </Container>
  )
}

export default ComponentsPage
