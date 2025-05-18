import { Icon, LibraryIconIdItemProps } from '@jenesei-software/jenesei-ui-react/component-icon'
import { Ripple } from '@jenesei-software/jenesei-ui-react/component-ripple'
import { Stack } from '@jenesei-software/jenesei-ui-react/component-stack'
import { Typography } from '@jenesei-software/jenesei-ui-react/component-typography'
import { useScreenWidth } from '@jenesei-software/jenesei-ui-react/context-screen-width'
import { Link, LinkProps, useMatches } from '@tanstack/react-router'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'styled-components'

import {
  PageRoutePrivateLanguageAndCountry,
  PageRoutePrivatePersonalInfo,
  PageRoutePrivateResources,
  PageRoutePrivateSessionsAndSecurity
} from '@local/core/router'

export const LeftAside: FC = () => {
  const { t: tPrivate } = useTranslation('translation', { keyPrefix: 'private' })

  const { screenActual } = useScreenWidth()

  return (
    <Stack
      sx={() => ({
        default: {
          flexGrow: 1,
          justifyContent: 'space-between',
          alignItems: 'stretch',
          flexDirection: 'column',
          overflow: 'hidden'
        }
      })}
    >
      <Stack
        sx={() => ({
          default: {
            alignItems: 'center',
            justifyContent: 'flex-start',
            paddingLeft: screenActual.value === 'default' ? '20px' : '12px',
            height: '68px'
          }
        })}
      >
        <Typography
          sx={{
            default: {
              size: 18,
              weight: 500,
              color: 'black100'
            }
          }}
        >
          {tPrivate('title-account')}
        </Typography>
      </Stack>
      <Stack
        sx={theme => ({
          default: {
            alignItems: 'center',
            justifyContent: 'flex-start',
            flexDirection: 'column',
            flexGrow: 1,
            borderStyle: 'solid',
            borderColor: theme.palette.black05,
            borderWidth: '2px 0px 0px 0px'
          }
        })}
      >
        <LeftAsideItem
          description={tPrivate('personal-info.menu.description')}
          title={tPrivate('personal-info.menu.title')}
          icon="Profile"
          to={PageRoutePrivatePersonalInfo.fullPath}
        />
        <LeftAsideItem
          description={tPrivate('sessions-and-security.menu.description')}
          title={tPrivate('sessions-and-security.menu.title')}
          icon="Document"
          to={PageRoutePrivateSessionsAndSecurity.fullPath}
        />
        <LeftAsideItem
          description={tPrivate('language-and-country.menu.description')}
          title={tPrivate('language-and-country.menu.title')}
          icon="Language"
          to={PageRoutePrivateLanguageAndCountry.fullPath}
        />
        <LeftAsideItem
          description={tPrivate('resources.menu.description')}
          title={tPrivate('resources.menu.title')}
          icon="Resources"
          to={PageRoutePrivateResources.fullPath}
        />
      </Stack>
    </Stack>
  )
}

const LeftAsideItem: FC<{
  to: LinkProps['to']
  icon: LibraryIconIdItemProps['name']
  title: string
  description: string
}> = props => {
  const { screenActual } = useScreenWidth()
  const theme = useTheme()
  const isMatch = useMatches({
    select(matches) {
      return matches.some(match => match.fullPath === props.to)
    }
  })
  return (
    <Link to={props.to} style={{ width: '-webkit-fill-available', textDecoration: 'none' }}>
      <Stack
        isRipple
        sx={() => ({
          default: {
            background: isMatch ? theme.palette.black05 : theme.palette.transparent,
            borderStyle: 'solid',
            borderColor: isMatch ? theme.palette.black80 : theme.palette.transparent,
            borderWidth: '0px 0px 0px 4px',
            width: '100%',
            padding: '16px 20px 16px 22px',
            flexDirection: 'row',
            gap: '16px',
            alignItems: 'center',
            justifyContent: 'flex-start',
            alignSelf: 'stretch',
            height: '84px'
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
        {screenActual.value === 'default' ? (
          <Stack
            sx={() => ({
              default: {
                alignItems: 'flex-start',
                justifyContent: 'center',
                flexDirection: 'column',
                gap: '4px'
              }
            })}
          >
            <Typography
              sx={{
                default: {
                  size: 14,
                  weight: 500,
                  color: 'black80',
                  line: 1
                }
              }}
            >
              {props.title}
            </Typography>
            <Typography
              sx={{
                default: {
                  variant: 'h8',
                  color: 'black50',
                  line: 2
                }
              }}
            >
              {props.description}
            </Typography>
          </Stack>
        ) : null}
      </Stack>
    </Link>
  )
}
