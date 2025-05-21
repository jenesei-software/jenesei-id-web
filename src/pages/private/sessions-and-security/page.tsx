import { SessionDto, useSessionTerminate, useWSSession } from '@jenesei-software/jenesei-id-web-api'
import { Button, Icon, Input, Separator, Stack, Typography } from '@jenesei-software/jenesei-ui-react'
import { useForm } from '@tanstack/react-form'
import moment from 'moment'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { UAParser } from 'ua-parser-js'

import { Form } from '@local/components/component-form'
import { useValidation } from '@local/contexts/context-validation'

export function PagePrivateSessionsAndSecurity() {
  const { t: tPage } = useTranslation('translation', { keyPrefix: 'private.sessions-and-security' })
  const { t: tForm } = useTranslation('translation', { keyPrefix: 'form' })

  const { validationPasswordUpdate, validationFunctions } = useValidation()
  const { data: dataWSSession } = useWSSession()
  const form = useForm({
    defaultValues: {
      oldPassword: '',
      newPassword: '',
      confirmNewPassword: ''
    },

    onSubmit: async ({ value }) => {
      console.log(value)
      try {
        // do nothing
      } catch {
        // do nothing
      }
    },
    canSubmitWhenInvalid: false,
    validators: {
      onBlurAsync: validationFunctions.touched(validationPasswordUpdate)
    }
  })

  useEffect(() => {
    form.validate('blur')
  }, [form, tForm])

  return (
    <Stack
      sx={{
        default: {
          width: '100%',
          height: 'fit-content',
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
          {tPage('menu.title')}
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
          {tPage('menu.description')}
        </Typography>
      </Stack>
      <Separator color="black05" height="2px" width="100%" radius="4px" />
      <Stack
        sx={{
          default: {
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '16px',
            width: '300px'
          },
          mobile: {
            width: '100%'
          }
        }}
      >
        <Stack
          sx={{
            default: {
              flexDirection: 'column',

              gap: '8px'
            }
          }}
        >
          <Typography
            sx={{
              default: {
                variant: 'h7',
                weight: 700,
                color: 'black80',
                line: 1
              }
            }}
          >
            {tPage('form-password.title')}
          </Typography>
          <Typography
            sx={{
              default: {
                variant: 'h8',
                weight: 500,
                color: 'black60',
                line: 1
              }
            }}
          >
            {tPage('form-password.description')}
          </Typography>
        </Stack>
        <Form
          width="100%"
          handleSubmit={form.handleSubmit}
          style={{
            gap: '22px'
          }}
        >
          <form.Field name="oldPassword">
            {field => (
              <Stack
                sx={{
                  default: {
                    flexDirection: 'column',
                    position: 'relative'
                  }
                }}
              >
                <Input
                  variety="standard"
                  autocomplete="current-password"
                  type="password"
                  placeholder={tPage('form-password.placeholder-old')}
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  genre="blackBorder"
                  size="medium"
                  isNoSpaces
                  error={{
                    errorMessage: field.state.meta.errors?.join(','),
                    isError: !!field.state.meta.isTouched && !!field.state.meta.errors.length,
                    isErrorAbsolute: true
                  }}
                />
              </Stack>
            )}
          </form.Field>
          <form.Field name="newPassword">
            {field => (
              <Stack
                sx={{
                  default: {
                    flexDirection: 'column',
                    position: 'relative'
                  }
                }}
              >
                <Input
                  variety="standard"
                  autocomplete="current-password"
                  type="password"
                  placeholder={tPage('form-password.placeholder-new')}
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  genre="blackBorder"
                  size="medium"
                  isNoSpaces
                  error={{
                    errorMessage: field.state.meta.errors?.join(','),
                    isError: !!field.state.meta.isTouched && !!field.state.meta.errors.length,
                    isErrorAbsolute: true
                  }}
                />
              </Stack>
            )}
          </form.Field>
          <form.Field name="confirmNewPassword">
            {field => (
              <Stack
                sx={{
                  default: {
                    flexDirection: 'column',
                    position: 'relative'
                  }
                }}
              >
                <Input
                  variety="standard"
                  autocomplete="current-password"
                  type="password"
                  placeholder={tPage('form-password.placeholder-new-confirm')}
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  genre="blackBorder"
                  size="medium"
                  isNoSpaces
                  error={{
                    errorMessage: field.state.meta.errors?.join(','),
                    isError: !!field.state.meta.isTouched && !!field.state.meta.errors.length,
                    isErrorAbsolute: true
                  }}
                />
              </Stack>
            )}
          </form.Field>
          <form.Subscribe>
            {state => (
              <Button
                type="submit"
                isHidden={!state.canSubmit}
                isDisabled={!state.canSubmit || state.isSubmitting}
                genre="black"
                size="mediumSmall"
                isOnlyIcon={state.isSubmitting}
                sx={{
                  default: {
                    width: 'fit-content',
                    minWidth: '160px'
                  },
                  mobile: {
                    width: '100%'
                  }
                }}
                icons={[
                  {
                    type: 'loading',
                    name: 'Line',
                    isHidden: !state.isSubmitting
                  }
                ]}
              >
                {tPage('form-password.title-button')}
              </Button>
            )}
          </form.Subscribe>
        </Form>
      </Stack>
      <Separator color="black05" height="2px" width="100%" radius="4px" />
      <Stack
        sx={{
          default: {
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '8px',
            width: '100%'
          }
        }}
      >
        <Stack
          sx={{
            default: {
              flexDirection: 'column',

              gap: '8px'
            }
          }}
        >
          <Typography
            sx={{
              default: {
                variant: 'h7',
                weight: 700,
                color: 'black80',
                line: 1
              }
            }}
          >
            {tPage('form-session.title')}
          </Typography>
          <Typography
            sx={{
              default: {
                variant: 'h8',
                weight: 500,
                color: 'black60',
                line: 1
              }
            }}
          >
            {tPage('form-session.description')}
          </Typography>
        </Stack>
        <Stack
          sx={{
            default: {
              width: '100%',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '12px'
            }
          }}
        >
          {dataWSSession &&
            Object.entries(dataWSSession).map(([key, session]) => (
              <PagePrivateSessionsAndSecuritySessionItem key={key} session={session} sessionId={key} />
            ))}
        </Stack>
      </Stack>
    </Stack>
  )
}
export function PagePrivateSessionsAndSecuritySessionItem(props: { session: SessionDto; sessionId: string }) {
  const { mutate, isPending } = useSessionTerminate()
  const { t: tPage } = useTranslation('translation', { keyPrefix: 'private.sessions-and-security' })

  const result = useMemo(() => {
    const parser = new UAParser()
    parser.setUA(props.session.userAgent)
    return parser.getResult()
  }, [props.session.userAgent])
  return (
    <Stack
      sx={theme => ({
        default: {
          width: '100%',
          height: '100%',
          alignItems: 'stretch',
          flexDirection: 'column',
          backgroundColor: theme.palette.grayJanice,
          flexGrow: 1,
          gap: '10px',
          borderRadius: '20px',
          padding: '10px'
        },
        mobile: {
          minWidth: '100%',
          width: '100%'
        }
      })}
    >
      <Stack sx={{ default: { alignItems: 'center', justifyContent: 'space-between', padding: '0px 6.5px 0px 0px' } }}>
        <Icon type="id" name="Web" size="large" primaryColor="blueRest" />
        <Stack
          sx={theme => ({
            default: {
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: props.session.current ? theme.palette.greenGoogle : theme.palette.grayJanice
            }
          })}
        />
      </Stack>
      <Stack sx={{ default: { alignItems: 'center', justifyContent: 'space-between', padding: '0px 6.5px 0px 0px' } }}>
        <Typography
          sx={{
            default: {
              variant: 'h8',
              weight: 700,
              color: 'black60',
              line: 1
            }
          }}
        >
          Device:
        </Typography>
        <Typography
          sx={{
            default: {
              variant: 'h8',
              weight: 700,
              color: 'black60',
              line: 1
            }
          }}
        >
          {result.browser.name} {result.browser.type} {result.browser.version}
        </Typography>
      </Stack>
      <Stack sx={{ default: { alignItems: 'center', justifyContent: 'space-between', padding: '0px 6.5px 0px 0px' } }}>
        <Typography
          sx={{
            default: {
              variant: 'h8',
              weight: 700,
              color: 'black60',
              line: 1
            }
          }}
        >
          OC:
        </Typography>
        <Typography
          sx={{
            default: {
              variant: 'h8',
              weight: 700,
              color: 'black60',
              line: 1
            }
          }}
        >
          {result.os.name}
        </Typography>
      </Stack>
      <Stack sx={{ default: { alignItems: 'center', justifyContent: 'space-between', padding: '0px 6.5px 0px 0px' } }}>
        <Typography
          sx={{
            default: {
              variant: 'h8',
              weight: 700,
              color: 'black60',
              line: 1
            }
          }}
        >
          Last activity:
        </Typography>
        <Typography
          sx={{
            default: {
              variant: 'h8',
              weight: 700,
              color: 'black60',
              line: 1
            }
          }}
        >
          {moment(props.session.lastActivity).format('YYYY.MM.DD HH:mm:ss')}
        </Typography>
      </Stack>
      <Stack
        sx={{
          default: { alignItems: 'center', justifyContent: 'flex-start', padding: '0px 6.5px 0px 0px', gap: '12px' }
        }}
      >
        <Button
          isHidden={isPending}
          isDisabled={isPending}
          isOnlyIcon={isPending}
          isRadius
          genre="gray"
          size="small"
          icons={[
            {
              type: 'loading',
              name: 'Line',
              isHidden: !isPending
            }
          ]}
          onClick={() => mutate({ path: { sessionId: props.sessionId } })}
        >
          {tPage('form-session.title-button-close')}
        </Button>
        {props.session.current && (
          <Button isRadius isDisabled genre="greenTransparent" size="small">
            {tPage('form-session.title-button-current')}
          </Button>
        )}
      </Stack>
    </Stack>
  )
}
