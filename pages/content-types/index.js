import React, { useContext, useEffect, useState } from 'react'
import Head from 'next/head';
import NextLink from 'next/link';

// APIs
import {
  getAllContentTypes,
  getDeveloperProject,
} from 'api';

// Layouts
import SidebarLayout from 'src/layouts/SidebarLayout';

// Components
import CopyContentTypeModal from 'components/content-types/CopyContentTypeModal';
import DeleteContentTypeModal from 'components/content-types/DeleteContentTypeModal';
import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import {
  Box,
  ButtonGroup,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
  Tooltip,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

// Constants
import { DATA_GRID_HEIGHT } from 'lib/constants'

// Contexts
import { ConfigurationContext } from 'src/contexts/ConfigurationContext';
import { ErrorContext } from 'src/contexts/ErrorContext';

// Icons
import AddIcon from '@mui/icons-material/Add';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';

function ContentTypes() {
  // Context
  const { appConfiguration } = useContext(ConfigurationContext)
  const { handleShowSnackbar } = useContext(ErrorContext)

  const {
    environment,
    xAuthToken,
    projectId
  } = appConfiguration.environments?.source

  // State
  const [pageData, setPageData] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [showCopyModal, setShowCopyModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isSourceProjectIncludeContentTypes, setIsSourceProjectIncludeContentTypes] = useState(false)
  const [isTargetProjectIncludeContentTypes, setIsTargetProjectIncludeContentTypes] = useState(false)

  // DataGrid State
  const [pageSize, setPageSize] = useState(10);
  const [selectedRows, setSelectedRows] = useState([])

  useEffect(() => {
    if (environment && xAuthToken) {
      getAllContentTypes(environment, xAuthToken)
        .then((response) => {
          const columns = response.data.map(item => {
            return {
              type: item.type,
              id: item.name,
              displayName: item.presentation.displayName,
              fields: item.fields.length,
              enabled: item.enabled,
            }
          })
          setPageData(columns)
          setIsLoaded(true)
        })
        .catch((error) => {
          setIsLoaded(true)
        })
    } else {
      setIsLoaded(true)
    }

    console.log('appConfiguration?.environments?.target?.environment', appConfiguration?.environments?.target?.environment)
    console.log('appConfiguration?.environments?.target?.xAuthToken', appConfiguration?.environments?.target?.xAuthToken)
    console.log('appConfiguration?.environments?.target?.projectId', appConfiguration?.environments?.target?.projectId)
    if (appConfiguration?.environments?.target?.environment &&
      appConfiguration?.environments?.target?.xAuthToken &&
      appConfiguration?.environments?.target?.projectId) {
        getDeveloperProject(
          appConfiguration?.environments?.target?.environment,
          appConfiguration?.environments?.target?.xAuthToken,
          appConfiguration?.environments?.target?.projectId)
          .then(response => {
            console.log('response.data', response.data)
            setIsTargetProjectIncludeContentTypes(response.data.includeContentTypes)
          })
          .catch(error => console.error(error))
    }
  }, [appConfiguration])

  const columns = [
    {
      field: 'actions',
      headerName: '',
      width: 150,
      renderCell: (params) => {
        const padding = '0.25rem 0.5rem';
        return (
          <ButtonGroup size="small" variant="outlined">
            <Button sx={{ padding: padding}}>
              <NextLink href={`/content-types/${params.row.id}`}>
                <EditIcon fontSize="small" />
              </NextLink>
            </Button>
            <Button
              sx={{ padding: padding}}
              onClick={() => {
                setSelectedRows([params.row.id])
                setShowCopyModal(true)
              }}
            >
              <ContentCopyIcon fontSize="small" />
            </Button>
            {/* <Button
              color="error"
              disabled
              onClick={() => {
                setSelectedRows([params.row.id])
                setShowDeleteModal(true)
              }}
              sx={{ padding: padding}}>
              <DeleteOutlineIcon fontSize="small" />
            </Button> */}
          </ButtonGroup>
        )
      }
    },
    {
      field: 'type',
      headerName: 'Type'
    },
    {
      field: 'id',
      headerName: 'Name',
      width: 360,
      renderCell: (params) => {
        return <NextLink href={`/content-types/${params.row.id}`}>{params.row.id}</NextLink>
      }
    },
    {
      field: 'displayName',
      headerName: 'Display Name',
      width: 360,
    },
    {
      field: 'enabled',
      headerName: 'Enabled',
      type: 'boolean',
    },
    {
      field: 'fields',
      headerName: '# of Fields',
      type: 'number',
    }
  ];

  return (
    <>
      <Head>
        <title>Content Types</title>
      </Head>
      <PageTitleWrapper>
        <Grid
          container
          justifyContent="space-between"
          flexDirection="row"
          flexWrap="nowrap"
        >
          <Grid item xs={12}>
            <PageTitle heading="Content Types" />
          </Grid>
          <Grid item xs={12} display="inline-flex" justifyContent="flex-end">
            <ButtonGroup aria-label="outlined primary button group">
              <Button
                disabled // TODO: Add ability to create new content types
                variant="contained"
                startIcon={<AddIcon />}
              >Content Type</Button>
              {!(selectedRows.length && isTargetProjectIncludeContentTypes)
                ?
                <Tooltip title="Copy">
                  <Button
                    disabled={!(selectedRows.length && isTargetProjectIncludeContentTypes)}
                    onClick={setShowCopyModal}
                    startIcon={<ContentCopyIcon />}
                  >Copy</Button>
                </Tooltip>
                :
                <Button
                  disabled={!(selectedRows.length && isTargetProjectIncludeContentTypes)}
                  onClick={setShowCopyModal}
                  startIcon={<ContentCopyIcon />}
                >Copy</Button>
              }
              {/* <Button
                color="error"
                variant="outlined"
                disabled
                // disabled={!selectedRows.length}
                startIcon={<DeleteOutlineIcon />}
                onClick={setShowDeleteModal}
              >Delete</Button> */}
            </ButtonGroup>
          </Grid>
      </Grid>
      </PageTitleWrapper>

      <Container maxWidth="xl">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          alignContent="stretch"
        >
          <Grid item xs={12}>
            <Card>
              <CardContent>
                <Box sx={{ height: `calc(100vh - ${DATA_GRID_HEIGHT})`, width: '100%' }}>
                  <DataGrid
                    rows={pageData}
                    columns={columns}
                    pageSize={pageSize}
                    onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                    rowsPerPageOptions={[10, 20, 30, pageData?.length]}
                    pagination
                    checkboxSelection
                    disableSelectionOnClick
                    onSelectionModelChange={(ids) => setSelectedRows(ids)}
                    selectionModel={selectedRows}
                    initialState={{
                      sorting: {
                        sortModel: [{
                          field: 'id',
                          sort: 'asc'
                        }]
                      }
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* TODO: Copy content types modal */}
      {/* <CopyContentTypeModal
        showCopyModal={showCopyModal}
        setShowCopyModal={setShowCopyModal}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        // channelId={channel.id}
      /> */}

      {/* TODO: Delete content types modal */}
      {/* <DeleteContentTypeModal
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        // channelId={channel.id}
      /> */}
    </>
  );
}

ContentTypes.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default ContentTypes;
