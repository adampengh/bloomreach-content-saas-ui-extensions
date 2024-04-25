import { useContext, useEffect, useState } from 'react'
import NextLink from 'next/link'

// API
import {
  getAllRoutes,
  getRoute,
} from 'bloomreach-content-management-apis'

// Components
import {
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
} from '@mui/material'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeViewBaseItem } from '@mui/x-tree-view/models';

import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';

// Contexts
import { ConfigurationContext, ErrorContext, LoadingContext } from 'src/contexts'

// Constants

// Icons
import AltRouteIcon from '@mui/icons-material/AltRoute';
import CommentIcon from '@mui/icons-material/Comment';
import DragHandleIcon from '@mui/icons-material/DragHandle';
import MoreVertIcon from '@mui/icons-material/MoreVert';


export const NewTab = ({ channel }) => {
  console.log('NewTab channel', channel)
  // Context
  const { appConfiguration } = useContext(ConfigurationContext)
  const { environment, xAuthToken } = appConfiguration.environments?.source
  const { handleShowSnackbar } = useContext(ErrorContext)
  const { setLoading } = useContext(LoadingContext)

  // State
  const [routes, setRoutes] = useState([])
  const [selectedRoute, setSelectedRoute] = useState(null)
  const [routeDetails, setRouteDetails] = useState(null)
  const [checked, setChecked] = useState([0]);

  const [selectedPath, setSelectedPath] = useState(null)

  useEffect(() => {
    console.log('useEffect getAllRoutes()')
    setLoading({ loading: true, message: 'Loading Routes' })
    getAllRoutes(environment, xAuthToken, channel.id)
      .then(response => {
        console.log('routes', response.data)
        setRoutes(response.data)
        setLoading({ loading: false, message: '' })
      })
      .catch(error => {
        setLoading({ loading: false, message: '' })
        handleShowSnackbar('error', error.message)
      })
  }, [channel])


  const handleRouteClick = async (route) => {
    // console.log('handleRouteClick', route)
    // await setSelectedRoute(route)
    // await setLoading({ loading: true, message: 'Loading Route' })
    // await getRoute(environment, xAuthToken, channel.id, route)
    //   .then(response => {
    //     console.log('route', response.data)
    //     setRouteDetails(response.data)
    //     setLoading({ loading: false, message: '' })
    //   })
    //   .catch(error => {
    //     setLoading({ loading: false, message: '' })
    //     handleShowSnackbar('error', error.message)
    //   })
  }


  const handleToggle = (value) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const MUI_X_PRODUCTS = [
    {
      internalId: 'grid',
      label: 'Data Grid',
      children: [
        { internalId: 'grid-community', label: '@mui/x-data-grid' },
        { internalId: 'grid-pro', label: '@mui/x-data-grid-pro' },
        { internalId: 'grid-premium', label: '@mui/x-data-grid-premium' },
      ],
    },
    {
      internalId: 'pickers',
      label: 'Date and Time Pickers',
      children: [
        { internalId: 'pickers-community', label: '@mui/x-date-pickers' },
        { internalId: 'pickers-pro', label: '@mui/x-date-pickers-pro' },
      ],
    },
  ];

  const getItemId = (item) => {
    // console.log('getItemId', item)
    return item.internalId;
  }

  return (
    <>
      <Grid
        container
        direction='row'
        justifyContent='space-between'
        alignItems='flex-start'
        spacing={0}
        sx={{ width: '100%' }}
      >
        <Grid
          item
          xs={12}
          lg={2}
          sx={{ border: '1px solid red' }}
        >
          <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {routes.map((route, index) => {
              console.log('route', route)
              const labelId = `checkbox-list-label-${index}`;

              return (
                <ListItem
                  key={index}
                  disablePadding
                  secondaryAction={
                    <IconButton edge='end' aria-label='comments'>
                      <MoreVertIcon />
                    </IconButton>
                  }
                >
                  <ListItemButton
                    selected={selectedRoute === route.name}
                    onClick={() => handleRouteClick(route.name)}
                  >
                    <ListItemText id={labelId} primary={route.name} />
                  </ListItemButton>
                </ListItem>
              );
            })}
          </List>
        </Grid>

        <Grid
          item
          xs={12}
          lg={5}
          sx={{ border: '1px solid red' }}
        >
          <RichTreeView
            items={MUI_X_PRODUCTS}
            getItemId={getItemId}
            // onItemFocus={
            //   (event, value) => {
            //     console.log('item', value)
            //   }
            // }
          />
          {/* {routeDetails &&
            <SimpleTreeView
              onItemFocus={(event, value) => {
                console.log('item', value)
                setSelectedPath(value)
              }}>
              <RouteDetails routeDetails={routeDetails} />
            </SimpleTreeView>
          } */}
        </Grid>

        <Grid
          item
          xs={12}
          lg={5}
          sx={{ border: '1px solid red' }}
        >
          {selectedPath &&
            <Typography>
              {selectedPath}
            </Typography>
          }
        </Grid>
      </Grid>
    </>
  )
}

const RouteDetails = ({ routeDetails }) => {
  console.log('RouteDetails', routeDetails)

  const routes = routeDetails.items

  return (
    <TreeItem
      itemId={routeDetails}
      label={
        <Typography sx={{ display: 'flex', alignContent: 'center'}}>
          <AltRouteIcon fontSize='small' sx={{ mr: 1 }} />
          {routeDetails.name}
        </Typography>
      }
    >
      {routes && routes.map((route) =>
        <Routes
          key={route.name}
          route={route}
          path={`${routeDetails.name}/${route.name}`}
        />
      )}
    </TreeItem>
  )
}

const Routes = ({ route, path }) => {
  console.log('Routes', route, path)
  const routes = route.items

  return (
    <>
      <TreeItem itemId={route}
        label={
          <Typography sx={{ display: 'flex', alignContent: 'center'}}>
            <AltRouteIcon fontSize='small' sx={{ mr: 1 }} />
            {route.name}
          </Typography>
        }
      >
        {routes && routes.map((route) =>
          <Routes
            key={route.name}
            route={route}
            path={`${path}/${route.name}`}
          />
        )}
      </TreeItem>
    </>
  )
}
