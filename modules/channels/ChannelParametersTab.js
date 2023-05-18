import { useEffect, useState } from 'react'

// API
import { getChannelParameters } from 'api'

// Components
import CreateChannelParameterModal from 'components/channels/CreateChannelParameterModal'
import DeleteChannelParameterModal from 'components/channels/DeleteChannelParameterModal'
import EditChannelParameterModal from 'components/channels/EditChannelParameterModal'
import {
  Avatar,
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Stack,
  Tabs,
  Tab,
  TextField,
  Typography,
} from '@mui/material'

// Icons
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FolderIcon from '@mui/icons-material/Folder';
import TextFieldsIcon from '@mui/icons-material/TextFields';

const ChannelParametersTab = ({ channel, environment, xAuthToken }) => {
  const [parameters, setParameters] = useState(null)
  const [showCreateModal, setShowCreateModal] = useState(false)

  const [selectedParameter, setSelectedParameter] = useState(null)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)

  useEffect(() => {
    getChannelParameters(environment, xAuthToken, channel.id)
      .then(response => setParameters(response.data))
      .catch(error => console.error(error))
  }, [channel])

  return (
    <>
      <Box
        component="div"
        display="flex"
        sx={{ margin: 0 }}
      >
        <Grid
          container
          direction="row"
          justifyContent="flex-start"
          alignItems="stretch"
          rowSpacing={3}
          columnSpacing={0}
          sx={{ width: '100%', marginTop: -4.5 }}
        >
          <Grid
            container
            display="flex"
            justifyContent="space-between"
            alignContent="center"
            alignItems="flex-end"
            spacing={0}
            sx={{ width: '100%', paddingBottom: 3, margin: 0 }}
          >
            <Grid item>
              <Typography variant="h4">Properties</Typography>
            </Grid>
            <Grid item>
              <Button
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => setShowCreateModal(true)}
              >Property</Button>
            </Grid>
          </Grid>
          <List sx={{ width: '100%', padding: 0 }}>
            {parameters?.map((parameter, index) => (
              <ListItem key={index} sx={{ paddingTop: 1, paddingBottom: 1 }}>
                <ListItemAvatar>
                  <Avatar>
                    <TextFieldsIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={parameter.displayName}
                  secondary={parameter.name}
                />
                <ListItemSecondaryAction>
                  <IconButton
                    edge="start"
                    aria-label="delete"
                    onClick={() => {
                      setSelectedParameter(parameter)
                      setShowDeleteModal(true)
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    edge="end"
                    aria-label="edit"
                    onClick={() => {
                      setSelectedParameter(parameter)
                      setShowEditModal(true)
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Grid>
      </Box>

      <CreateChannelParameterModal
        showModal={showCreateModal}
        setShowModal={setShowCreateModal}
        parameters={parameters}
        setParameters={setParameters}
        environment={environment}
        xAuthToken={xAuthToken}
        channelId={channel.id}
      />
      <DeleteChannelParameterModal
        showModal={showDeleteModal}
        setShowModal={setShowDeleteModal}
        selectedParameter={selectedParameter}
        setSelectedParameter={setSelectedParameter}
        parameters={parameters}
        setParameters={setParameters}
        environment={environment}
        xAuthToken={xAuthToken}
        channelId={channel.id}
      />
      <EditChannelParameterModal
        showModal={showEditModal}
        setShowModal={setShowEditModal}
        selectedParameter={selectedParameter}
        setSelectedParameter={setSelectedParameter}
        parameters={parameters}
        setParameters={setParameters}
        environment={environment}
        xAuthToken={xAuthToken}
        channelId={channel.id}
      />
    </>
  )
}

export default ChannelParametersTab
