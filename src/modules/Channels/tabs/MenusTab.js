import { useContext, useEffect, useState } from 'react'
import NextLink from 'next/link'

// API
import {
  getAllMenus,
} from 'bloomreach-content-management-apis'

// Components
import CopyMenusModal from '../modals/CopyMenusModal'
import DeleteMenusModal from '../modals/DeleteMenusModal'
import {
  Box,
  Button,
  ButtonGroup,
  Grid,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

// Contexts
import { ConfigurationContext, ErrorContext, LoadingContext } from 'src/contexts'

// Constants
import { DATA_GRID_HEIGHT_CHANNELS_TABS } from 'src/lib/constants'

// Icons
import { AddIcon, ContentCopyIcon, DeleteOutlineIcon, EditIcon } from 'src/icons'

export const MenusTab = ({ channel }) => {
  // Context
  const { appConfiguration } = useContext(ConfigurationContext)
  const { environment, xAuthToken } = appConfiguration.environments?.source
  const { handleShowSnackbar } = useContext(ErrorContext)
  const { setLoading } = useContext(LoadingContext)

  // State
  const [pageSize, setPageSize] = useState(10);

  const [menus, setMenus] = useState([])
  const [selectedItems, setSelectedItems] = useState([])

  const [showCopyModal, setShowCopyModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    console.log('useEffect getAllMenus()')
    setLoading({ loading: true, message: 'Loading Menus' })
    getAllMenus(environment, xAuthToken, channel.id)
      .then(response => {
        console.log('menus', response.data)
        const columns = response.data.map(item => {
          console.log('item', item)
          return {
            id: item
          }
        })
        setMenus(columns)
        setPageSize(columns.length)
        setLoading({ loading: false, message: '' })
      })
      .catch(error => {
        setLoading({ loading: false, message: '' })
        handleShowSnackbar('error', error.message)
      })
  }, [channel])


  const columns = [
    {
      field: 'actions',
      headerName: '',
      width: 150,
      renderCell: (params) => {
        const padding = '0.25rem 0.5rem';
        return (
          <ButtonGroup size='small' variant='outlined'>
            <Button
              disabled
              sx={{ padding: padding}}
              >
              <NextLink href={`/status/coming-soon`} legacyBehavior>
                <EditIcon fontSize='small' />
              </NextLink>
            </Button>
            <Button
              sx={{ padding: padding}}
              onClick={() => {
                setSelectedItems([params.row.id])
                setShowCopyModal(true)
              }}
            >
              <ContentCopyIcon fontSize='small' />
            </Button>
            <Button
              color='error'
              onClick={() => {
                setSelectedItems([params.row.id])
                setShowDeleteModal(true)
              }}
              sx={{ padding: padding}}>
              <DeleteOutlineIcon fontSize='small' />
            </Button>
          </ButtonGroup>
        );
      }
    },
    {
      field: 'id',
      headerName: 'Menu',
      width: 240,
      renderCell: (params) => {
        // const href = `/menus/${params.row.id}`
        if (params.row.label) {
          return <NextLink href={'/status/coming-soon'} legacyBehavior>{params.row.label}</NextLink>;
        } else {
          return <NextLink href={'/status/coming-soon'} legacyBehavior>{params.row.id}</NextLink>;
        }
      }
    },
  ];

  return (
    <>
      <Grid
        container
        direction='row'
        justifyContent='space-between'
        alignItems='center'
        alignContent='center'
        rowSpacing={3}
        sx={{ width: '100%' }}
      >
        <Grid
          item
          display='flex'
          alignItems='center'
          alignContent='center'
          justifyContent='flex-end'
          xs={12}
          >
          <ButtonGroup aria-label='outlined primary button group'>
            <Button
              variant='contained'
              startIcon={<AddIcon />}
              disabled // TODO: Add ability to create menu
            >New Menu</Button>
            <Button
              disabled={!selectedItems.length}
              onClick={setShowCopyModal}
              startIcon={<ContentCopyIcon />}
            >Copy</Button>
            <Button
              color='error'
              variant='outlined'
              disabled={!selectedItems.length}
              startIcon={<DeleteOutlineIcon />}
              onClick={() => setShowDeleteModal(true)}
            >Delete</Button>
          </ButtonGroup>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ height: `calc(100vh - ${DATA_GRID_HEIGHT_CHANNELS_TABS})`, width: '100%' }}>
            {!!menus?.length &&
              <DataGrid
                rows={menus}
                columns={columns}
                pageSize={pageSize}
                stickyHeader
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowsPerPageOptions={[10, 20, 30, menus?.length]}
                pagination
                checkboxSelection
                disableSelectionOnClick
                onSelectionModelChange={(ids) => setSelectedItems(ids)}
                selectionModel={selectedItems}
                initialState={{
                  sorting: {
                    sortModel: [{
                      field: 'id',
                      sort: 'asc'
                    }]
                  }
                }}
            /> }
          </Box>
        </Grid>
      </Grid>

      <CopyMenusModal
        showCopyModal={showCopyModal}
        setShowCopyModal={setShowCopyModal}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        channelId={channel.id}
      />

      <DeleteMenusModal
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        setMenus={setMenus}
        channelId={channel.id}
      />
    </>
  )
}
