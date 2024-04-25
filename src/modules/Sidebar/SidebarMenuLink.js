import NextLink from 'next/link';

// Components
import {
  Button,
  ListItem
} from '@mui/material';

export const SidebarMenuLink = ({
  closeSidebar,
  currentRoute,
  href,
  icon,
  text,
}) => {
  return (
    <ListItem component='div'>
      <NextLink href={href} passHref legacyBehavior>
        <Button
            className={
              currentRoute.startsWith(href) ? 'active' : ''
            }
            disableRipple
            component='a'
            onClick={closeSidebar}
            startIcon={icon}
        >
          {text}
        </Button>
      </NextLink>
    </ListItem>
  )
}
