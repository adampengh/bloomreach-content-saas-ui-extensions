import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import NextLink from 'next/link';

import { validateToken } from 'bloomreach-content-management-apis'

// Components
import {
  ListSubheader,
  alpha,
  Box,
  List,
  styled,
  Button,
  ListItem
} from '@mui/material';

// Contexts
import { ConfigurationContext } from 'src/contexts/ConfigurationContext';
import { SidebarContext } from 'src/contexts/SidebarContext';

// Icons
import AssignmentIcon from '@mui/icons-material/Assignment';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import InfoIcon from '@mui/icons-material/Info';
import PlagiarismIcon from '@mui/icons-material/Plagiarism';
import SettingsIcon from '@mui/icons-material/Settings';
import ImportExportIcon from '@mui/icons-material/ImportExport';


const MenuWrapper = styled(Box)(
  ({ theme }) => `
  .MuiList-root {
    padding: ${theme.spacing(1)};

    & > .MuiList-root {
      padding: 0 ${theme.spacing(0)} ${theme.spacing(1)};
    }
  }

    .MuiListSubheader-root {
      text-transform: uppercase;
      font-weight: bold;
      font-size: ${theme.typography.pxToRem(12)};
      color: ${theme.colors.alpha.trueWhite[50]};
      padding: ${theme.spacing(0, 2.5)};
      line-height: 1.4;
    }
`
);

const SubMenuWrapper = styled(Box)(
  ({ theme }) => `
    .MuiList-root {

      .MuiListItem-root {
        padding: 1px 0;

        .MuiBadge-root {
          position: absolute;
          right: ${theme.spacing(3.2)};

          .MuiBadge-standard {
            background: ${theme.colors.primary.main};
            font-size: ${theme.typography.pxToRem(10)};
            font-weight: bold;
            text-transform: uppercase;
            color: ${theme.palette.primary.contrastText};
          }
        }

        .MuiButton-root {
          display: flex;
          color: ${theme.colors.alpha.trueWhite[70]};
          background-color: transparent;
          width: 100%;
          justify-content: flex-start;
          padding: ${theme.spacing(1.2, 3)};

          .MuiButton-startIcon,
          .MuiButton-endIcon {
            transition: ${theme.transitions.create(['color'])};

            .MuiSvgIcon-root {
              font-size: inherit;
              transition: none;
            }
          }

          .MuiButton-startIcon {
            color: ${theme.colors.alpha.trueWhite[30]};
            font-size: ${theme.typography.pxToRem(20)};
            margin-right: ${theme.spacing(1)};
          }

          .MuiButton-endIcon {
            color: ${theme.colors.alpha.trueWhite[50]};
            margin-left: auto;
            opacity: .8;
            font-size: ${theme.typography.pxToRem(20)};
          }

          &.active,
          &:hover {
            background-color: ${alpha(theme.colors.alpha.trueWhite[100], 0.06)};
            color: ${theme.colors.alpha.trueWhite[100]};

            .MuiButton-startIcon,
            .MuiButton-endIcon {
              color: ${theme.colors.alpha.trueWhite[100]};
            }
          }
        }

        &.Mui-children {
          flex-direction: column;

          .MuiBadge-root {
            position: absolute;
            right: ${theme.spacing(7)};
          }
        }

        .MuiCollapse-root {
          width: 100%;

          .MuiList-root {
            padding: ${theme.spacing(1, 0)};
          }

          .MuiListItem-root {
            padding: 1px 0;

            .MuiButton-root {
              padding: ${theme.spacing(0.8, 3)};

              .MuiBadge-root {
                right: ${theme.spacing(3.2)};
              }

              &:before {
                content: ' ';
                background: ${theme.colors.alpha.trueWhite[100]};
                opacity: 0;
                transition: ${theme.transitions.create([
                  'transform',
                  'opacity'
                ])};
                width: 6px;
                height: 6px;
                transform: scale(0);
                transform-origin: center;
                border-radius: 20px;
                margin-right: ${theme.spacing(1.8)};
              }

              &.active,
              &:hover {

                &:before {
                  transform: scale(1);
                  opacity: 1;
                }
              }
            }
          }
        }
      }
    }
`
);

