import {
  Checkbox,
  FormControlLabel,
} from '@mui/material'
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const HierarchicalList = () => {
  return (
    <TreeView
      aria-label="file system navigator"
      defaultCollapseIcon={<ExpandMoreIcon />}
      defaultExpandIcon={<ChevronRightIcon />}
      sx={{ flexGrow: 1, maxWidth: 400, overflowY: 'auto' }}
    >
      <TreeItem nodeId="1" label="Applications">
        <TreeItem nodeId="1.1" label="Calendar" />
      </TreeItem>
      <TreeItem nodeId="2" label="Documents">
        <TreeItem nodeId="2.1" label="OSS" />
        <TreeItem nodeId="2.2" label="MUI">
          <TreeItem nodeId="2.2.1" label="index.js" />
        </TreeItem>
      </TreeItem>
      <TreeItem nodeId="3" label={
          <FormControlLabel
            control={
              <Checkbox sx={{ padding: 0.5}} />
            }
            label='Folder 1' />
          }>
        <TreeItem nodeId="3.1" label={
          <FormControlLabel
            control={
              <Checkbox sx={{ padding: 0.5}} />
            }
            label='Page 1' />
          } />
        <TreeItem nodeId="3.2" label={
          <FormControlLabel
            control={
              <Checkbox sx={{ padding: 0.5}} />
            }
            label='Page 2' />
          } />
        <TreeItem nodeId="3.3" label={
          <FormControlLabel
            control={
              <Checkbox sx={{ padding: 0.5}} />
            }
            label='Folder 1' />
          }>
          <TreeItem nodeId="3.3.1" label={
            <FormControlLabel
              control={
                <Checkbox sx={{ padding: 0.5}} />
              }
              label='Page 1.1' />
            } />
        </TreeItem>
        <TreeItem nodeId="3.4" label={
          <FormControlLabel
            control={
              <Checkbox sx={{ padding: 0.5}} />
            }
            label='Folder 2' />
          }>
          <TreeItem nodeId="3.3.1" label={
            <FormControlLabel
              control={
                <Checkbox sx={{ padding: 0.5}} />
              }
              label='Page 2.1' />
            } />
        </TreeItem>
      </TreeItem>
    </TreeView>
  )
}

export default HierarchicalList;
