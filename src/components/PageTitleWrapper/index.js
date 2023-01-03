import PropTypes from 'prop-types';
import { Box, styled } from '@mui/material';

const PageTitle = styled(Box)(
  ({ theme }) => `
        padding: ${theme.spacing(4)};
`
);

const PageTitleWrapper = ({ children }) => {
  return (
    <PageTitle className="MuiPageTitle-wrapper">
      {children}
    </PageTitle>
  );
};

PageTitleWrapper.propTypes = {
  children: PropTypes.node.isRequired
};

export default PageTitleWrapper;
