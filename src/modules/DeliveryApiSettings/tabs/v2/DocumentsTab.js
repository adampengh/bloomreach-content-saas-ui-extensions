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
import { set } from 'nprogress'

const UUIDregex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/gi

export const DocumentsTab = () => {
  const theme = useTheme()

  // Context
  const { appConfiguration } = useContext(ConfigurationContext)
  const { environment } = appConfiguration.environments?.source

  // State
  const [ documentPath, setDocumentPath ] = useState('/')
  const [ document, setDocument ] = useState(null)

  const handleDocumentRequest = () => {
    axios.get(`https://${environment}.bloomreach.io/delivery/site/v2/documents/${documentPath}`)
      .then(response => setDocument(response.data))
      .catch(error => {
        console.error(error)
        setDocument({ error: '404 - Not Found' })
      })
  }

  const handleDocumentPathChange = () => {
    console.log('handleDocumentPathChange', event.target.value)
    const pathOrUUID = event.target.value.startsWith('/') ? event.target.value.replace('/', '') : event.target.value

    console.log('pathOrUUID', pathOrUUID)
    console.log('UUIDregex', UUIDregex.test(documentPath))

    setDocumentPath(pathOrUUID)
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

          <TextField
            id='relativepath'
            name='relativepath'
            label='Document Relative Path or UUID'
            value={documentPath || ''}
            fullWidth
            onChange={() => handleDocumentPathChange()}
            placeholder='/banners/banner-1'
          />

          <Typography variant='p' component='p'>Request URL:</Typography>
          <Typography variant='p' component='p' sx={{ mt: '0 !important', fontWeight: 700 }}>https://{environment}.bloomreach.io/delivery/site/v2/documents/{documentPath}</Typography>

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
