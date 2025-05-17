import {
  useAuthConfirmEmail,
  useAuthConfirmation,
  useAuthSignUp
} from '@jenesei-software/jenesei-realebail-web-api/api-auth'
import { Button } from '@jenesei-software/jenesei-ui-react/component-button'
import { DatePicker, MonthItem, WeekItem } from '@jenesei-software/jenesei-ui-react/component-date-picker'
import { Input } from '@jenesei-software/jenesei-ui-react/component-input'
import { InputOTP } from '@jenesei-software/jenesei-ui-react/component-input-otp'
import { Stack } from '@jenesei-software/jenesei-ui-react/component-stack'
import { Typography } from '@jenesei-software/jenesei-ui-react/component-typography'
import { useApp } from '@jenesei-software/jenesei-ui-react/context-app'
import { useSonner } from '@jenesei-software/jenesei-ui-react/context-sonner'
import { useForm } from '@tanstack/react-form'
import { useNavigate } from '@tanstack/react-router'
import moment from 'moment'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Form } from '@local/components/component-form'
import { useValidation } from '@local/contexts/context-validation'
import { PageRoutePublicSignIn } from '@local/core/router'

export function PagePublicSignUp() {
  const navigate = useNavigate()
  const { changeTitle } = useApp()
  const { validation, validationFunctions } = useValidation()
  const { t } = useTranslation('translation')

  const [attempts, setAttempts] = useState(0)
  const [isCooldown, setIsCooldown] = useState(false)
  const [cooldownTime, setCooldownTime] = useState(0)

  const { mutateAsync: mutateAsyncConfirmation, reset: resetConfirmation } = useAuthConfirmation()
  const { mutateAsync: mutateAsyncConfirmEmail, isPending, reset: resetConfirmEmail } = useAuthConfirmEmail()
  const { mutateAsync: mutateAsyncSignUp, reset: resetSignUp } = useAuthSignUp()

  const { toast } = useSonner()

  useEffect(() => {
    if (attempts !== 0) {
      changeTitle(t('sign-up.title-url-confirmation'))
    } else {
      changeTitle(t('sign-up.title-url'))
    }
  }, [changeTitle, attempts, t])

  const form = useForm({
    defaultValues: {
      email: '',
      currentPassword: '',
      confirmPassword: '',
      username: '',
      dateOfBirth: 0,
      code: ''
    },

    onSubmit: async ({ value }) => {
      if (attempts === 0) {
        try {
          await mutateAsyncConfirmEmail({
            body: {
              email: value.email
            }
          })
        } catch {
          reset()
          toast({
            title: t('sonner.auth-sign-up.error.title'),
            description: t('sonner.auth-sign-up.error.description'),
            genre: 'redTransparent',
            hidingTime: 3000
          })
        } finally {
          setAttempts(prev => prev + 1)
          setIsCooldown(true)
          setCooldownTime(60)

          const interval = setInterval(() => {
            setCooldownTime(prev => {
              if (prev <= 1) {
                clearInterval(interval)
                setIsCooldown(false)
                return 0
              }
              return prev - 1
            })
          }, 1000)
        }
      } else {
        try {
          await mutateAsyncConfirmation({
            body: {
              code: value.code,
              email: value.email
            }
          })
          try {
            await mutateAsyncSignUp({
              query: {},
              body: {
                password: value.currentPassword,
                email: value.email,
                username: value.username,
                dateOfBirth: moment(value.dateOfBirth).format('YYYY-MM-DD')
              }
            })
          } catch {
            reset()
            toast({
              title: t('sonner.auth-sign-up.error.title'),
              description: t('sonner.auth-sign-up.error.description'),
              genre: 'redTransparent',
              hidingTime: 3000
            })
          }
        } catch {
          if (attempts >= 3) {
            toast({
              title: t('sonner.page-sign-up.full-attempts.title'),
              description: t('sonner.page-sign-up.full-attempts.description'),
              genre: 'redTransparent',
              hidingTime: 3000
            })
            reset()
            return
          } else {
            toast({
              title: t('sonner.auth-confirmation.error.title'),
              description: t('sonner.auth-confirmation.error.description'),
              genre: 'redTransparent',
              hidingTime: 3000
            })
          }
        }
      }
    },
    validators: {
      onChangeAsync: validationFunctions.touched(validation)
    }
  })

  useEffect(() => {
    form.validate('blur')
  }, [form, t])

  const reset = useCallback(() => {
    resetConfirmation()
    resetConfirmEmail()
    resetSignUp()
    form.reset()
    setAttempts(0)
    setIsCooldown(false)
    setCooldownTime(0)
  }, [form, resetConfirmEmail, resetConfirmation, resetSignUp])

  const handleResendCode = useCallback(
    async (email: string) => {
      try {
        await mutateAsyncConfirmEmail({
          body: { email }
        })
      } catch {
        toast({
          title: t('sonner.auth-sign-up.error.title'),
          description: t('sonner.auth-sign-up.error.description'),
          genre: 'redTransparent',
          hidingTime: 3000
        })
      } finally {
        setAttempts(prev => prev + 1)
        setIsCooldown(true)
        setCooldownTime(60)

        const interval = setInterval(() => {
          setCooldownTime(prev => {
            if (prev <= 1) {
              clearInterval(interval)
              setIsCooldown(false)
              return 0
            }
            return prev - 1
          })
        }, 1000)
      }
    },
    [mutateAsyncConfirmEmail, t, toast]
  )

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
          {attempts !== 0 ? t('sign-up.title-confirmation') : t('sign-up.title-sign-up')}
        </Typography>
        <Form
          width="100%"
          handleSubmit={form.handleSubmit}
          style={{
            gap: '25px'
          }}
        >
          {attempts !== 0 ? (
            <form.Field name="code">
              {field => (
                <Stack
                  sx={{
                    default: {
                      flexDirection: 'column',
                      gap: '6px',
                      position: 'relative',
                      alignItems: 'center'
                    }
                  }}
                >
                  <InputOTP
                    id={field.name}
                    isErrorAbsolute
                    width="360px"
                    length={5}
                    onBlur={field.handleBlur}
                    onChange={field.handleChange}
                    genre="realebail-white"
                    size="large"
                    isError={!!field.state.meta.isTouched && !!field.state.meta.errors.length}
                    errorMessage={field.state.meta.errors?.join(',')}
                  />
                </Stack>
              )}
            </form.Field>
          ) : (
            <>
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
              <form.Field name="username">
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
                      autocomplete="username"
                      placeholder={t('form.username.placeholder')}
                      type="username"
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
              <form.Field name="dateOfBirth">
                {field => {
                  const LastHundredYear18YearsAgoStartDate = moment.utc().subtract(118, 'years').valueOf()
                  const LastHundredYear18YearsAgoEndDate = moment.utc().subtract(18, 'years').valueOf()
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
                      <DatePicker
                        locale={{
                          months: Object.values(t('date.months', { returnObjects: true })) as MonthItem[],
                          weeks: Object.values(t('date.weeks', { returnObjects: true })) as WeekItem[]
                        }}
                        placeholder={t('form.dateOfBirth.placeholder')}
                        id={field.name}
                        name={field.name}
                        isOnClickClose
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={field.handleChange}
                        genre="realebail-white"
                        startDate={LastHundredYear18YearsAgoStartDate}
                        endDate={LastHundredYear18YearsAgoEndDate}
                        size="large"
                        inputProps={{
                          variety: 'standard',
                          isError: !!field.state.meta.errors.length,
                          errorMessage: field.state.meta.errors?.join(','),
                          isErrorAbsolute: true
                        }}
                      />
                    </Stack>
                  )
                }}
              </form.Field>
              <form.Field name="currentPassword">
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
              <form.Field name="confirmPassword">
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
                      placeholder={t('form.password.placeholder-confirm')}
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
            </>
          )}

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
              >
                {attempts !== 0 ? t('sign-up.title-button-continue') : t('sign-up.title-button')}
              </Button>
            )}
          </form.Subscribe>
          <form.Field name="email">
            {field =>
              attempts !== 0 &&
              attempts < 3 &&
              !field.state.meta.errors.length && (
                <Button
                  width="100%"
                  type="button"
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
                  isLoading={isPending}
                  isDisabled={isCooldown}
                  isHidden={isCooldown}
                  size="large"
                  customFontSize={'16px'}
                  customFontWeight={400}
                  onClick={() => {
                    handleResendCode(field.state.value)
                  }}
                >
                  {cooldownTime > 0
                    ? t('sign-up.title-button-repeat-time', { seconds: cooldownTime })
                    : t('sign-up.title-button-repeat')}
                </Button>
              )
            }
          </form.Field>
        </Form>
        <Button
          width="100%"
          type="button"
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
            navigate({ to: PageRoutePublicSignIn.fullPath })
          }}
        >
          {t('sign-up.title-sign-in')}
        </Button>
      </Stack>
    </Stack>
  )
}
