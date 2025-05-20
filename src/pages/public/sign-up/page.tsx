import { useSSOPreSignUp, useSSOSignUp, useSSOVerify } from '@jenesei-software/jenesei-id-web-api'
import { Button } from '@jenesei-software/jenesei-ui-react/component-button'
import { DatePicker, MonthItem, WeekItem } from '@jenesei-software/jenesei-ui-react/component-date-picker'
import { Input } from '@jenesei-software/jenesei-ui-react/component-input'
import { InputOTP } from '@jenesei-software/jenesei-ui-react/component-input-otp'
import { Stack } from '@jenesei-software/jenesei-ui-react/component-stack'
import { Typography, TypographyLink } from '@jenesei-software/jenesei-ui-react/component-typography'
import { useForm } from '@tanstack/react-form'
import moment from 'moment'
import { useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Form } from '@local/components/component-form'
import { useValidation } from '@local/contexts/context-validation'
import { PageRoutePublicSignIn } from '@local/core/router'

export function PagePublicSignUp() {
  const { validationSignUp, validationFunctions } = useValidation()
  const { t: tForm } = useTranslation('translation', { keyPrefix: 'form' })
  const { t: tSignUp } = useTranslation('translation', { keyPrefix: 'public.sign-up' })
  const { t: tDate } = useTranslation('translation', { keyPrefix: 'date' })

  const [attempts, setAttempts] = useState(0)
  const [isCooldown, setIsCooldown] = useState(false)
  const [cooldownTime, setCooldownTime] = useState(0)

  const { mutateAsync: mutateAsyncConfirmation, reset: resetConfirmation } = useSSOVerify()
  const { mutateAsync: mutateAsyncConfirmEmail, isPending, reset: resetConfirmEmail } = useSSOPreSignUp()
  const { mutateAsync: mutateAsyncSignUp, reset: resetSignUp } = useSSOSignUp()

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
            path: {
              email: value.email
            }
          })
        } catch {
          reset()
          // toast({
          //   title: t('sonner.auth-sign-up.error.title'),
          //   description: t('sonner.auth-sign-up.error.description'),
          //   genre: 'redTransparent',
          //   hidingTime: 3000
          // })
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
              body: {
                password: value.currentPassword,
                email: value.email,
                nickname: value.username,
                dateOfBirth: moment(value.dateOfBirth).format('DD.MM.YYYY')
              }
            })
          } catch {
            reset()
            // toast({
            //   title: t('sonner.auth-sign-up.error.title'),
            //   description: t('sonner.auth-sign-up.error.description'),
            //   genre: 'redTransparent',
            //   hidingTime: 3000
            // })
          }
        } catch {
          if (attempts >= 3) {
            // toast({
            //   title: t('sonner.page-sign-up.full-attempts.title'),
            //   description: t('sonner.page-sign-up.full-attempts.description'),
            //   genre: 'redTransparent',
            //   hidingTime: 3000
            // })
            reset()
            return
          } else {
            // toast({
            //   title: t('sonner.auth-confirmation.error.title'),
            //   description: t('sonner.auth-confirmation.error.description'),
            //   genre: 'redTransparent',
            //   hidingTime: 3000
            // })
          }
        }
      }
    },
    validators: {
      onBlurAsync: validationFunctions.touched(validationSignUp)
    }
  })

  useEffect(() => {
    form.validate('blur')
  }, [form, tSignUp])

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
          path: { email }
        })
      } catch {
        // toast({
        //   title: t('sonner.auth-sign-up.error.title'),
        //   description: t('sonner.auth-sign-up.error.description'),
        //   genre: 'redTransparent',
        //   hidingTime: 3000
        // })
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
    [mutateAsyncConfirmEmail]
  )

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
        {attempts === 0 ? (
          <>
            <Typography
              sx={{
                default: {
                  variant: 'h2',
                  weight: 700,
                  color: 'black100'
                }
              }}
            >
              {tSignUp('title')}
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
              {tSignUp('title-sign-in-1')}{' '}
              <TypographyLink
                to={PageRoutePublicSignIn.fullPath}
                sx={{
                  default: {
                    variant: 'h8',
                    weight: 400,
                    color: 'blueRest'
                  }
                }}
              >
                {tSignUp('title-sign-in-2')}
              </TypographyLink>
            </Typography>
          </>
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
                  <Typography
                    sx={{
                      default: {
                        variant: 'h2',
                        weight: 700,
                        color: 'black100'
                      }
                    }}
                  >
                    {tSignUp('title-confirmation')}
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
                    {tSignUp('title-confirmation-description')}{' '}
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
                      {field.state.value}
                    </Typography>
                    .
                  </Typography>
                </Stack>
              )}
            </form.Field>
          </>
        )}
      </Stack>

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
                  width="360px"
                  length={5}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  genre="grayBorder"
                  size="large"
                  error={{
                    errorMessage: field.state.meta.errors?.join(','),
                    isError: !!field.state.meta.isTouched && !!field.state.meta.errors.length,
                    isErrorAbsolute: true
                  }}
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
                    placeholder={tForm('email.placeholder')}
                    type="email"
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
                    placeholder={tForm('username.placeholder')}
                    type="username"
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
                        months: Object.values(tDate('months', { returnObjects: true })) as MonthItem[],
                        weeks: Object.values(tDate('weeks', { returnObjects: true })) as WeekItem[]
                      }}
                      placeholder={tForm('dateOfBirth.placeholder')}
                      id={field.name}
                      name={field.name}
                      isOnClickClose
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={field.handleChange}
                      genre="grayBorder"
                      startDate={LastHundredYear18YearsAgoStartDate}
                      endDate={LastHundredYear18YearsAgoEndDate}
                      size="medium"
                      inputProps={{
                        variety: 'standard',
                        error: {
                          errorMessage: field.state.meta.errors?.join(','),
                          isError: !!field.state.meta.isTouched && !!field.state.meta.errors.length,
                          isErrorAbsolute: true
                        }
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
                    placeholder={tForm('password.placeholder-confirm')}
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
              )}
            </form.Field>
          </>
        )}

        <form.Field name="email">
          {field =>
            attempts !== 0 &&
            attempts < 3 &&
            !field.state.meta.errors.length && (
              <Stack
                sx={{
                  default: {
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }
                }}
              >
                {cooldownTime > 0 && (
                  <Typography
                    sx={{
                      default: {
                        variant: 'h7',
                        weight: 400,
                        color: 'black100'
                      }
                    }}
                  >
                    {tSignUp('title-repeat', { seconds: cooldownTime })}
                  </Typography>
                )}
                <Button
                  type="button"
                  genre="blackBorder"
                  isOnlyIcon={isPending}
                  icons={[
                    {
                      type: 'loading',
                      name: 'Line',
                      isHidden: !isPending
                    }
                  ]}
                  sx={{
                    default: {
                      marginLeft: 'auto'
                    }
                  }}
                  isDisabled={isCooldown}
                  isHidden={isCooldown}
                  size="medium"
                  onClick={() => {
                    handleResendCode(field.state.value)
                  }}
                >
                  {tSignUp('title-button-repeat')}
                </Button>
              </Stack>
            )
          }
        </form.Field>
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
                  name: 'Line',
                  isHidden: !state.isSubmitting
                }
              ]}
            >
              {attempts !== 0 ? tSignUp('title-button-continue') : tSignUp('title-button')}
            </Button>
          )}
        </form.Subscribe>
        {attempts !== 0 && (
          <Typography
            sx={{
              default: {
                variant: 'h7',
                weight: 400,
                color: 'black100'
              }
            }}
          >
            {tSignUp('title-spam')}
          </Typography>
        )}
      </Form>
    </>
  )
}
