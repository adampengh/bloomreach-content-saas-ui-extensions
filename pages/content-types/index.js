import React, { useContext, useEffect, useMemo, useState } from 'react'
import Head from 'next/head';
import NextLink from 'next/link';

// APIs
import {
  getAllContentTypes,
  getDeveloperProject,
} from 'bloomreach-content-management-apis';

// Layouts
import SidebarLayout from 'src/layouts/SidebarLayout';

// Components
import CopyContentTypeModal from 'components/content-types/CopyContentTypeModal';
import DeleteContentTypeModal from 'components/content-types/DeleteContentTypeModal';
import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import {
  Alert,
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
import { DepGraph } from 'dependency-graph';

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
  const [contentTypes, setContentTypes] = useState([])
  const [pageData, setPageData] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [showCopyModal, setShowCopyModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [isSourceProjectIncludeContentTypes, setIsSourceProjectIncludeContentTypes] = useState(false)
  const [isTargetProjectIncludeContentTypes, setIsTargetProjectIncludeContentTypes] = useState(false)
  const [dependencyGraph, setDependencyGraph] = useState(new DepGraph({ circular: true }));

  // DataGrid State
  const [pageSize, setPageSize] = useState(15);
  const [selectedRows, setSelectedRows] = useState([])

  useEffect(() => {
    if (environment && xAuthToken) {
      getAllContentTypes(environment, xAuthToken, 'development')
        .then(async (response) => {
          const contentTypes = response.data
          await setContentTypes(contentTypes)

          const rows = contentTypes.map(item => {
            return {
              type: item.type,
              id: item.name,
              displayName: item.presentation.displayName,
              fields: item.fields.length
            }
          })
          console.log('rows', rows)
          setPageData(rows)
          setIsLoaded(true)
        })
        .catch((error) => {
          setIsLoaded(true)
        })
    } else {
      setIsLoaded(true)
    }

    if (appConfiguration?.environments?.source?.environment &&
      appConfiguration?.environments?.source?.xAuthToken &&
      appConfiguration?.environments?.source?.projectId) {
        getDeveloperProject(
          appConfiguration?.environments?.source?.environment,
          appConfiguration?.environments?.source?.xAuthToken,
          appConfiguration?.environments?.source?.projectId)
          .then(response => {
            console.log('isSourceProjectIncludeContentTypes', response.data.includeContentTypes)
            setIsSourceProjectIncludeContentTypes(response.data.includeContentTypes)
          })
          .catch(error => console.error(error))
    }

    if (appConfiguration?.environments?.target?.environment &&
      appConfiguration?.environments?.target?.xAuthToken &&
      appConfiguration?.environments?.target?.projectId) {
        getDeveloperProject(
          appConfiguration?.environments?.target?.environment,
          appConfiguration?.environments?.target?.xAuthToken,
          appConfiguration?.environments?.target?.projectId)
          .then(response => {
            console.log('isTargetProjectIncludeContentTypes', response.data.includeContentTypes)
            setIsTargetProjectIncludeContentTypes(response.data.includeContentTypes)
          })
          .catch(error => console.error(error))
    }
  }, [appConfiguration])


  useMemo(async () => {
    // Add all content types to the dependency graph
    const graph = new DepGraph({ circular: true })
    contentTypes.forEach(async (contentType) => {
      await graph.addNode(contentType.name)
    })

    // Loop through content types and add dependencies
    contentTypes.forEach(async (contentType) => {
      await contentType.fields.forEach(field =>
        field.fieldGroupType && graph.addDependency(field.fieldGroupType, contentType.name)
      )
    })

    await setDependencyGraph(graph)
  }, [contentTypes])


  const columns = useMemo(() => (
    [
      {
        field: 'actions',
        headerName: '',
        width: (!isSourceProjectIncludeContentTypes) ? 0 : 150,
        renderCell: (params) => {
          const padding = '0.25rem 0.5rem';
          return (
            <>
              {isSourceProjectIncludeContentTypes &&
                <ButtonGroup size="small" variant="outlined">
                  <Button sx={{ padding: padding}}>
                    <NextLink href={`/content-types/${params.row.id}`} legacyBehavior>
                      <EditIcon fontSize="small" />
                    </NextLink>
                  </Button>
                  <Button
                    sx={{ padding: padding}}
                    onClick={() => {
                      setSelectedRows([params.row.id])
                      setShowCopyModal(true)
                    }}
                    disabled={(!isTargetProjectIncludeContentTypes)}
                  >
                    <ContentCopyIcon fontSize="small" />
                  </Button>
                  <Button
                    color="error"
                    onClick={() => {
                      setSelectedRows([params.row.id])
                      setShowDeleteModal(true)
                    }}
                    sx={{ padding: padding}}>
                    <DeleteOutlineIcon fontSize="small" />
                  </Button>
                </ButtonGroup>
              }
            </>
          );
        }
      },
      {
        field: 'type',
        headerName: 'Type'
      },
      {
        field: 'id',
        headerName: 'Name',
        width: 240,
        renderCell: (params) => {
          return <NextLink href={`/content-types/${params.row.id}`} legacyBehavior>{params.row.id}</NextLink>;
        }
      },
      {
        field: 'displayName',
        headerName: 'Display Name',
        width: 360,
      },
      {
        field: 'fields',
        headerName: 'Fields',
        type: 'number',
      }
    ]
  ))
  // const columns = [
  //   {
  //     field: 'actions',
  //     headerName: '',
  //     width: (!isSourceProjectIncludeContentTypes) ? 0 : 150,
  //     renderCell: (params) => {
  //       const padding = '0.25rem 0.5rem';
  //       return (
  //         <>
  //           {isSourceProjectIncludeContentTypes &&
  //             <ButtonGroup size="small" variant="outlined">
  //               <Button sx={{ padding: padding}}>
  //                 <NextLink href={`/content-types/${params.row.id}`} legacyBehavior>
  //                   <EditIcon fontSize="small" />
  //                 </NextLink>
  //               </Button>
  //               <Button
  //                 sx={{ padding: padding}}
  //                 onClick={() => {
  //                   setSelectedRows([params.row.id])
  //                   setShowCopyModal(true)
  //                 }}
  //                 disabled={(!isTargetProjectIncludeContentTypes)}
  //               >
  //                 <ContentCopyIcon fontSize="small" />
  //               </Button>
  //               <Button
  //                 color="error"
  //                 onClick={() => {
  //                   setSelectedRows([params.row.id])
  //                   setShowDeleteModal(true)
  //                 }}
  //                 sx={{ padding: padding}}>
  //                 <DeleteOutlineIcon fontSize="small" />
  //               </Button>
  //             </ButtonGroup>
  //           }
  //         </>
  //       );
  //     }
  //   },
  //   {
  //     field: 'type',
  //     headerName: 'Type'
  //   },
  //   {
  //     field: 'id',
  //     headerName: 'Name',
  //     width: 240,
  //     renderCell: (params) => {
  //       return <NextLink href={`/content-types/${params.row.id}`} legacyBehavior>{params.row.id}</NextLink>;
  //     }
  //   },
  //   {
  //     field: 'displayName',
  //     headerName: 'Display Name',
  //     width: 360,
  //   },
  //   {
  //     field: 'fields',
  //     headerName: 'Fields',
  //     type: 'number',
  //   },
  //   {
  //     field: 'dependencies',
  //     headerName: 'Dependencies',
  //     width: 400,
  //   }
  // ];

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
            {isSourceProjectIncludeContentTypes &&
              <ButtonGroup aria-label="outlined primary button group">
                <Button
                  disabled // TODO: Add ability to create new content types
                  variant="contained"
                  startIcon={<AddIcon />}
                >Content Type</Button>
                {isTargetProjectIncludeContentTypes &&
                  <Button
                    disabled={!(selectedRows.length && isTargetProjectIncludeContentTypes)}
                    onClick={setShowCopyModal}
                    startIcon={<ContentCopyIcon />}
                  >Copy</Button>
                }
                <Button
                  color="error"
                  variant="outlined"
                  disabled={!selectedRows.length}
                  startIcon={<DeleteOutlineIcon />}
                  onClick={setShowDeleteModal}
                >Delete</Button>
              </ButtonGroup>
            }
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
          spacing={2}
        >
          {!isSourceProjectIncludeContentTypes &&
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ paddingBottom: '16px !important' }}>
                  <Alert severity="warning">The currently selected Source Environment Develop Project ({appConfiguration?.environments?.source?.projectId}) does not include Content Type changes</Alert>
                </CardContent>
              </Card>
            </Grid>
          }
          {!isTargetProjectIncludeContentTypes &&
            <Grid item xs={12}>
              <Card>
                <CardContent sx={{ paddingBottom: '16px !important' }}>
                  <Alert severity="warning">The currently selected Target Environment Develop Project ({appConfiguration?.environments?.target?.projectId}) does not include Content Type changes</Alert>
                </CardContent>
              </Card>
            </Grid>
          }
          <Grid item xs={12} sx={{ paddingBottom: '16px !important' }}>
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
                      sx={{
                        '.MuiDataGrid-cellContent, .MuiDataGrid-cell': {
                          fontSize: '13px'
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
      <CopyContentTypeModal
        showModal={showCopyModal}
        setShowModal={setShowCopyModal}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        contentTypes={contentTypes}
        dependencyGraph={dependencyGraph}
      />

      <DeleteContentTypeModal
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        pageData={pageData}
        setPageData={setPageData}
      />
    </>
  );
}

ContentTypes.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default ContentTypes;
