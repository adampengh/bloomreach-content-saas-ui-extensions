import Head from 'next/head';

// Components
import { Grid } from '@mui/material';
import PageTitle from 'src/components/PageTitle';
import PageTitleWrapper from 'src/components/PageTitleWrapper';

// Styled Components
import { StyledMarkdownContainer } from './styles'

const MarkdownPage = ({
  markdown,
  title,
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <PageTitleWrapper>
        <PageTitle heading={title} />
      </PageTitleWrapper>
      <StyledMarkdownContainer maxWidth="xl">
        <Grid
          container
          alignItems="center"
          sx={{ padding: 1, paddingTop: 0 }}
        >
          <Grid item>
            <div dangerouslySetInnerHTML={{ __html: markdown.contentHtml }} />
          </Grid>
        </Grid>
      </StyledMarkdownContainer>
    </>
  )
}

export default MarkdownPage
