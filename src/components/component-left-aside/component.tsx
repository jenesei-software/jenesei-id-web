import { Image } from '@jenesei-software/jenesei-ui-react'
import { Icon, IconItemProps } from '@jenesei-software/jenesei-ui-react/component-icon'
import { Ripple } from '@jenesei-software/jenesei-ui-react/component-ripple'
import { Stack } from '@jenesei-software/jenesei-ui-react/component-stack'
import { Typography } from '@jenesei-software/jenesei-ui-react/component-typography'
import { useScreenWidth } from '@jenesei-software/jenesei-ui-react/context-screen-width'
import { useIsFetching, useIsMutating } from '@tanstack/react-query'
import { Link, LinkProps, useMatches } from '@tanstack/react-router'
import { FC, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useTheme } from 'styled-components'

import {
  LayoutRoutePrivate,
  PageRoutePrivateLanguageAndCountry,
  PageRoutePrivatePersonalInfo,
  PageRoutePrivateResources,
  PageRoutePrivateSessionsAndSecurity
} from '@local/core/router'

export const LeftAside: FC = () => {
  const isFetching = useIsFetching()
  const isMutating = useIsMutating()
  const isLoading = useMemo(() => isFetching > 0 || isMutating > 0, [isFetching, isMutating])
  const { t: tPrivate } = useTranslation('translation', { keyPrefix: 'private' })

  const { screenActual } = useScreenWidth()
  const isMatchPrivate = useMatches({
    select(matches) {
      return matches.some(match => match.fullPath === LayoutRoutePrivate.fullPath)
    }
  })
  return isMatchPrivate ? (
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
            paddingLeft: screenActual === 'default' ? '20px' : '12px',
            height: '68px'
          }
        })}
      >
        <Typography
          sx={{
            default: {
              size: 18,
              weight: 500,
              color: 'black100',
              line: 1
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
          icon="Lock"
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
      <Stack
        sx={theme => ({
          default: {
            height: '84px',
            padding: screenActual === 'default' ? '0px 26px' : '0px 32px',
            gap: '14px',
            alignItems: 'center',
            justifyContent: 'flex-start',
            backgroundColor: theme.palette.black100
          }
        })}
      >
        <Stack
          sx={{
            default: {
              width: '32px',
              minWidth: '32px',
              height: '32px'
            }
          }}
        >
          {isLoading ? (
            <Icon type="loading" name="Line" size="100%" primaryColor="whiteStandard" />
          ) : (
            <Icon type="logo" name="Jenesei" size="100%" primaryColor="blueRest" />
          )}
        </Stack>

        {screenActual === 'default' && (
          <Typography
            sx={{
              default: {
                size: 20,
                weight: 700,
                color: 'whiteStandard',
                line: 1
              }
            }}
          >
            Jenesei ID
          </Typography>
        )}
      </Stack>
    </Stack>
  ) : (
    <Stack
      sx={() => ({
        default: {
          flexGrow: 1,
          justifyContent: 'space-between',
          alignItems: 'stretch',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden'
        }
      })}
    >
      <>
        <Image
          src="https://id.jenesei.ru/images/auth-back-mountain.jpg"
          alt="Mountain"
          propsStack={{
            sx: theme => ({
              default: {
                width: '100%',
                height: '100%',
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.palette.black10,
                pointerEvents: 'none'
              }
            })
          }}
        />
        <Stack
          sx={{
            default: {
              flexGrow: 1,
              alignItems: 'center',
              justifyContent: 'center'
            }
          }}
        >
          <Stack
            sx={{
              default: {
                width: '82px',
                height: '82px'
              }
            }}
          >
            <Icon type="logo" name="Jenesei" size="100%" primaryColor="whiteStandard" />
          </Stack>

          <Typography
            sx={{
              default: {
                size: 42,
                weight: 700,
                color: 'whiteStandard',
                line: 1
              }
            }}
          >
            Jenesei ID
          </Typography>
        </Stack>
      </>
    </Stack>
  )
}

const LeftAsideItem: FC<{
  to: LinkProps['to']
  icon: IconItemProps<'id'>['name']
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
        {screenActual === 'default' ? (
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
