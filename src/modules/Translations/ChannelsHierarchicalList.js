'use client'
import React, { useMemo, useState } from 'react'

import { Typography } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

// API
import { getFolder } from 'bloomreach-content-management-apis';

// Icons
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';// Document
import DevicesOutlinedIcon from '@mui/icons-material/DevicesOutlined'; // Channel
import FolderOpenIcon from '@mui/icons-material/FolderOpen'; // Folder
import SnippetFolderOutlinedIcon from '@mui/icons-material/SnippetFolderOutlined';
import WebIcon from '@mui/icons-material/Web'; // Page


export const ChannelsHierarchicalList = ({
  environment,
  xAuthToken,
  channels,
  onItemFocus,
  setLoading,
}) => {
  // State
  const [channelFolders, setChannelFolders] = useState([])

  // Sort the channels alphabetically and filter out the administration folder
  // channels = channels
  //   .sort((a, b) => (a.path < b.path) ? -1 : (a.path > b.path) ? 1 : 0)
  //   .filter(channel => channel.path !== '/content/documents/administration')

  async function getChannelFolders(environment, xAuthToken, channels) {
    setLoading({ loading: true, message: 'Loading Channels...' })
    let processChannels = []
    for await (const channel of channels) {
      console.log('getChannelFolders()', channel.id)
      setLoading({ loading: true, message: `Loading Channel: ${channel.displayName}` })
      await getFolder(environment, xAuthToken, `content/documents/${channel.id}`, 5)
        .then(response => {
          console.log('getFolder()', response.data)
          processChannels = [...processChannels, response.data]
        })
        .catch(error => console.error(error));
    }

    await console.log('Process Channels', processChannels)
    await setChannelFolders(processChannels)
    await setLoading({ loading: false, message: '' })
  }

  useMemo(() => {
    getChannelFolders(environment, xAuthToken, channels)
  }, [channels])


  return (
    <SimpleTreeView
      onItemFocus={(event, value) => {
        console.log('item', value)
        onItemFocus(value)
      }}
    >
      {channelFolders.map((channel) => <Channel key={channel.path} channel={channel} /> )}
    </SimpleTreeView>
  )
}


const Channel = ({ channel }) => {
  const documents = channel.documents

  let folders = channel.folders
  const pagesFolder = folders && folders.find(folder => folder.type === 'pageFolder')
  folders = folders && folders.filter(folder => folder.type !== 'pageFolder')

  return (
    <TreeItem itemId={channel.path}
      label={
        <Typography sx={{ display: 'flex', alignContent: 'center'}}>
          <DevicesOutlinedIcon fontSize='small' sx={{ mr: 1 }} />
          {channel.displayName}
        </Typography>
      }
    >
      {pagesFolder && <PagesFolder key={pagesFolder.path} folder={pagesFolder} />}
      {folders && folders.map((folder) =>
        <Folder key={folder.path} folder={folder} />
      )}
      {documents && documents.map((document) =>
        <Document key={document.path} document={document} />
      )}
    </TreeItem>
  )
}


const Folder = ({ folder }) => {
  let displayName = folder.displayName
  if (!displayName) {
    displayName = folder.path.split('/').pop()
  }

  const folders = folder.folders
  const documents = folder.documents

  return (
    <TreeItem
      itemId={folder.path}
      label={
        <Typography sx={{ display: 'flex', alignContent: 'center'}}>
          <FolderOpenIcon fontSize='small' sx={{ mr: 1 }} />
          {displayName}
        </Typography>
      }
    >
      {folders && folders.map((folder) =>
        <Folder key={folder.path} folder={folder} />
      )}
      {documents && documents.map((document) =>
        <Document key={document.path} document={document} />
      )}
    </TreeItem>
  )
}


const Document = ({ document }) => {
  let displayName = document.displayName
  if (!displayName) {
    displayName = document.path.split('/').pop()
  }

  return (
    <TreeItem
      itemId={document.path}
      label={
        <Typography sx={{ display: 'flex', alignContent: 'center'}}>
          <DescriptionOutlinedIcon fontSize='small' sx={{ mr: 1 }} />
          {displayName}
        </Typography>
      }
    />
  )
}


const PagesFolder = ({ folder }) => {
  let displayName = folder.displayName
  if (!displayName) {
    displayName = folder.path.split('/').pop()
  }

  const pageFolders = folder.folders
  const pages = folder.pages

  return (
    <TreeItem itemId={folder.path} label={
      <Typography sx={{ display: 'flex', alignContent: 'center'}}>
        <SnippetFolderOutlinedIcon fontSize='small' sx={{ mr: 1 }} />
        {displayName}
      </Typography>
    }>
      {pageFolders && pageFolders.map((pageFolder) =>
        <PagesFolder key={pageFolder.path} folder={pageFolder} />
      )}
      {pages && pages.map((page) =>
        <Page key={page.path} page={page} />
      )}
    </TreeItem>
  )
}


const Page = ({ page }) => {
  let displayName = page.displayName
  if (!displayName) {
    displayName = page.path.split('/').pop()
  }

  return (
    <TreeItem itemId={page.path} label={
      <Typography sx={{ display: 'flex', alignContent: 'center'}}>
        <WebIcon fontSize='small' sx={{ mr: 1 }} />
        {displayName}
      </Typography>
    } />
  )
}
