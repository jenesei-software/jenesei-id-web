import { useAuthSignIn } from '@jenesei-software/jenesei-realebail-web-api/api-auth'
import { Button } from '@jenesei-software/jenesei-ui-react/component-button'
import { Input } from '@jenesei-software/jenesei-ui-react/component-input'
import { Stack } from '@jenesei-software/jenesei-ui-react/component-stack'
import { Typography } from '@jenesei-software/jenesei-ui-react/component-typography'
import { useApp } from '@jenesei-software/jenesei-ui-react/context-app'
import { useSonner } from '@jenesei-software/jenesei-ui-react/context-sonner'
import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { Form } from '@local/components/component-form'
import { useValidation } from '@local/contexts/context-validation'
import { PageRoutePublicForgotPassword, PageRoutePublicSignUp } from '@local/core/router'

export function PagePublicSignIn() {
  const navigate = useNavigate()
  const { changeTitle } = useApp()
  const { validation, validationFunctions } = useValidation()
  const { t } = useTranslation('translation')
  const { mutateAsync } = useAuthSignIn()
  const { toast } = useSonner()
  useEffect(() => {
    changeTitle(t('sign-in.title-url'))
  }, [changeTitle, t])

  const form = useForm({
    defaultValues: {
      email: '',
      password: ''
    },

    onSubmit: async ({ value }) => {
      try {
        await mutateAsync({
          body: {
            password: value.password,
            email: value.email
          }
        })
      } catch {
        toast({
          title: t('sonner.auth-sign-in.error.title'),
          description: t('sonner.auth-sign-in.error.description'),
          genre: 'redTransparent',
          hidingTime: 3000
        })
      }
    },
    validators: {
      onChangeAsync: validationFunctions.touched(validation)
    }
  })

  useEffect(() => {
    form.validate('blur')
  }, [form, t])

  return (
    <Stack
      sx={{
        default: {
          alignItems: 'center',
          justifyContent: 'center',
          flexGrow: 1,
          padding: '12px',
          overflow: 'hidden'
        }
      }}
    >
      <Stack
        sx={{
          default: {
            width: '490px',
            maxWidth: '100dvw',
            flexDirection: 'column',
            gap: '45px',
            alignItems: 'stretch'
          }
        }}
      >
        <Typography family="Inter" weight={700} size={24} color="black100" letterSpacing={'-0.02em'} align="center">
          {t('sign-in.title-sign-in')}
        </Typography>
        <Form
          width="100%"
          handleSubmit={form.handleSubmit}
          style={{
            gap: '25px'
          }}
        >
          <form.Field name="email">
            {field => (
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
                  autocomplete="email"
                  placeholder={t('form.email.placeholder')}
                  type="email"
                  id={field.name}
                  name={field.name}
                  isErrorAbsolute
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  genre="realebail-white"
                  size="large"
                  isNoSpaces
                  isError={!!field.state.meta.isTouched && !!field.state.meta.errors.length}
                  errorMessage={field.state.meta.errors?.join(',')}
                />
              </Stack>
            )}
          </form.Field>
          <form.Field name="password">
            {field => (
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
                  placeholder={t('form.password.placeholder')}
                  id={field.name}
                  isErrorAbsolute
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  genre="realebail-white"
                  size="large"
                  isNoSpaces
                  isError={!!field.state.meta.isTouched && !!field.state.meta.errors.length}
                  errorMessage={field.state.meta.errors?.join(',')}
                />
              </Stack>
            )}
          </form.Field>
          <form.Subscribe>
            {state => (
              <Button
                width="100%"
                type="submit"
                isLoading={state.isSubmitting}
                isOnlyLoading
                isHidden={!state.canSubmit}
                isDisabled={!state.canSubmit || state.isSubmitting}
                genre="realebail-product"
                size="large"
                customFontWeight={300}
                // onClick={() => {
                //   form.handleSubmit()
                // }}
              >
                {t('sign-in.title-button')}
              </Button>
            )}
          </form.Subscribe>
        </Form>
        <Stack
          sx={{
            default: {
              gap: '8px',
              alignItems: 'stretch',
              flexDirection: 'column'
            }
          }}
        >
          <Button
            width="100%"
            type="submit"
            isOnlyLoading
            genre="realebail-gray"
            sx={{
              default: {
                backgroundColor: 'transparent',
                '&:hover': {
                  backgroundColor: 'transparent'
                }
              }
            }}
            size="large"
            customFontSize={'16px'}
            customFontWeight={400}
            onClick={() => {
              navigate({ to: PageRoutePublicSignUp.fullPath })
            }}
          >
            {t('sign-in.title-sign-up')}
          </Button>
          <Button
            width="100%"
            type="submit"
            isOnlyLoading
            genre="realebail-gray"
            sx={{
              default: {
                backgroundColor: 'transparent',
                '&:hover': {
                  backgroundColor: 'transparent'
                }
              }
            }}
            size="large"
            customFontSize={'16px'}
            customFontWeight={400}
            onClick={() => {
              navigate({ to: PageRoutePublicForgotPassword.fullPath })
            }}
          >
            {t('sign-in.title-forgot-password')}
          </Button>
        </Stack>
      </Stack>
    </Stack>
  )
}
