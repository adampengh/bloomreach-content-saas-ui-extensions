import React, { useContext, useState } from 'react'

// API
import {

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
import { DevicesOutlinedIcon, SnippetFolderOutlinedIcon, WebIcon } from 'src/icons';

export default function CopyPagesModal({
  showModal,
  setShowModal,
  selectedPages,
  setSelectedPages,
  targetChannels,
  setTargetChannels,
  setPagesCopied,
}) {
  // Context
  const { appConfiguration } = useContext(ConfigurationContext)
  const { environment, xAuthToken } = appConfiguration.environments?.source
  const { showSnackbar } = useContext(ErrorContext)

  // State
  const [isProcessing, setIsProcessing] = useState(false)

  const handleClose = () => {
    setShowModal(false)
  }

  const handleCopyPages = async () => {
    await setIsProcessing(true)
    console.log('Copy Pages')

    await copyPages()

    await setIsProcessing(false)
  }


  const copyPages = async () => {
    await setPagesCopied({pages: []})
    for await (const targetChannel of targetChannels) {
      console.log('targetChannel', targetChannel)
      for await (const page of selectedPages) {
        console.log('page', page)
        if (page.includes('folder:')) {
          await copyFolder(page.replace('folder:', ''), targetChannel)
        } else {
          await copyPage(page, targetChannel)
        }
      }
    }

    // Remove all checked pages from Source Channel
    await setSelectedPages([])
    await setTargetChannels([])
    await setShowModal(false)
  }


  const copyFolder = async (folder, targetChannel) => {
    console.group('copyFolder')
    console.log('folder', folder)
    console.log('targetChannel', targetChannel)
    console.groupEnd()
  }

  const copyPage = async (page, targetChannel) => {
    console.group('copyPage')
    console.log('page', page)
    console.log('targetChannel', targetChannel)


    // Recursively re-create folder structure from source channel to target channel
    // await copyFoldersRecursively(path, targetChannel)

    // Get Page from Source Channel
    // const pageData = await getPage(environment, xAuthToken, sourceChannel.branchOf, path, projectId)
    //   .then(response => response.data)
    //   .catch(async (err) => {
    //     if (err.response.status === 404) {
    //       return await getPage(environment, xAuthToken, sourceChannel.branchOf, path, 'core')
    //         .then(response => response.data)
    //     } else {
    //       console.error('Get page error', err);
    //     }
    //   })

    // Put Page into Target Channel
    // if (pageData) {
    //   await putPage(environment, xAuthToken, projectId, targetChannel.branchOf, path, pageData)
    //     .then(() => {
    //       setPagesCopied(prevState => ({
    //         pages: [...prevState.pages, {
    //           channel: targetChannel,
    //           page: pageData,
    //           status: 'new'
    //         }]
    //       }))
    //     })
    //   .catch(async (err) => {
    //     if (err.response.status === 409) {
    //       console.warn('Page already exists in this project. Getting x-resource-version and trying again.')
    //       await getPage(environment, xAuthToken, targetChannel.branchOf, path, projectId)
    //         .then(async (response) => {
    //           const xResourceVersion = response.headers['x-resource-version']
    //           await putPage(environment, xAuthToken, projectId, targetChannel.branchOf, path, pageData, xResourceVersion)
    //             .then(() => {
    //               setPagesCopied(prevState => ({
    //                 pages: [...prevState.pages, {
    //                     channel: targetChannel,
    //                     page: pageData,
    //                     status: 'updated'
    //                 }]
    //               }))
    //             })
    //             .catch((err) => {
    //               console.error('Failed to putPage existing page:', err);
    //             })
    //           })
    //     } else {
    //       console.error('Failed to putPage:', err.response);
    //       setPagesCopied(prevState => ({
    //         pages: [...prevState.pages, {
    //           channel: targetChannel,
    //           page: pageData,
    //           status: 'failed',
    //           error: err.response.data
    //         }]
    //       }))
    //     }
    //   })
    // }

    console.groupEnd()
  }


  const copyFoldersRecursively = async (path, targetChannel) => {
    console.group('createFoldersRecursively')
    console.log('path', path)

    // let segments = path.split('/')
    // console.log('segments', segments)
    // segments.pop()

    // get the allowed document types and folder types for the existing folder
    // const [allowedDocumentTypes, allowedFolderTypes] = await getFolder(environment, xAuthToken, path)

    // let folderPath = targetChannel.contentRootPath;
    // for await (const segment of segments) {
    //   console.log('segment', segment)
    //   folderPath += '/' + segment
    //   console.log('folderPath', folderPath)
    //   await getFolder(environment, xAuthToken, folderPath)
    //     .catch(async (error) => {
    //       if (error.response.status === 404) {
    //         await createOrUpdateFolder(environment, xAuthToken, 'pageFolder', folderPath, segment)
    //       } else {
    //         console.error('Error creating folders recursively: ', error)
    //       }
    //     })
    // }

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
            <Grid item xs={6}>

              {/* Folders */}
              <Typography variant='h4'>Folders to Copy</Typography>
              <List dense>
                {selectedPages.filter(item => item.includes('folder:')).map((page) => {
                  return (
                    <ListItem key={page} dense disableGutters>
                      <ListItemIcon sx={{ minWidth: '36px' }}>
                        <SnippetFolderOutlinedIcon />
                      </ListItemIcon>
                      <ListItemText primary={page.replace('folder:', '')} />
                    </ListItem>
                  )}
                )}
              </List>

              {/* Pages */}
              <Typography variant='h4'>Pages to Copy</Typography>
              <List dense>
                {selectedPages.filter(item => !item.includes('folder:')).map((page) => {
                  return (
                    <ListItem key={page} dense disableGutters>
                      <ListItemIcon sx={{ minWidth: '36px' }}>
                        <WebIcon />
                      </ListItemIcon>
                      <ListItemText primary={page} />
                    </ListItem>
                  )}
                )}
              </List>
            </Grid>
            <Grid item xs={6}>
              <Typography variant='h4'>To Channels</Typography>
              <List dense>
                {targetChannels.map((channel, index) => {
                  return (
                    <ListItem key={index} dense disableGutters>
                      <ListItemIcon sx={{ minWidth: '36px' }}>
                        <DevicesOutlinedIcon />
                      </ListItemIcon>
                      <ListItemText primary={`${channel.name} (${channel.branch})`} />
                    </ListItem>
                  )}
                )}
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
