'use client'

// Components
import { Grid } from '@mui/material';

// Styled Components
import { StyledMarkdownContainer } from './styles'

const MarkdownContent = ({ markdown }) => {
  return (
    <StyledMarkdownContainer maxWidth='xl'>
      <Grid
        container
        alignItems='center'
        sx={{ padding: 1, paddingTop: 0 }}
      >
        <Grid item>
          <div dangerouslySetInnerHTML={{ __html: markdown.contentHtml }} />
        </Grid>
      </Grid>
    </StyledMarkdownContainer>
  )
}

export default MarkdownContent;
