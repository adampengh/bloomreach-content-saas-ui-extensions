'use client'

import { useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import NextLink from 'next/link';

// Components
import { SidebarMenuLink } from './SidebarMenuLink';
import {
  ListSubheader,
  List,
  Button,
  ListItem
} from '@mui/material';

// Contexts
import { ConfigurationContext, SidebarContext } from 'src/contexts'

// Icons
import AssignmentIcon from '@mui/icons-material/Assignment';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import ImportExportIcon from '@mui/icons-material/ImportExport';
import InfoIcon from '@mui/icons-material/Info';
import PlagiarismIcon from '@mui/icons-material/Plagiarism';
import SettingsIcon from '@mui/icons-material/Settings';
import TranslateIcon from '@mui/icons-material/Translate';
import WebIcon from '@mui/icons-material/Web';

import { MenuWrapper, SubMenuWrapper } from './styles';


function SidebarMenu() {
  const [menuItemsEnabled, setMenuItemsEnabled] = useState(false)
  const { closeSidebar } = useContext(SidebarContext);
  const currentRoute = usePathname()

  const { appConfiguration } = useContext(ConfigurationContext)

  useEffect(() => {
    const sourceConfig = appConfiguration?.environments?.source
    const hasMissingRequiredConfigProperties = sourceConfig && !!Object.entries(sourceConfig).filter(([,value]) => value === '').length
    setMenuItemsEnabled(!hasMissingRequiredConfigProperties)
  }, [appConfiguration])

  return <>
    <MenuWrapper>
      <List component='div'>
        <SubMenuWrapper>
          <List component='div'>
            {process.env.NODE_ENV === 'development' &&
              <ListItem component='div'>
                <NextLink href='/TEMPLATES' passHref legacyBehavior>
                  <Button
                    className={currentRoute.startsWith('/TEMPLATES') ? 'active' : ''}
                    disableRipple
                    component='a'
                    onClick={closeSidebar}
                    startIcon={<SettingsIcon />}
                  >
                    TEMPLATES
                  </Button>
                </NextLink>
              </ListItem>
            }
            <SidebarMenuLink
              closeSidebar={closeSidebar}
              currentRoute={currentRoute}
              href='/getting-started'
              icon={<InfoIcon />}
              text='Getting Started'
            />
            <SidebarMenuLink
              closeSidebar={closeSidebar}
              currentRoute={currentRoute}
              href='/configuration'
              icon={<SettingsIcon />}
              text='Configuration'
            />
          </List>
        </SubMenuWrapper>
      </List>

      { menuItemsEnabled &&
        <>
          {/* Site Management */}
          <List
            component='div'
            subheader={
              <ListSubheader component='div' disableSticky>Project Management</ListSubheader>
            }
          >
            <SubMenuWrapper>
              <List component='div'>
                <SidebarMenuLink
                  closeSidebar={closeSidebar}
                  currentRoute={currentRoute}
                  href='/projects'
                  icon={<AssignmentIcon />}
                  text='Projects'
                />
              </List>
            </SubMenuWrapper>
          </List>

          {/* Site Management */}
          <List
            component='div'
            subheader={
              <ListSubheader component='div' disableSticky>Site Management</ListSubheader>
            }
          >
            <SubMenuWrapper>
              <List component='div'>
                <SidebarMenuLink
                  closeSidebar={closeSidebar}
                  currentRoute={currentRoute}
                  href='/channels'
                  icon={<FormatListBulletedIcon />}
                  text='Channels'
                />
              </List>
            </SubMenuWrapper>
          </List>

          {/* Content Management */}
          <List
            component='div'
            subheader={
              <ListSubheader component='div' disableSticky>Content Management</ListSubheader>
            }
          >
            <SubMenuWrapper>
              <List component='div'>
                <SidebarMenuLink
                  closeSidebar={closeSidebar}
                  currentRoute={currentRoute}
                  href='/pages'
                  icon={<WebIcon />}
                  text='Pages'
                />
                <SidebarMenuLink
                  closeSidebar={closeSidebar}
                  currentRoute={currentRoute}
                  href='/translations'
                  icon={<TranslateIcon />}
                  text='Translations'
                />
                <SidebarMenuLink
                  closeSidebar={closeSidebar}
                  currentRoute={currentRoute}
                  href='/export-import'
                  icon={<ImportExportIcon />}
                  text='Export & Import'
                />
              </List>
            </SubMenuWrapper>
          </List>

          {/* Content Type Management */}
          <List
            component='div'
            subheader={
              <ListSubheader component='div' disableSticky>Content Types Management</ListSubheader>
            }
          >
            <SubMenuWrapper>
              <List component='div'>
                <SidebarMenuLink
                  closeSidebar={closeSidebar}
                  currentRoute={currentRoute}
                  href='/content-types'
                  icon={<PlagiarismIcon />}
                  text='Content Types'
                />
              </List>
            </SubMenuWrapper>
          </List>
        </>
      }
    </MenuWrapper>
  </>;
}



export default SidebarMenu;
