import { useContext, useEffect, useState } from 'react'
import NextLink from 'next/link'

// API
import {
  getAllComponents,
  getAllComponentGroups,
} from '/api'

// Components
import CopyComponentModal from 'components/channels/CopyComponentModal'
import DeleteComponentModal from 'components/channels/DeleteComponentModal'
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

// Contexts
import { ConfigurationContext } from 'src/contexts/ConfigurationContext';
import { ErrorContext } from 'src/contexts/ErrorContext';

// Constants
import { DATA_GRID_HEIGHT_CHANNELS_TABS } from 'lib/constants'

// Icons
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';

export const ComponentsTab = ({ channel }) => {
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

  const [componentGroups, setComponentGroups] = useState([])
  const [selectedComponentGroup, setSelectedComponentGroup] = useState(null)

  const [components, setComponents] = useState([])
  const [selectedComponents, setSelectedComponents] = useState([])

  const [showCopyComponentsModal, setShowCopyComponentsModal] = useState(false)
  const [showDeleteComponentsModal, setShowDeleteComponentsModal] = useState(false)

  useEffect(() => {
    getAllComponentGroups(environment, xAuthToken, channel.id)
      .then(response => {
        setComponentGroups(response.data)
        setSelectedComponentGroup(response.data.filter(group => !group.system)[0])
        setIsLoaded(true)
      })
      .catch(error => {
        handleShowSnackbar('error', error.message)
        setIsLoaded(true)
      })

  }, [channel])

  useEffect(() => {
    if (selectedComponentGroup) {
      getAllComponents(environment, xAuthToken, channel.id, selectedComponentGroup.name)
        .then(response => {
          const columns = response.data.map(item => {
            return {
              id: item.id,
              ctype: item.ctype,
              label: item.label,
            }
          })
          setComponents(columns)
          setPageSize(columns.length)
        })
        .catch(error => handleShowSnackbar('error', error.message))
    }
  }, [selectedComponentGroup])


  const handleComponentGroupChange = (event) => {
    event.preventDefault()
    setSelectedComponentGroup(event.target.value)
  }

  const columns = [
    {
      field: 'actions',
      headerName: '',
      width: 150,
      renderCell: (params) => {
        const padding = '0.25rem 0.5rem';
        return (
          !selectedComponentGroup?.system
            ?
            <ButtonGroup size="small" variant="outlined">
              <Button
                sx={{ padding: padding}}
                >
                <NextLink href={`/components/${channel.id}/${params.row.id}`}>
                  <EditIcon fontSize="small" />
                </NextLink>
              </Button>
              <Button
                sx={{ padding: padding}}
                onClick={() => {
                  setSelectedComponents([params.row.id])
                  setShowCopyComponentsModal(true)
                }}
              >
                <ContentCopyIcon fontSize="small" />
              </Button>
              <Button
                color="error"
                onClick={() => {
                  setSelectedComponents([params.row.id])
                  setShowDeleteComponentsModal(true)
                }}
                sx={{ padding: padding}}>
                <DeleteOutlineIcon fontSize="small" />
              </Button>
            </ButtonGroup>
          : null
        )
      }
    },
    {
      field: 'id',
      headerName: 'ID',
      width: 360,
    },
    {
      field: 'label',
      headerName: 'Display Name',
      width: 360,
      renderCell: (params) => {
        const href = `/components/${channel.id}/${params.row.id}`
        if (params.row.label) {
          return <NextLink href={href}>{params.row.label}</NextLink>
        } else {
          return <NextLink href={href}>{params.row.id}</NextLink>
        }
      }
    },
    {
      field: 'ctype',
      headerName: 'CType',
      width: 360,
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
          justifyContent="space-between"
          xs={12}>
            <Grid
              display="flex"
              alignItems="center"
              alignContent="center"
              justifyContent="space-between"
            >
              <FormControl
                variant="outlined"
                sx={{ my: 1, marginRight: 1, minWidth: 240 }}
              >
                <InputLabel id="componentGroup">Component Group</InputLabel>
                <Select
                  id="componentGroup"
                  labelId="componentGroup"
                  label="Component Group"
                  value={selectedComponentGroup || ''}
                  onChange={handleComponentGroupChange}
                >
                  {componentGroups.map(componentGroup => (
                    <MenuItem key={componentGroup.name} value={componentGroup}>
                      {componentGroup.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                disabled // TODO: Add ability to create component groups
                variant="outlined"
                startIcon={<AddIcon />}
              >Component Group</Button>
            </Grid>

          {!selectedComponentGroup?.system &&
            <div>
              <ButtonGroup aria-label="outlined primary button group">
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  disabled // TODO: Add ability to create components
                >New Component</Button>
                <Button
                  disabled={!selectedComponents.length}
                  onClick={setShowCopyComponentsModal}
                  startIcon={<ContentCopyIcon />}
                >Copy</Button>
                <Button
                  color="error"
                  variant="outlined"
                  disabled={!selectedComponents.length}
                  startIcon={<DeleteOutlineIcon />}
                  onClick={setShowDeleteComponentsModal}
                >Delete</Button>
              </ButtonGroup>
            </div>
          }
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ height: 'calc(100vh - 522px)', width: '100%' }}>
            {!!components?.length &&
              <DataGrid
                rows={components}
                columns={columns}
                pageSize={pageSize}
                stickyHeader
                onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                rowsPerPageOptions={[10, 20, 30, components?.length]}
                pagination
                checkboxSelection
                disableSelectionOnClick
                onSelectionModelChange={(ids) => setSelectedComponents(ids)}
                selectionModel={selectedComponents}
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

      <CopyComponentModal
        showCopyComponentsModal={showCopyComponentsModal}
        setShowCopyComponentsModal={setShowCopyComponentsModal}
        selectedComponents={selectedComponents}
        setSelectedComponents={setSelectedComponents}
        channelId={channel.id}
      />

      <DeleteComponentModal
        showDeleteComponentsModal={showDeleteComponentsModal}
        setShowDeleteComponentsModal={setShowDeleteComponentsModal}
        selectedComponents={selectedComponents}
        setSelectedComponents={setSelectedComponents}
        channelId={channel.id}
        selectedComponentGroup={selectedComponentGroup}
        setComponents={setComponents}
        setPageSize={setPageSize}
      />
    </>
  )
}
