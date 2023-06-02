import { useContext, useEffect, useState } from 'react'
import NextLink from 'next/link'

// API
import {
  getAllRoutes,
} from '/api'

// Components
import CopyRoutesModal from 'components/channels/CopyRoutesModal'
import {
  Box,
  Button,
  ButtonGroup,
  Grid,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

// Contexts
import { ConfigurationContext } from 'src/contexts/ConfigurationContext';
import { ErrorContext } from 'src/contexts/ErrorContext';

// Constants
import { DATA_GRID_HEIGHT_CHANNELS_TABS } from 'lib/constants'

// Icons
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';

export const RoutesTab = ({ channel }) => {
  // Context
  const { appConfiguration } = useContext(ConfigurationContext)
  const { handleShowSnackbar } = useContext(ErrorContext)

  const {
    environment,
    xAuthToken,
  } = appConfiguration.environments?.source

  // State
  const [isLoaded, setIsLoaded] = useState(false)
  const [pageSize, setPageSize] = useState(10);

  const [routes, setRoutes] = useState([])
  const [selectedItems, setSelectedItems] = useState([])

  const [showCopyModal, setShowCopyModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  useEffect(() => {
    console.log('useEffect getAllRoutes()')
    getAllRoutes(environment, xAuthToken, channel.id)
      .then(response => {
        console.log('routes', response.data)
        const columns = response.data.map(item => {
          console.log('item', item)
          return {
            id: item.name,
            layout: item.layout || '',
            relativeContentPath: item.relativeContentPath || ''
          }
        })
        setRoutes(columns)
        setPageSize(columns.length)
        setIsLoaded(true)
      })
      .catch(error => handleShowSnackbar('error', error.message))
  }, [channel])


  const columns = [
    {
      field: 'actions',
      headerName: '',
      width: 150,
      renderCell: (params) => {
        const padding = '0.25rem 0.5rem';
        return (
          <ButtonGroup size="small" variant="outlined">
            <Button
              disabled
              sx={{ padding: padding}}
              >
              <NextLink href={`/status/coming-soon`} legacyBehavior>
                <EditIcon fontSize="small" />
              </NextLink>
            </Button>
            <Button
              sx={{ padding: padding}}
              onClick={() => {
                setSelectedItems([params.row.id])
                setShowCopyModal(true)
              }}
            >
              <ContentCopyIcon fontSize="small" />
            </Button>
            <Button
              disabled
              color="error"
              onClick={() => {
                setSelectedItems([params.row.id])
                // setShowDeleteModal(true)
              }}
              sx={{ padding: padding}}>
              <DeleteOutlineIcon fontSize="small" />
            </Button>
          </ButtonGroup>
        );
      }
    },
    {
      field: 'id',
      headerName: 'Name',
      width: 240,
      renderCell: (params) => {
        const href = `/routes/${params.row.id}`
        if (params.row.label) {
          return <NextLink href={'/status/coming-soon'} legacyBehavior>{params.row.label}</NextLink>;
        } else {
          return <NextLink href={'/status/coming-soon'} legacyBehavior>{params.row.id}</NextLink>;
        }
      }
    },
    {
      field: 'layout',
      headerName: 'Layout',
      width: 200,
    },
    {
      field: 'relativeContentPath',
      headerName: 'Relative Content Path',
      width: 200,
    },
  ];

  if (!isLoaded) {
    return null
  }

  return (
    <>
      <Grid
        container
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        alignContent="center"
        rowSpacing={3}
        sx={{ width: '100%' }}
      >
        <Grid
          item
          display="flex"
          alignItems="center"
          alignContent="center"
          justifyContent="flex-end"
          xs={12}
          >
          <ButtonGroup aria-label="outlined primary button group">
            <Button
              disabled={!selectedItems.length}
              onClick={setShowCopyModal}
              startIcon={<ContentCopyIcon />}
            >Copy</Button>
            <Button
              color="error"
              variant="outlined"
              disabled
              // disabled={!selectedItems.length}
              startIcon={<DeleteOutlineIcon />}
              // onClick={setShowDeleteModal}
            >Delete</Button>
          </ButtonGroup>
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ height: `calc(100vh - ${DATA_GRID_HEIGHT_CHANNELS_TABS})`, width: '100%' }}>
            {!!routes?.length &&
              <DataGrid
                rows={routes}
                columns={columns}
                pageSize={pageSize}
                stickyHeader
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowsPerPageOptions={[10, 20, 30, routes?.length]}
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

      <CopyRoutesModal
        showCopyModal={showCopyModal}
        setShowCopyModal={setShowCopyModal}
        selectedItems={selectedItems}
        setSelectedItems={setSelectedItems}
        channelId={channel.id}
      />
    </>
  )
}
