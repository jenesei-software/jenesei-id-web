import { Icon, IconItemProps, Ripple } from '@jenesei-software/jenesei-ui-react'
import { Stack } from '@jenesei-software/jenesei-ui-react/component-stack'
import { Link, LinkProps, useMatches } from '@tanstack/react-router'
import { FC } from 'react'
import { useTheme } from 'styled-components'

import {
  PageRoutePrivateLanguageAndCountry,
  PageRoutePrivatePersonalInfo,
  PageRoutePrivateResources,
  PageRoutePrivateSessionsAndSecurity
} from '@local/core/router'

export const Footer: FC = () => {
  return (
    <Stack
      sx={() => ({
        default: {
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'row',
          flexGrow: 1,
          userSelect: 'none'
        }
      })}
    >
      <FooterItem icon="Profile" to={PageRoutePrivatePersonalInfo.fullPath} />
      <FooterItem icon="Document" to={PageRoutePrivateSessionsAndSecurity.fullPath} />
      <FooterItem icon="Language" to={PageRoutePrivateLanguageAndCountry.fullPath} />
      <FooterItem icon="Resources" to={PageRoutePrivateResources.fullPath} />
    </Stack>
  )
}
const FooterItem: FC<{
  to: LinkProps['to']
  icon: IconItemProps<'id'>['name']
}> = props => {
  const theme = useTheme()
  const isMatch = useMatches({
    select(matches) {
      return matches.some(match => match.fullPath === props.to)
    }
  })
  return (
    <Link
      to={props.to}
      style={{
        width: '-webkit-fill-available',
        height: '-webkit-fill-available',
        textDecoration: 'none',
        flexGrow: 1,
        display: 'flex'
      }}
    >
      <Stack
        isRipple
        sx={() => ({
          default: {
            background: isMatch ? theme.palette.black05 : theme.palette.transparent,
            borderStyle: 'solid',
            borderColor: isMatch ? theme.palette.black80 : theme.palette.black05,
            borderWidth: '4px 0px 0px 0px',
            width: '100%',
            flexDirection: 'row',
            gap: '16px',
            alignItems: 'center',
            justifyContent: 'center',
            alignSelf: 'stretch',
            flexGrow: 1,
            paddingBottom: '35px'
          }
        })}
      >
        <Ripple color={theme.palette.black80} />
        <Stack
          sx={theme => ({
            default: {
              background: isMatch ? theme.palette.black80 : theme.palette.whiteStandard,
              borderRadius: '100px',
              alignItems: 'center',
              justifyContent: 'center',
              width: '44px',
              minWidth: '44px',
              height: '44px',
              boxShadow: theme.effects.button
            }
          })}
        >
          <Icon type="id" name={props.icon} size="large" primaryColor={isMatch ? 'whiteStandard' : 'black80'} />
        </Stack>
      </Stack>
    </Link>
  )
}
