import { useSSOSignIn } from '@jenesei-software/jenesei-id-web-api'
import { Button } from '@jenesei-software/jenesei-ui-react/component-button'
import { Input } from '@jenesei-software/jenesei-ui-react/component-input'
import { Stack } from '@jenesei-software/jenesei-ui-react/component-stack'
import { Typography, TypographyLink } from '@jenesei-software/jenesei-ui-react/component-typography'
import { useForm } from '@tanstack/react-form'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { Form } from '@local/components/component-form'
import { useValidation } from '@local/contexts/context-validation'
import { PageRoutePublicForgotPassword, PageRoutePublicSignUp } from '@local/core/router'

export function PagePublicSignIn() {
  const { t: tForm } = useTranslation('translation', { keyPrefix: 'form' })
  const { t: tSignIn } = useTranslation('translation', { keyPrefix: 'public.sign-in' })

  const { validationSignIn, validationFunctions } = useValidation()
  const { mutateAsync } = useSSOSignIn()

  const form = useForm({
    defaultValues: {
      username: '',
      password: ''
    },

    onSubmit: async ({ value }) => {
      try {
        await mutateAsync({
          body: {
            password: value.password,
            nickname: value.username
          }
        })
      } catch {
        // do nothing
      }
    },
    canSubmitWhenInvalid: false,
    validators: {
      onBlurAsync: validationFunctions.touched(validationSignIn)
    }
  })

  useEffect(() => {
    form.validate('blur')
  }, [form, tSignIn])

  return (
    <>
      <Stack
        sx={{
          default: {
            flexDirection: 'column',
            gap: '10px',
            alignItems: 'stretch',
            userSelect: 'none'
          }
        }}
      >
        <Typography
          sx={{
            default: {
              variant: 'h2',
              weight: 700,
              color: 'black100'
            }
          }}
        >
          {tSignIn('title-welcome')}
        </Typography>
        <Typography
          sx={{
            default: {
              variant: 'h8',
              weight: 400,
              color: 'black100'
            }
          }}
        >
          {tSignIn('title-sign-up-1')}{' '}
          <TypographyLink
            to={PageRoutePublicSignUp.fullPath}
            sx={{
              default: {
                variant: 'h8',
                weight: 400,
                color: 'blueRest',
                cursor: 'pointer'
              }
            }}
          >
            {tSignIn('title-sign-up-2')}
          </TypographyLink>
        </Typography>
      </Stack>

      <Form
        width="100%"
        handleSubmit={form.handleSubmit}
        style={{
          gap: '25px'
        }}
      >
        <form.Field name="username">
          {field => {
            return (
              <Stack
                sx={{
                  default: {
                    flexDirection: 'column',
                    gap: '6px',
                    position: 'relative'
                  }
                }}
              >
                <Input
                  variety="standard"
                  autocomplete="username"
                  placeholder={tForm('username.placeholder')}
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  genre="grayBorder"
                  size="medium"
                  isNoSpaces
                  error={{
                    errorMessage: field.state.meta.errors?.join(','),
                    isError: !!field.state.meta.isTouched && !!field.state.meta.errors.length,
                    isErrorAbsolute: true
                  }}
                />
              </Stack>
            )
          }}
        </form.Field>
        <form.Field name="password">
          {field => {
            return (
              <Stack
                sx={{
                  default: {
                    flexDirection: 'column',
                    gap: '6px',
                    position: 'relative'
                  }
                }}
              >
                <Input
                  variety="standard"
                  autocomplete="current-password"
                  type="password"
                  placeholder={tForm('password.placeholder')}
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  genre="grayBorder"
                  size="medium"
                  isNoSpaces
                  error={{
                    errorMessage: field.state.meta.errors?.join(','),
                    isError: !!field.state.meta.isTouched && !!field.state.meta.errors.length,
                    isErrorAbsolute: true
                  }}
                />
              </Stack>
            )
          }}
        </form.Field>

        <Stack
          sx={{
            default: {
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center'
            }
          }}
        >
          <TypographyLink
            to={PageRoutePublicForgotPassword.fullPath}
            sx={{
              default: {
                variant: 'h8',
                weight: 400,
                color: 'blueRest',
                cursor: 'pointer'
              }
            }}
          >
            {tSignIn('title-forgot-password')}
          </TypographyLink>
        </Stack>
        <form.Subscribe>
          {state => (
            <Button
              type="submit"
              isHidden={!state.canSubmit}
              isDisabled={!state.canSubmit || state.isSubmitting}
              genre="product"
              size="medium"
              isOnlyIcon={state.isSubmitting}
              icons={[
                {
                  type: 'loading',
                  name: 'Balls',
                  isHidden: !state.isSubmitting
                }
              ]}
            >
              {tSignIn('title-button')}
            </Button>
          )}
        </form.Subscribe>
      </Form>
    </>
  )
}
