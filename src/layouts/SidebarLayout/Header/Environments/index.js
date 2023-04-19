// Components
import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material'

const Environments = () => {
  return (
    <>
      <Box
        component="form"
        sx={{
          '& .MuiTextField-root': { m: 1, width: '100%' }
        }}
        autoComplete="off"
        // onSubmit={handleCopyComponents}
      >
        <FormControl
          variant="outlined"
          sx={{ ml: 1, minWidth: 180 }}
        >
          <InputLabel id="activeEnvironmentDropdown">Active Environment</InputLabel>
          <Select
            id="activeEnvironmentDropdown"
            labelId="activeEnvironmentDropdown"
            label="Active Environment"
            // value={targetConfig?.projectId || ''}
            // onChange={(e) => setTargetConfig({...targetConfig, projectId: e.target.value})}
          >
            <MenuItem value='source'>Source</MenuItem>
            <MenuItem value='target'>Target</MenuItem>
            {/* {targetDeveloperProjects.map(project => (
              <MenuItem key={project.id} value={project.id}>
                {project.name} ({project.id})
              </MenuItem>
            ))} */}
          </Select>
        </FormControl>
      </Box>
    </>
  )
}

export default Environments
