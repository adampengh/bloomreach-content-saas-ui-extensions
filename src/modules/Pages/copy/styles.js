import styled from '@emotion/styled'
import { Box, CardContent } from '@mui/material';

const StyledPageWrapper = styled(Box)(`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: minmax(auto, 3fr) minmax(260px, 1fr);
  grid-template-areas:
    'topLeft topRight'
    'bottom bottom';
  height: 100%;
`)

const StyledCardContent = styled(CardContent)(`
  border: 1px solid green;
  height: 100%;
  overflow-y: auto;
`)

export {
  StyledPageWrapper,
  StyledCardContent,
}
