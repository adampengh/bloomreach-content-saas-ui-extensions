import React, { useContext, useEffect, useState } from 'react'

// API
import {
  getFolder,
  getPage,
  putPage,
} from 'bloomreach-content-management-apis'

// Components
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material'
import { LoadingButton } from '@mui/lab'

// Contexts
import { ConfigurationContext, ErrorContext, LoadingContext } from 'src/contexts'

// Icons
import { DevicesOutlinedIcon, EastIcon, SnippetFolderOutlinedIcon, WebIcon } from 'src/icons';
import { useTheme } from '@emotion/react'


export default function CopyPagesModal({
  showModal,
  setShowModal,
  selectedPages,
  setSelectedPages,
  targetChannels,
  setTargetChannels,
  setPagesCopied,
}) {
  const theme = useTheme()

  // Context
  const { appConfiguration } = useContext(ConfigurationContext)
  const { environment, xAuthToken, projectId } = appConfiguration.environments?.source
  const { showSnackbar } = useContext(ErrorContext)

  // State
  const [itemsToCopy, setItemsToCopy] = useState({
    folders: [],
    pages: [],
  });
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    console.log('selectedPages', selectedPages)
    const folders = selectedPages?.filter(item => item.includes('folder:'))?.map(item => item.replace('folder:', ''))
    const pages = selectedPages?.filter(item => !item.includes('folder:'))
    console.log('folders', folders)
    console.log('pages', pages)
    setItemsToCopy({
      folders: folders,
      pages: pages,
    })
  }, [selectedPages])


  const handleClose = () => {
    setShowModal(false)
  }


  const handleCopyPages = async () => {
    await setIsProcessing(true)
    await copyPages()
    await setIsProcessing(false)
  }


  // Copy Pages to Target Channel(s)
  const copyPages = async () => {
    console.group('COPY PAGES')

    // Loop through each selected target channel
    for await (const targetChannel of targetChannels) {
      const folders = itemsToCopy?.folders
      const pages = itemsToCopy?.pages

      // Copy Folders
      for await (const folder of folders) {
        console.log('COPY FOLDER', folder)
        await copyFolder(folder, targetChannel, true)
      }

      // Copy Pages
      for await (const page of pages) {
        console.log('COPY PAGE', page)
        await copyPage(page, targetChannel)
      }

      console.groupEnd()
    }

    // Remove all checked pages from Source Channel
    await setSelectedPages([])
    await setTargetChannels([])
    await setShowModal(false)
    console.groupEnd()
  }


  const copyFolder = async (folderPath, targetChannel, recursively = false) => {
    console.group('copyFolder')
    console.log('folderPath', folderPath)
    console.log('targetChannel', targetChannel)
    console.log('recursively', recursively)

    const depth = recursively ? 5 : 1

    // Get the folder from the Source channel
    const {pages, folders} = await getFolder(environment, xAuthToken, folderPath, depth)
      .then((response) => {
        const data = response.data
        return {
          pages: data.pages || [],
          folders: data.folders || [],
        }
      })
      .catch((error) => console.error('getFolder', error))

    // Folders to Copy
    for await (const folder of folders) {
      await copyFolder(folder?.path, targetChannel, true)
    }

    // Pages to Copy
    for (const page of pages) {
      await copyPage(page?.path, targetChannel)
    }

    console.groupEnd()
  }


  const copyPage = async (pagePath, targetChannel) => {
    console.group('copyPage')
    console.log('pagePath', pagePath)
    console.log('targetChannel', targetChannel)

    const regex = /(?:\/content\/documents\/)([a-zA-Z0-9-]*)(?:\/)(pages\/.*)/;
    const matches = pagePath.match(regex)
    const channel = matches[1]
    const path = matches[2]

    // Get the page from the source channel
    // If the page is not part of the project, get the page data from 'core'
    const pageData = await getPage(environment, xAuthToken, channel, path, projectId)
      .then(response => response.data)
      .catch(async (err) => {
        if (err.response.status === 404) {
          return await getPage(environment, xAuthToken, channel, path, 'core')
            .then(response => response.data)
        } else {
          console.error('Get page error', err);
        }
      })

    // Put Page into Target Channel
    if (pageData) {
      await putPage(environment, xAuthToken, projectId, targetChannel.branchOf, path, pageData)
        .then(() => {
          setPagesCopied(prevState => ({
            pages: [{
              channel: targetChannel,
              page: pageData,
              path: path,
              status: 'new',
              timestamp: new Date().toISOString(),
            }, ...prevState.pages]
          }))
        })
      .catch(async (err) => {
        if (err.response.status === 408) {
          console.warn('Page already exists in this project. Getting X-Resource-Version and trying again.')
          await getPage(environment, xAuthToken, targetChannel.branchOf, path, projectId)
            .then(async (response) => {
              const xResourceVersion = response.headers['x-resource-version']
              await putPage(environment, xAuthToken, projectId, targetChannel.branchOf, path, pageData, xResourceVersion)
                .then(() => {
                  setPagesCopied(prevState => ({
                    pages: [{
                      channel: targetChannel,
                      page: pageData,
                      path: path,
                      status: 'updated',
                      timestamp: new Date().toISOString(),
                    }, ...prevState.pages]
                  }))
                })
                .catch((err) => console.error('Failed to putPage existing page:', err))
              })
        } else {
          console.error('Failed to putPage:', err.response);
          setPagesCopied(prevState => ({
            pages: [{
              channel: targetChannel,
              page: pageData,
              path: path,
              status: 'failed',
              timestamp: new Date().toISOString(),
              error: err.response.data
            }, ...prevState.pages]
          }))
        }
      })
    }

    console.groupEnd()
  }


  return (
    <Dialog
      fullWidth={true}
      maxWidth={'lg'}
      open={showModal}
      onClose={handleClose}
    >
      <Box
        component='div'
        sx={{ '& .MuiTextField-root': { m: 1, width: '100%' } }}
        autoComplete='off'
      >
        <DialogTitle sx={{ fontWeight: 'bold' }}>
          <Typography variant='h3'>Copy Confirmation</Typography>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Grid container>
            <Grid item xs={5.5}>

              {/* Folders */}
              {itemsToCopy?.folders && (
                <>
                  <Typography variant='h4'>Folders to Copy</Typography>
                  <List dense>
                    {itemsToCopy?.folders?.map((folder) => (
                      <ListItem key={folder} dense disableGutters>
                        <ListItemIcon sx={{ minWidth: '36px' }}>
                          <SnippetFolderOutlinedIcon />
                        </ListItemIcon>
                        <ListItemText primary={folder} />
                      </ListItem>
                    ))}
                  </List>
                </>
              )}

              {/* Pages */}
              <Typography variant='h4'>Pages to Copy</Typography>
              <List dense>
                {itemsToCopy?.pages?.map((page) => (
                  <ListItem key={page} dense disableGutters>
                    <ListItemIcon sx={{ minWidth: '36px' }}>
                      <WebIcon />
                    </ListItemIcon>
                    <ListItemText primary={page} />
                  </ListItem>
                ))}
              </List>
            </Grid>

            <Grid item
              xs={1}
              sx={{
                '&.MuiGrid-item': {
                  width: '100%',
                  paddingTop: '1.5rem',
                  textAlign: 'center',
                }
              }}
            >
              <EastIcon sx={{
                background: theme.colors.primary.main,
                border: `1px solid ${theme.colors.primary.main}`,
                borderRadius: '50px',
                fill: theme.palette.common.white,
                fontSize: 36,
                padding: '0.5rem'
              }} />
            </Grid>

            <Grid item xs={5.5}>
              <Typography variant='h4'>To Channels</Typography>
              <List dense>
                {targetChannels.map((channel, index) => (
                  <ListItem key={index} dense disableGutters>
                    <ListItemIcon sx={{ minWidth: '36px' }}>
                      <DevicesOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary={`${channel.name} (${channel.branch})`} />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <LoadingButton
            loading={isProcessing}
            loadingPosition='start'
            variant='contained'
            type='submit'
            onClick={handleCopyPages}
            sx={{
              '&.MuiLoadingButton-loading': {
                paddingLeft: 2
              },
              '& .MuiLoadingButton-loadingIndicatorStart': {
                position: 'relative',
                left: '-6px'
              }
            }}
          >
            Copy
          </LoadingButton>
        </DialogActions>
      </Box>
    </Dialog>
  );
}
