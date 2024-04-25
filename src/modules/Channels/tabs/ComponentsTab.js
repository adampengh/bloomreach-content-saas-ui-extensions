import { useContext, useEffect, useState } from 'react'
import NextLink from 'next/link'

// API
import {
  getAllComponents,
  getAllComponentGroups,
} from 'bloomreach-content-management-apis'

// Components
import CopyComponentModal from '../modals/CopyComponentModal'
import CreateComponentGroupModal from '../modals/CreateComponentGroupModal'
import DeleteComponentModal from '../modals/DeleteComponentModal'
import DeleteComponentGroupModal from '../modals/DeleteComponentGroupModal'
import {
  Box,
  Button,
  ButtonGroup,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Tooltip,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'

// Contexts
import { ConfigurationContext, ErrorContext, LoadingContext } from 'src/contexts'

// Icons
import AddIcon from '@mui/icons-material/Add'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import EditIcon from '@mui/icons-material/Edit'


export const ComponentsTab = ({ channel }) => {
  // Context
  const { appConfiguration } = useContext(ConfigurationContext)
  const { handleShowSnackbar } = useContext(ErrorContext)
  const { environment, xAuthToken } = appConfiguration.environments?.source
  const { setLoading } = useContext(LoadingContext)

  // State
  const [pageSize, setPageSize] = useState(10);

  const [componentGroups, setComponentGroups] = useState([])
  const [selectedComponentGroup, setSelectedComponentGroup] = useState(null)

  const [components, setComponents] = useState([])
  const [selectedComponents, setSelectedComponents] = useState([])

  const [showCreateComponentGroupModal, setShowCreateComponentGroupModal] = useState(false)
  const [showDeleteComponentGroupModal, setShowDeleteComponentGroupModal] = useState(false)

  const [showCopyComponentsModal, setShowCopyComponentsModal] = useState(false)
  const [showDeleteComponentsModal, setShowDeleteComponentsModal] = useState(false)

  useEffect(() => {
    setLoading({ loading: true, message: 'Loading Component Groups' })
    getAllComponentGroups(environment, xAuthToken, channel.id)
      .then(response => {
        setComponentGroups(response.data)
        setSelectedComponentGroup(response.data.filter(group => !group.system)[0])
        setLoading({ loading: false, message: '' })
      })
      .catch(error => {
        handleShowSnackbar('error', error.message)
        setLoading({ loading: false, message: '' })
      })
  }, [channel])

  useEffect(() => {
    if (selectedComponentGroup) {
      setLoading({ loading: true, message: 'Loading Components' })
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
          setLoading({ loading: false, message: '' })
        })
        .catch(error => {
          handleShowSnackbar('error', error.message)
          setLoading({ loading: false, message: '' })
        })
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
        return !selectedComponentGroup?.system
          ?
          <ButtonGroup size='small' variant='outlined'>
            <Button
              sx={{ padding: padding}}
              >
              <NextLink href={`/components/${channel.id}/${params.row.id}`} legacyBehavior>
                <EditIcon fontSize='small' />
              </NextLink>
            </Button>
            <Button
              sx={{ padding: padding}}
              onClick={() => {
                setSelectedComponents([params.row.id])
                setShowCopyComponentsModal(true)
              }}
            >
              <ContentCopyIcon fontSize='small' />
            </Button>
            <Button
              color='error'
              onClick={() => {
                setSelectedComponents([params.row.id])
                setShowDeleteComponentsModal(true)
              }}
              sx={{ padding: padding}}>
              <DeleteOutlineIcon fontSize='small' />
            </Button>
          </ButtonGroup>
        : null;
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
          return <NextLink href={href} legacyBehavior>{params.row.label}</NextLink>;
        } else {
          return <NextLink href={href} legacyBehavior>{params.row.id}</NextLink>;
        }
      }
    },
    {
      field: 'ctype',
      headerName: 'CType',
      width: 360,
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
          justifyContent='space-between'
          xs={12}>
            <Grid
              display='flex'
              alignItems='center'
              alignContent='center'
              justifyContent='space-between'
            >
              <FormControl
                variant='outlined'
                sx={{ my: 1, marginRight: 1, minWidth: 240 }}
              >
                <InputLabel id='componentGroup'>Component Group</InputLabel>
                <Select
                  id='componentGroup'
                  labelId='componentGroup'
                  label='Component Group'
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
              <ButtonGroup aria-label='outlined primary button group'>
                {/* Add Component Group */}
                <Tooltip
                  leaveDelay={0}
                  title='Add Component Group'
                >
                  <IconButton onClick={() => setShowCreateComponentGroupModal(true)}>
                    <AddIcon fontSize='small'/>
                  </IconButton>
                </Tooltip>
                {/* Delete Component Group */}
                {!components?.length &&
                  <Tooltip
                    leaveDelay={0}
                    title='Delete Component Group'
                  >
                    <IconButton color='error' onClick={() => setShowDeleteComponentGroupModal(true)}>
                      <DeleteOutlineIcon fontSize='small' />
                    </IconButton>
                  </Tooltip>
                }
              </ButtonGroup>
            </Grid>

          {!selectedComponentGroup?.system &&
            <div>
              <ButtonGroup aria-label='outlined primary button group'>
                <Button
                  variant='contained'
                  startIcon={<AddIcon />}
                  disabled // TODO: Add ability to create components
                >New Component</Button>
                <Button
                  disabled={!selectedComponents.length}
                  onClick={setShowCopyComponentsModal}
                  startIcon={<ContentCopyIcon />}
                >Copy</Button>
                <Button
                  color='error'
                  variant='outlined'
                  disabled={!selectedComponents.length}
                  startIcon={<DeleteOutlineIcon />}
                  onClick={setShowDeleteComponentsModal}
                >Delete</Button>
              </ButtonGroup>
            </div>
          }
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ minHeight: '300px', height: 'calc(100vh - 522px)', width: '100%' }}>
            {!!components?.length && columns &&
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

      <CreateComponentGroupModal
        showModal={showCreateComponentGroupModal}
        setShowModal={setShowCreateComponentGroupModal}
        componentGroups={componentGroups}
        setComponentGroups={setComponentGroups}
        selectedComponentGroup={selectedComponentGroup}
        setSelectedComponentGroup={setSelectedComponentGroup}
        channelId={channel.id}
        environment={environment}
        xAuthToken={xAuthToken}
      />

      {componentGroups && selectedComponentGroup && <DeleteComponentGroupModal
        showModal={showDeleteComponentGroupModal}
        setShowModal={setShowDeleteComponentGroupModal}
        componentGroups={componentGroups}
        setComponentGroups={setComponentGroups}
        selectedComponentGroup={selectedComponentGroup}
        setSelectedComponentGroup={setSelectedComponentGroup}
        channelId={channel.id}
        environment={environment}
        xAuthToken={xAuthToken}
      />}

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
