import { useSSOSignIn } from '@jenesei-software/jenesei-id-web-api'
import { Button } from '@jenesei-software/jenesei-ui-react/component-button'
import { Input } from '@jenesei-software/jenesei-ui-react/component-input'
import { Stack } from '@jenesei-software/jenesei-ui-react/component-stack'
import { Typography } from '@jenesei-software/jenesei-ui-react/component-typography'
import { useApp } from '@jenesei-software/jenesei-ui-react/context-app'
import { useForm } from '@tanstack/react-form'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { Form } from '@local/components/component-form'
import { useValidation } from '@local/contexts/context-validation'

export function PagePublicSignIn() {
  // const navigate = useNavigate()
  const { t: tForm } = useTranslation('translation', { keyPrefix: 'form' })
  const { t: tSignIn } = useTranslation('translation', { keyPrefix: 'private.sign-in' })

  const { changeTitle } = useApp()
  const { validationSignIn, validationFunctions } = useValidation()
  const { t: tPrivateSignIn } = useTranslation('translation', { keyPrefix: 'private.sign-in' })
  const { mutateAsync } = useSSOSignIn()
  useEffect(() => {
    changeTitle(tPrivateSignIn('title-url'))
  }, [changeTitle, tPrivateSignIn])

  const form = useForm({
    defaultValues: {
      nickname: '',
      password: ''
    },

    onSubmit: async ({ value }) => {
      try {
        await mutateAsync({
          body: {
            password: value.password,
            nickname: value.nickname
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
  }, [form, tPrivateSignIn])

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
          <Typography
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
          </Typography>
        </Typography>
      </Stack>

      <Form
        width="100%"
        handleSubmit={form.handleSubmit}
        style={{
          gap: '25px'
        }}
      >
        <form.Field name="nickname">
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
                  genre="realebail-white"
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
                  genre="realebail-white"
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
          <Typography
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
          </Typography>
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
