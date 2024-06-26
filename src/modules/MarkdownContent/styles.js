import { Container } from '@mui/material';
import styled from '@emotion/styled'

export const StyledMarkdownContainer = styled(Container)(
  ({ theme }) => `
  h4 {
    margin-bottom: 0;
    margin-top: .5rem;
  }
  a {
    color: ${theme.colors.primary.main};
  }
  code {
    background-color: ${theme.colors.primary.light};
    color: ${theme.colors.alpha.trueWhite[100]};
  }
  ul {
    margin-top: 0;
    margin-bottom: 0;
  }
  p,
  ul,
  ol {
    code {
      background-color: ${theme.colors.primary.lighter};
      color: ${theme.colors.primary.main};
    }
  }
  hr {
    border-color: ${theme.colors.primary.lighter};
  }
  table {
    border: 1px solid ${theme.colors.alpha.black[30]};
    border-collapse: collapse;
    tr:nth-of-type(even) {
      background-color: ${theme.colors.primary.lighter};
    }
    thead {
      text-align: left;
      border-bottom: 1px solid ${theme.colors.alpha.black[30]};
    }
    th,
    td {
      border-right: 1px solid ${theme.colors.alpha.black[30]};
      padding: 0.25rem 0.5rem;
    }
    code {
      background-color: transparent;
      color: ${theme.colors.primary.main};
      padding: 0;
    }
  }
`
);
