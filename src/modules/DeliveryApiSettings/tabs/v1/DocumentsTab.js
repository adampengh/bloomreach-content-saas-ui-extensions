'use client'

import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { CodeBlock } from 'react-code-blocks'
import bloomreachTheme from 'src/theme/code-block/bloomreachTheme'

// Components
import {
  useTheme,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

// Contexts
import { ConfigurationContext } from '@/contexts'


export const DocumentsTab = () => {
  const theme = useTheme()

  // Context
  const { appConfiguration } = useContext(ConfigurationContext)
  const { environment } = appConfiguration.environments?.source

  // State
  const [ channels, setChannels ] = useState([])
  const [ selectedChannel, setSelectedChannel ] = useState(null)

  const [ documentPath, setDocumentPath ] = useState('/')
  const [ document, setDocument ] = useState(null)

  useEffect(() => {
    if (environment) {
      axios.get(`https://${environment}.bloomreach.io/delivery/site/v1/channels`)
        .then(response => {
          setChannels(response.data)
          setSelectedChannel(response.data?.[0]?.name)
        })
        .catch(error => console.error(error))
    }
  }, [environment])

  const handleDocumentRequest = () => {
    axios.get(`https://${environment}.bloomreach.io/delivery/site/v1/channels/${selectedChannel}/documents${documentPath}`)
      .then(response => setDocument(response.data))
      .catch(error => {
        console.error(error)
        setDocument({ error: '404 - Not Found' })
      })
  }

  return (
    <>
      <Paper
        square={false}
        elevation={0}
        sx={{ padding: 2, border: `1px solid ${theme.colors.alpha.black[30]}` }}
      >
        <Stack spacing={3} display={'block'}>
          <Typography variant='h4'>Documents API</Typography>
          <FormControl fullWidth variant='outlined'>
            <InputLabel id='enabled'>Channel</InputLabel>
            <Select
              id='channel'
              labelId='channel'
              label={'Channel'}
              value={selectedChannel || ''}
              onChange={(e) => setSelectedChannel(e.target.value)}
            >
              {channels?.map((channel, index) => {
                return (
                  <MenuItem key={index} value={channel.name}>
                    {channel.name}
                  </MenuItem>
                )
              })}
            </Select>
          </FormControl>

          <TextField
            id='relativepath'
            name='relativepath'
            label='Document Relative Path'
            value={documentPath || ''}
            fullWidth
            onChange={(e) => setDocumentPath(e.target.value)}
            placeholder='/banners/banner-1'
          />

          <Typography variant='p' component='p'>Request URL:</Typography>
          <Typography variant='p' component='p' sx={{ mt: '0 !important', fontWeight: 700 }}>https://{environment}.bloomreach.io/delivery/site/v1/channels/{selectedChannel}/documents{documentPath}</Typography>

          <Button
            variant='contained'
            color='primary'
            onClick={handleDocumentRequest}
            fullWidth={false}
          >Send</Button>
        </Stack>
      </Paper>

      <Paper square={false} elevation={0} sx={{ mt: 2, padding: 2, border: `1px solid ${theme.colors.alpha.black[30]}` }}>
        <Stack spacing={3} display={'block'}>
          <Typography variant='h4'>Response:</Typography>
          <Box sx={{ maxWidth: '40vw', width: '100%' }}>
            {document &&
              <CodeBlock
                text={JSON.stringify(document, null, 4)}
                language='json'
                wrapLines={true}
                showLineNumbers={true}
                theme={bloomreachTheme}
                copied={false}
              />
            }
          </Box>
        </Stack>
      </Paper>
    </>
  )
}
