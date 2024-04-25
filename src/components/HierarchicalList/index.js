'use client'
import { Typography } from '@mui/material';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

// Icons
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';// Document
import DevicesOutlinedIcon from '@mui/icons-material/DevicesOutlined'; // Channel
import FolderOpenIcon from '@mui/icons-material/FolderOpen'; // Folder
import SnippetFolderOutlinedIcon from '@mui/icons-material/SnippetFolderOutlined';
import WebIcon from '@mui/icons-material/Web'; // Page

export const HierarchicalList = ({ folders }) => {
  if (!folders) return null

  console.log('folders', folders)
  return (
    <SimpleTreeView
      onItemFocus={(event, value) => console.log('item', value)}
    >
      {/* {folders.map((folder, index) => {
        return <Folder key={index} folder={folder} />
      })} */}
      <Channel itemId='1.0' label='Reference SPA'>
        <PagesFolder itemId='2.3' label='Pages'>
          <Page itemId='2.3.0' label='About' />
          <PagesFolder itemId='2.3.1' label='products'>
            <Page itemId='2.3.2.0' label='All Products' />
            <Page itemId='2.3.2.1' label='Bolts' />
            <Page itemId='2.3.2.2' label='Nuts' />
            <Page itemId='2.3.2.3' label='Tools' />
          </PagesFolder>
        </PagesFolder>
        <Folder itemId='2.0' label='banners'>
          <Document itemId='2.0.2' label='Safe Workspace 1' />
          <Document itemId='2.0.3' label='Safe Workspace 2' />
        </Folder>
        <Folder itemId='2.1' label='content'>
          <Folder itemId='2.1.0' label='articles'>
            <Folder itemId='2.1.0.0' label='highlighted'>
              <Document itemId='2.1.0.1' label='How to use Acorn nuts?' />
            </Folder>
          </Folder>
        </Folder>
        <Folder itemId='2.2' label='labels' />
        <Folder itemId='2.4' label='category-content' />
        <Folder itemId='2.5' label='plp' />
      </Channel>
    </SimpleTreeView>
  )
}

const Channel = ({
  itemId,
  label,
  children,
}) => {
  return (
    <TreeItem itemId={itemId} label={
      <Typography sx={{ display: 'flex', alignContent: 'center'}}>
        <DevicesOutlinedIcon fontSize='small' sx={{ mr: 1 }} />
        {label}
      </Typography>
    }>
      {children}
    </TreeItem>
  )
}

const Folder = ({
  itemId,
  label,
  children,
}) => {
  return (
    <TreeItem
      itemId={itemId}
      label={
        <Typography sx={{ display: 'flex', alignContent: 'center'}}>
          <FolderOpenIcon fontSize='small' sx={{ mr: 1 }} />
          {label}
        </Typography>
      }
    >
      {children}
    </TreeItem>
  )
}


const Document = ({
  itemId,
  label,
}) => {
  return (
    <TreeItem
      itemId={itemId}
      label={
        <Typography sx={{ display: 'flex', alignContent: 'center'}}>
          <DescriptionOutlinedIcon fontSize='small' sx={{ mr: 1 }} />
          {label}
        </Typography>
      }
    />
  )
}

const PagesFolder = ({
  itemId,
  label,
  children,
}) => {
  return (
    <TreeItem itemId={itemId} label={
      <Typography sx={{ display: 'flex', alignContent: 'center'}}>
        <SnippetFolderOutlinedIcon fontSize='small' sx={{ mr: 1 }} />
        {label}
      </Typography>
    }>
      {children}
    </TreeItem>
  )
}

const Page = ({
  itemId,
  label,
}) => {
  return (
    <TreeItem itemId={itemId} label={
      <Typography sx={{ display: 'flex', alignContent: 'center'}}>
        <WebIcon fontSize='small' sx={{ mr: 1 }} />
        {label}
      </Typography>
    } />
  )
}
