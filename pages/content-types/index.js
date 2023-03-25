import React, { useContext, useEffect, useState } from 'react'
import NextLink from 'next/link';

// APIs
import { getAllContentTypes } from 'api/content-types';

// Layouts
import SidebarLayout from 'src/layouts/SidebarLayout';

// Components
import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import {
  Alert,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Container,
  Grid,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';

// Contexts
import { ConfigurationContext } from 'src/contexts/ConfigurationContext';

function ContentTypes() {
  const [error, setError] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [contentTypes, setContentTypes] = useState([])
  const [pageSize, setPageSize] = React.useState(10);

  const {
    appConfiguration
  } = useContext(ConfigurationContext)

  const {
    environment,
    xAuthToken,
  } = appConfiguration.environments?.source

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
          setContentTypes(columns)
          setIsLoaded(true)
          setError(null)
        })
        .catch((error) => {
          setError(error.message)
          setIsLoaded(true)
        })
    } else {
      setIsLoaded(true)
    }
  }, [appConfiguration])

  const columns = [
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
      <PageTitleWrapper>
        <PageTitle
          heading="Content Types"
        />
      </PageTitleWrapper>
      <Container maxWidth="xl">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          alignContent="stretch"
          sx={{
            '& .MuiGrid-item': {
              textAlign: 'center'
            },
            '& .MuiCircularProgress-root': {
              margin: '24px'
            }
          }}
        >
        { !isLoaded
          ?
            <Grid
              item
              xs={12}
              justifyContent="center"
              alignItems="stretch"
              alignContent="stretch"
            >
              <Card>
                <CircularProgress />
              </Card>
            </Grid>
          :
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Box sx={{ height: 'calc(100vh - 220px)', width: '100%' }}>
                    <DataGrid
                      rows={contentTypes}
                      columns={columns}
                      pageSize={pageSize}
                      onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
                      rowsPerPageOptions={[10, 20, 30, contentTypes?.length]}
                      pagination
                      checkboxSelection
                      disableSelectionOnClick
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
          }
        </Grid>
      </Container>
    </>
  );
}

ContentTypes.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default ContentTypes;
