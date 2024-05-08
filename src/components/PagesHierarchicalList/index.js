'use client'

// Components
import { Typography } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

// Icons
import { DevicesOutlinedIcon, SnippetFolderOutlinedIcon, WebIcon } from 'src/icons';

export const PagesHierarchicalList = ({
  pageFolders,
  selectedPages,
  setSelectedPages,
}) => {
  return (
    <SimpleTreeView
      multiSelect
      onSelectedItemsChange={(_, itemIds) => setSelectedPages(itemIds)}
      selectedItems={selectedPages}
    >
      {pageFolders.map((channelDetails, index) => <Channel key={index} channelDetails={channelDetails} /> )}
    </SimpleTreeView>
  )
}


const Channel = ({ channelDetails }) => {
  const { channel, folders: pagesFolder } = channelDetails
  return (
    <TreeItem itemId={channel.id}
      label={
        <Typography sx={{ display: 'flex', alignContent: 'center'}}>
          <DevicesOutlinedIcon fontSize='small' sx={{ mr: 1 }} />
          {channel.name}
        </Typography>
      }
    >
      {pagesFolder && <PagesFolder key={pagesFolder.path} folder={pagesFolder} />}
    </TreeItem>
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
    <TreeItem itemId={`folder:${folder.path}`} label={
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
