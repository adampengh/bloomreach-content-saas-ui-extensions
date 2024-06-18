'use client'

import { useContext, useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import NextLink from 'next/link';

// Components
import { SidebarMenuLink } from './SidebarMenuLink';
import {
  Button,
  List,
  ListSubheader,
  ListItem
} from '@mui/material';

// Contexts
import { ConfigurationContext, SidebarContext } from 'src/contexts'

// Icons
import {
  AssignmentIcon,
  ApiIcon,
  FormatListBulletedIcon,
  ImportExportIcon,
  InfoIcon,
  PlagiarismIcon,
  SettingsIcon,
  TranslateIcon,
  WebIcon,
} from 'src/icons';

import { MenuWrapper, SubMenuWrapper } from './styles';


export const SidebarMenu = () => {
  const currentRoute = usePathname()

  // State
  const [menuItemsEnabled, setMenuItemsEnabled] = useState(false)

  // Context
  const { closeSidebar } = useContext(SidebarContext);
  const { appConfiguration } = useContext(ConfigurationContext)

  useEffect(() => {
    const sourceConfig = appConfiguration?.environments?.source
    const hasMissingRequiredConfigProperties = sourceConfig && !!Object.entries(sourceConfig).filter(([,value]) => value === '').length
    setMenuItemsEnabled(!hasMissingRequiredConfigProperties)
  }, [appConfiguration])

  return (
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
            subheader={<ListSubheader component='div' disableSticky>Project Management</ListSubheader>}
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
            subheader={<ListSubheader component='div' disableSticky>Site Management</ListSubheader>}
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
            subheader={<ListSubheader component='div' disableSticky>Content Management</ListSubheader>}
          >
            <SubMenuWrapper>
              <List component='div'>
                <SidebarMenuLink
                  closeSidebar={closeSidebar}
                  currentRoute={currentRoute}
                  href='/pages/copy'
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
            subheader={<ListSubheader component='div' disableSticky>Content Types Management</ListSubheader>}
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

          {/* Delivery API Settings */}
          {/* <List
            component='div'
            subheader={<ListSubheader component='div' disableSticky>Delivery API Settings</ListSubheader>}
          >
            <SubMenuWrapper>
              <List component='div'>
                <SidebarMenuLink
                  closeSidebar={closeSidebar}
                  currentRoute={currentRoute}
                  href='/delivery-api-settings'
                  icon={<ApiIcon />}
                  text='Delivery API Settings'
                />
              </List>
            </SubMenuWrapper>
          </List> */}
        </>
      }
    </MenuWrapper>
  )
}
