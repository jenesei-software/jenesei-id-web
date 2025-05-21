import {
  ResourceDto,
  useResourceConnect,
  useResourceList,
  useResourceProfile
} from '@jenesei-software/jenesei-id-web-api'
import { Button, Icon, Separator, Typography } from '@jenesei-software/jenesei-ui-react'
import { Stack } from '@jenesei-software/jenesei-ui-react/component-stack'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { RESOURCE_LIST } from '@local/core/constants'

export function PagePrivateResources() {
  const { t } = useTranslation('translation')
  const { data: dataResourceList } = useResourceList()
  const { data: dataResourceProfile } = useResourceProfile()
  return (
    <Stack
      sx={{
        default: {
          width: '100%',
          height: '100%',
          alignItems: 'stretch',
          flexDirection: 'column',
          flexGrow: 1,
          gap: '20px'
        }
      }}
    >
      <Stack
        sx={{
          default: {
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '6px'
          }
        }}
      >
        <Typography
          sx={{
            default: {
              variant: 'h6',
              weight: 700,
              color: 'black80',
              line: 1
            }
          }}
        >
          {t('private.resources.menu.title')}
        </Typography>
        <Typography
          sx={{
            default: {
              variant: 'h8',
              weight: 500,
              color: 'black50',
              line: 2
            }
          }}
        >
          {t('private.resources.menu.description')}
        </Typography>
      </Stack>
      <Separator color="black05" height="2px" width="100%" radius="4px" />
      <Stack
        sx={{
          default: {
            width: '100%',
            display: 'grid',
            gridTemplateColumns: 'repeat(4, minmax(300px, 1fr))',
            gap: '12px'
          },
          tablet: {
            gridTemplateColumns: 'repeat(3, minmax(300px, 1fr))'
          },
          mobile: {
            gridTemplateColumns: 'repeat(auto-fit, minmax(100%, 1fr))'
          }
        }}
      >
        {dataResourceList?.map((resource: ResourceDto) => (
          <PagePrivateResourcesItem
            key={resource.resourceId}
            resource={resource}
            isConnect={(dataResourceProfile ?? []).some(r => r.resourceId === resource.resourceId)}
          />
        ))}
      </Stack>
    </Stack>
  )
}
export function PagePrivateResourcesItem(props: { resource: ResourceDto; isConnect: boolean }) {
  const { mutate, isPending } = useResourceConnect()
  const { t: tPage } = useTranslation('translation', { keyPrefix: 'private.resources' })
  const description = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    return tPage(`services.${props.resource.resourceName}.description`)
  }, [props.resource.resourceName, tPage])
  return (
    <Stack
      sx={theme => ({
        default: {
          width: '100%',
          height: '100%',
          alignItems: 'flex-start',
          flexDirection: 'column',
          flexGrow: 1,
          gap: '8px',
          borderRadius: '20px',
          padding: '14px',
          border: `1px solid ${theme.palette.grayMonica}`
        },
        mobile: {
          minWidth: '100%',
          width: '100%',
          padding: '8px'
        }
      })}
    >
      {RESOURCE_LIST[props.resource.resourceName] && (
        <Stack sx={{ default: { alignItems: 'center', justifyContent: 'space-between' } }}>
          <Icon
            type="logo"
            name={RESOURCE_LIST[props.resource.resourceName].icon}
            size="100%"
            primaryColor="blueRest"
            sx={{
              default: {
                width: '36px',
                height: '36px',
                minWidth: '36px',
                maxWidth: '36px'
              }
            }}
          />
          <Typography
            sx={{
              default: {
                variant: 'h5',
                weight: 700,
                color: 'blueRest',
                line: 1
              }
            }}
          >
            {RESOURCE_LIST[props.resource.resourceName].name}
          </Typography>
        </Stack>
      )}
      <Stack sx={{ default: { alignItems: 'center', justifyContent: 'space-between' } }}>
        <Typography
          sx={{
            default: {
              variant: 'h8',
              weight: 500,
              color: 'black60',
              line: 3
            }
          }}
        >
          {description}
        </Typography>
      </Stack>
      <Stack
        sx={{
          default: { alignItems: 'center', justifyContent: 'flex-start', gap: '12px' }
        }}
      >
        <Button
          isHidden={isPending}
          isDisabled={isPending || props.isConnect}
          isOnlyIcon={isPending}
          isRadius
          genre={props.isConnect ? 'greenTransparent' : 'gray'}
          size="small"
          icons={[
            {
              type: 'loading',
              name: 'Line',
              isHidden: !isPending
            }
          ]}
          onClick={() => mutate({ body: { resourceId: props.resource.resourceId } })}
        >
          {props.isConnect ? tPage('button-connected') : tPage('button-connect')}
        </Button>
        <Button isRadius isDisabled genre={props.resource.isActive ? 'greenTransparent' : 'gray'} size="small">
          {props.resource.isActive ? tPage('button-active') : tPage('button-inactive')}
        </Button>
      </Stack>
    </Stack>
  )
}
