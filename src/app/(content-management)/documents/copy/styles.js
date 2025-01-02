import styled from '@emotion/styled'
import {
  Box,
  CardContent,
  TableCell,
  TableRow,
  tableCellClasses,
} from '@mui/material';

export const StyledPageWrapper = styled(Box)(`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: minmax(auto, 3fr) minmax(260px, 1fr);
  grid-template-areas:
    'topLeft topRight'
    'bottom bottom';
  height: 100%;
`)

export const StyledCardContent = styled(CardContent)(`
  height: 100%;
  overflow-y: auto;
`)

export const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(even)': {
    backgroundColor: theme.colors.primary.lighter,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));
