'use client'
import React, { useContext, useMemo, useState } from 'react'

import { Typography, Tooltip } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

// API
import { getTranslations } from 'bloomreach-content-management-apis';

// Contexts
import { ConfigurationContext } from 'src/contexts'

// Icons
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';// Document
import DevicesOutlinedIcon from '@mui/icons-material/DevicesOutlined'; // Channel
import FolderOpenIcon from '@mui/icons-material/FolderOpen'; // Folder
import SnippetFolderOutlinedIcon from '@mui/icons-material/SnippetFolderOutlined';
import WebIcon from '@mui/icons-material/Web'; // Page


export const ChannelsHierarchicalList = ({
  channels,
  onItemFocus,
}) => {
  if (!channels) return null

  // Sort the channels alphabetically and filter out the administration folder
  channels = channels
    .sort((a, b) => (a.path < b.path) ? -1 : (a.path > b.path) ? 1 : 0)
    .filter(channel => channel.path !== '/content/documents/administration')

  return (
    <SimpleTreeView
      onItemFocus={(event, value) => {
        console.log('item', value)
        onItemFocus(value)
      }}
    >
      {channels.map((channel) => <Channel key={channel.path} channel={channel} /> )}
    </SimpleTreeView>
  )
}


const Channel = ({ channel }) => {
  const [disabled, setDisabled] = useState(true)
  // Context
  const  {appConfiguration } = useContext(ConfigurationContext)
  const { environment, xAuthToken } = appConfiguration.environments?.source

  let displayName = channel.displayName
  if (!displayName) {
    displayName = channel.path.split('/').pop()
  }

  useMemo(() => {
    // Check if the channel is part of a translation group
    const formattedPath = channel.path.replace(/^\/+/g, '') // Remove leading slashes
    getTranslations(environment, xAuthToken, formattedPath, false)
      .then(() => setDisabled(false))
      .catch(() => setDisabled(true));
  }, [channel])

  const documents = channel.documents

  let folders = channel.folders
  const pagesFolder = folders && folders.find(folder => folder.type === 'pageFolder')
  folders = folders && folders.filter(folder => folder.type !== 'pageFolder')

  if (disabled) {
    return (
      <TreeItem disabled itemId={channel.path}
        label={
          <Tooltip
            arrow
            entryDelay={1000}
            placement='right'
            title={
              <Typography>
                Channel <strong>{displayName}</strong> does not belong to a translation group
              </Typography>
            }
          >
            <Typography sx={{ display: 'flex', alignContent: 'center', flexGrow: '0', width: 'auto'}}>
              <DevicesOutlinedIcon fontSize='small' sx={{ mr: 1 }} />
              {displayName}
            </Typography>
          </Tooltip>
        }
      />
    )
  } else {
    return (
      <TreeItem itemId={channel.path}
        label={
          <Typography sx={{ display: 'flex', alignContent: 'center'}}>
            <DevicesOutlinedIcon fontSize='small' sx={{ mr: 1 }} />
            {displayName}
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
