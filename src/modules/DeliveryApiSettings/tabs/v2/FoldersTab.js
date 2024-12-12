'use client'

import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { CopyBlock } from 'react-code-blocks'
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


export const FoldersTab = () => {
  const theme = useTheme()

  // Context
  const { appConfiguration } = useContext(ConfigurationContext)
  const { environment } = appConfiguration.environments?.source

  // State
  const [ channels, setChannels ] = useState([])
  const [ selectedChannel, setSelectedChannel ] = useState(null)

  const [ pagePath, setPagePath ] = useState('/')
  const [ page, setPage ] = useState(null)

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

  const handlePageRequest = () => {
    axios.get(`https://${environment}.bloomreach.io/delivery/site/v1/channels/${selectedChannel}/pages${pagePath}`)
      .then(response => setPage(response.data))
      .catch(error => {
        console.error(error)
        setPage({ error: '404 - Not Found' })
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
          <Typography variant='h4'>Folders API</Typography>
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
            label='Page Path'
            value={pagePath || ''}
            fullWidth
            onChange={(e) => setPagePath(e.target.value)}
            placeholder='/about'
          />

          <Typography variant='p' component='p'>Request URL:</Typography>
          <Typography variant='p' component='p' sx={{ mt: '0 !important' }}><strong>https://{environment}.bloomreach.io/delivery/site/v2/channels/{selectedChannel}/pages{pagePath}</strong></Typography>

          <Button
            variant='contained'
            color='primary'
            onClick={handlePageRequest}
            fullWidth={false}
          >Send</Button>
        </Stack>
      </Paper>

      <Paper square={false} elevation={0} sx={{ mt: 2, padding: 2, border: `1px solid ${theme.colors.alpha.black[30]}` }}>
        <Stack spacing={3} display={'block'}>
          <Typography variant='h4'>Response:</Typography>
          <Box sx={{ maxWidth: '40vw', width: '100%' }}>
            {page &&
              <CopyBlock
                text={JSON.stringify(page, null, 4)}
                language='json'
                wrapLines={true}
                showLineNumbers={true}
                codeBlock
                theme={bloomreachTheme}
              />
            }
          </Box>
        </Stack>
      </Paper>
    </>
  )
}