function SidebarMenu() {
  const [menuItemsEnabled, setMenuItemsEnabled] = useState(false)
  const { closeSidebar } = useContext(SidebarContext);
  const router = useRouter();
  const currentRoute = router.pathname;

  const {
    appConfiguration
  } = useContext(ConfigurationContext)

  useEffect(() => {
    const sourceConfig = appConfiguration?.environments?.source
    const hasMissingRequiredConfigProperties = !!Object.entries(sourceConfig).filter(([,value]) => value === '').length
    setMenuItemsEnabled(!hasMissingRequiredConfigProperties)
  }, [appConfiguration])

  return <>
    <MenuWrapper>

        <List component="div">
          <SubMenuWrapper>
            <List component="div">
              {process.env.NODE_ENV === 'development' &&
                <ListItem component="div">
                  <NextLink href="/TEMPLATES" passHref legacyBehavior>
                    <Button
                      className={currentRoute.startsWith('/TEMPLATES') ? 'active' : ''}
                      disableRipple
                      component="a"
                      onClick={closeSidebar}
                      startIcon={<SettingsIcon />}
                    >
                      TEMPLATES
                    </Button>
                  </NextLink>
                </ListItem>
              }
              <ListItem component="div">
                <NextLink href="/getting-started" passHref legacyBehavior>
                  <Button
                    className={currentRoute.startsWith('/getting-started') ? 'active' : ''}
                    disableRipple
                    component="a"
                    onClick={closeSidebar}
                    startIcon={<InfoIcon />}
                  >
                    Getting Started
                  </Button>
                </NextLink>
              </ListItem>
            </List>
          </SubMenuWrapper>
        </List>


      <List component="div">
        <SubMenuWrapper>
          <List component="div">
            <ListItem component="div">
              <NextLink href="/configuration" passHref legacyBehavior>
                <Button
                  className={currentRoute.startsWith('/configuration') ? 'active' : ''}
                  disableRipple
                  component="a"
                  onClick={closeSidebar}
                  startIcon={<SettingsIcon />}
                >
                  Configuration
                </Button>
              </NextLink>
            </ListItem>
          </List>
        </SubMenuWrapper>
      </List>

      { menuItemsEnabled &&
        <>
          <List
            component="div"
            subheader={
              <ListSubheader component="div" disableSticky>
                Project Management
              </ListSubheader>
            }
          >
            <SubMenuWrapper>
              <List component="div">
                <ListItem component="div">
                  <NextLink href="/projects" passHref legacyBehavior>
                    <Button
                      className={
                        currentRoute.startsWith('/projects') ? 'active' : ''
                      }
                      disableRipple
                      component="a"
                      onClick={closeSidebar}
                      startIcon={<AssignmentIcon />}
                    >
                      Projects
                    </Button>
                  </NextLink>
                </ListItem>
              </List>
            </SubMenuWrapper>
          </List>

          <List
            component="div"
            subheader={
              <ListSubheader component="div" disableSticky>
                Site Management
              </ListSubheader>
            }
          >
            <SubMenuWrapper>
              <List component="div">
                <ListItem component="div">
                  <NextLink href="/channels" passHref legacyBehavior>
                    <Button
                      className={
                        currentRoute.startsWith('/channels') ? 'active' : ''
                      }
                      disableRipple
                      component="a"
                      onClick={closeSidebar}
                      startIcon={<FormatListBulletedIcon />}
                    >
                      Channels
                    </Button>
                  </NextLink>
                </ListItem>
              </List>
            </SubMenuWrapper>
          </List>

          <List
            component="div"
            subheader={
              <ListSubheader component="div" disableSticky>
                Content Management
              </ListSubheader>
            }
          >
            <SubMenuWrapper>
              <List component="div">
                <ListItem component="div">
                  <NextLink href="/pages" passHref legacyBehavior>
                    <Button
                      className={
                        currentRoute.startsWith('/pages') ? 'active' : ''
                      }
                      disableRipple
                      component="a"
                      onClick={closeSidebar}
                      startIcon={<PlagiarismIcon />}
                    >
                      Pages
                    </Button>
                  </NextLink>
                </ListItem>
                <ListItem component="div">
                  <NextLink href="/export-import" passHref legacyBehavior>
                    <Button
                        className={
                          currentRoute.startsWith('/export-import') ? 'active' : ''
                        }
                        disableRipple
                        component="a"
                        onClick={closeSidebar}
                        startIcon={<ImportExportIcon />}
                    >
                      Export & Import
                    </Button>
                  </NextLink>
                </ListItem>
              </List>
            </SubMenuWrapper>
          </List>

          <List
            component="div"
            subheader={
              <ListSubheader component="div" disableSticky>
                Content Type Management
              </ListSubheader>
            }
          >
            <SubMenuWrapper>
              <List component="div">
                <ListItem component="div">
                  <NextLink href="/content-types" passHref legacyBehavior>
                    <Button
                      className={
                        currentRoute.startsWith('/content-types') ? 'active' : ''
                      }
                      disableRipple
                      component="a"
                      onClick={closeSidebar}
                      startIcon={<AssignmentIcon />}
                    >
                      Content Types
                    </Button>
                  </NextLink>
                </ListItem>
              </List>
            </SubMenuWrapper>
          </List>
        </>
      }
    </MenuWrapper>
  </>;
}

export default SidebarMenu;
