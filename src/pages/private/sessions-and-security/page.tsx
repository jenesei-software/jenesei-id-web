import { SessionDto, useSessionTerminate, useWSSession } from '@jenesei-software/jenesei-id-web-api'
import { Icon, Input, Separator, Typography } from '@jenesei-software/jenesei-ui-react'
import { Button } from '@jenesei-software/jenesei-ui-react/component-button'
import { Stack } from '@jenesei-software/jenesei-ui-react/component-stack'
import { useForm } from '@tanstack/react-form'
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
      try {
        // await mutateAsync({
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
  console.log('dataWSSession', dataWSSession)
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
      <Separator color="black05" height="2px" width="100%" radius="50%" />
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
      <Separator color="black05" height="2px" width="100%" radius="50%" />
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
              flexDirection: 'row',
              alignItems: 'flex-start',
              flexWrap: 'wrap',
              gap: '10px',
              width: '100%',
              alignSelf: 'flex-start'
            }
          }}
        >
          {dataWSSession &&
            Object.entries(dataWSSession).map(([key, session]) => (
              <PagePrivateSessionsAndSecuritySessionItem key={key} session={session} />
            ))}
        </Stack>
      </Stack>
    </Stack>
  )
}
export function PagePrivateSessionsAndSecuritySessionItem(props: { session: SessionDto }) {
  const { mutate } = useSessionTerminate()

  const result = useMemo(() => {
    const parser = new UAParser()
    parser.setUA(props.session.userAgent)
    return parser.getResult()
  }, [props.session.userAgent])
  return (
    <Stack
      sx={theme => ({
        default: {
          minWidth: '300px',
          height: '100%',
          alignItems: 'stretch',
          flexDirection: 'column',
          backgroundColor: theme.palette.grayJanice,
          flexGrow: 1,
          gap: '10px',
          borderRadius: '20px'
        },
        mobile: {
          minWidth: '100%',
          width: '100%'
        }
      })}
    >
      <Stack>
        <Icon type="id" name="Activity" size="large" primaryColor="blueRest" />
      </Stack>
    </Stack>
  )
}
