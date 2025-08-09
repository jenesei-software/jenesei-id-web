import { Form } from '@local/components/component-form';
import { useValidation } from '@local/contexts/context-validation';
import { PageRoutePublicSignIn } from '@local/core/router';

import { useAuthPreSignUp, useAuthSignUp, useAuthVerify } from '@jenesei-software/jenesei-id-web-api';
import { Button } from '@jenesei-software/jenesei-kit-react/component-button';
import { DatePicker, MonthItem, WeekItem } from '@jenesei-software/jenesei-kit-react/component-date-picker';
import { Input } from '@jenesei-software/jenesei-kit-react/component-input';
import { InputOTP } from '@jenesei-software/jenesei-kit-react/component-input-otp';
import { Stack } from '@jenesei-software/jenesei-kit-react/component-stack';
import { Typography, TypographyLink } from '@jenesei-software/jenesei-kit-react/component-typography';
import { useForm } from '@tanstack/react-form';
import moment from 'moment';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function PagePublicSignUp() {
  const { validationSignUp, validationFunctions } = useValidation();
  const { t: tForm } = useTranslation('translation', { keyPrefix: 'form' });
  const { t: tSignUp } = useTranslation('translation', { keyPrefix: 'public.sign-up' });
  const { t: tDate } = useTranslation('translation', { keyPrefix: 'date' });

  const [attempts, setAttempts] = useState(0);
  const [isCooldown, setIsCooldown] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);

  const { mutateAsync: mutateAsyncConfirmation, reset: resetConfirmation } = useAuthVerify();
  const { mutateAsync: mutateAsyncConfirmEmail, isPending, reset: resetConfirmEmail } = useAuthPreSignUp();
  const { mutateAsync: mutateAsyncSignUp, reset: resetSignUp } = useAuthSignUp();

  const defaultValues: {
    email: string;
    currentPassword: string;
    confirmPassword: string;
    username: string;
    dateOfBirth: number | null;
    code: string;
  } = {
    email: '',
    currentPassword: '',
    confirmPassword: '',
    username: '',
    dateOfBirth: null,
    code: '',
  };
  const form = useForm({
    defaultValues: defaultValues,
    onSubmit: async ({ value }) => {
      if (attempts === 0) {
        try {
          await mutateAsyncConfirmEmail({
            path: {
              email: value.email,
            },
          });
        } catch {
          reset();
          // toast({
          //   title: t('sonner.auth-sign-up.error.title'),
          //   description: t('sonner.auth-sign-up.error.description'),
          //   genre: 'redTransparent',
          //   hidingTime: 3000
          // })
        } finally {
          setAttempts((prev) => prev + 1);
          setIsCooldown(true);
          setCooldownTime(60);

          const interval = setInterval(() => {
            setCooldownTime((prev) => {
              if (prev <= 1) {
                clearInterval(interval);
                setIsCooldown(false);
                return 0;
              }
              return prev - 1;
            });
          }, 1000);
        }
      } else {
        try {
          await mutateAsyncConfirmation({
            body: {
              code: value.code,
              email: value.email,
            },
          });
          try {
            await mutateAsyncSignUp({
              body: {
                password: value.currentPassword,
                email: value.email,
                nickname: value.username,
                dateOfBirth: moment(value.dateOfBirth).format('DD.MM.YYYY'),
              },
            });
          } catch {
            reset();
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
            reset();
            return;
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
      onBlurAsync: validationFunctions.touched(validationSignUp),
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    form.validate('blur');
  }, [form, tSignUp]);

  const reset = useCallback(() => {
    resetConfirmation();
    resetConfirmEmail();
    resetSignUp();
    form.reset();
    setAttempts(0);
    setIsCooldown(false);
    setCooldownTime(0);
  }, [form, resetConfirmEmail, resetConfirmation, resetSignUp]);

  const handleResendCode = useCallback(
    async (email: string) => {
      try {
        await mutateAsyncConfirmEmail({
          path: { email },
        });
      } catch {
        // toast({
        //   title: t('sonner.auth-sign-up.error.title'),
        //   description: t('sonner.auth-sign-up.error.description'),
        //   genre: 'redTransparent',
        //   hidingTime: 3000
        // })
      } finally {
        setAttempts((prev) => prev + 1);
        setIsCooldown(true);
        setCooldownTime(60);

        const interval = setInterval(() => {
          setCooldownTime((prev) => {
            if (prev <= 1) {
              clearInterval(interval);
              setIsCooldown(false);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }
    },
    [mutateAsyncConfirmEmail],
  );

  return (
    <>
      <Stack
        sx={{
          default: {
            flexDirection: 'column',
            gap: '10px',
            alignItems: 'stretch',
            userSelect: 'none',
          },
        }}
      >
        {attempts === 0 ? (
          <>
            <Typography
              sx={{
                default: {
                  variant: 'h2',
                  weight: 700,
                  color: 'black100',
                },
              }}
            >
              {tSignUp('title')}
            </Typography>
            <Typography
              sx={{
                default: {
                  variant: 'h8',
                  weight: 400,
                  color: 'black100',
                },
              }}
            >
              {tSignUp('title-sign-in-1')}{' '}
              <TypographyLink
                to={PageRoutePublicSignIn.fullPath}
                sx={{
                  default: {
                    variant: 'h8',
                    weight: 400,
                    color: 'blueRest',
                  },
                }}
              >
                {tSignUp('title-sign-in-2')}
              </TypographyLink>
            </Typography>
          </>
        ) : (
          <>
            <form.Field name='email'>
              {(field) => (
                <Stack
                  sx={{
                    default: {
                      flexDirection: 'column',
                      gap: '6px',
                      position: 'relative',
                    },
                  }}
                >
                  <Typography
                    sx={{
                      default: {
                        variant: 'h2',
                        weight: 700,
                        color: 'black100',
                      },
                    }}
                  >
                    {tSignUp('title-confirmation')}
                  </Typography>
                  <Typography
                    sx={{
                      default: {
                        variant: 'h8',
                        weight: 400,
                        color: 'black100',
                      },
                    }}
                  >
                    {tSignUp('title-confirmation-description')}{' '}
                    <Typography
                      sx={{
                        default: {
                          variant: 'h8',
                          weight: 400,
                          color: 'blueRest',
                          cursor: 'pointer',
                        },
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
        sx={{
          default: {
            width: '100%',
            gap: '25px',
          },
        }}
        handleSubmit={form.handleSubmit}
      >
        {attempts !== 0 ? (
          <form.Field name='code'>
            {(field) => (
              <Stack
                sx={{
                  default: {
                    flexDirection: 'column',
                    gap: '6px',
                    position: 'relative',
                    alignItems: 'center',
                  },
                }}
              >
                <InputOTP
                  id={field.name}
                  sx={{
                    default: {
                      width: '360px',
                    },
                  }}
                  length={5}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  genre='grayBorder'
                  size='large'
                  error={{
                    errorMessage: field.state.meta.errors?.join(','),
                    isError: !!field.state.meta.isTouched && !!field.state.meta.errors.length,
                    isErrorAbsolute: true,
                  }}
                />
              </Stack>
            )}
          </form.Field>
        ) : (
          <>
            <form.Field name='email'>
              {(field) => (
                <Stack
                  sx={{
                    default: {
                      flexDirection: 'column',
                      gap: '6px',
                      position: 'relative',
                    },
                  }}
                >
                  <Input
                    variety='standard'
                    autoComplete='email'
                    placeholder={tForm('email.placeholder')}
                    type='email'
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={field.handleChange}
                    genre='grayBorder'
                    size='medium'
                    isNoSpaces
                    error={{
                      errorMessage: field.state.meta.errors?.join(','),
                      isError: !!field.state.meta.isTouched && !!field.state.meta.errors.length,
                      isErrorAbsolute: true,
                    }}
                  />
                </Stack>
              )}
            </form.Field>
            <form.Field name='username'>
              {(field) => (
                <Stack
                  sx={{
                    default: {
                      flexDirection: 'column',
                      gap: '6px',
                      position: 'relative',
                    },
                  }}
                >
                  <Input
                    variety='standard'
                    autoComplete='username'
                    placeholder={tForm('username.placeholder')}
                    type='username'
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={field.handleChange}
                    genre='grayBorder'
                    size='medium'
                    isNoSpaces
                    error={{
                      errorMessage: field.state.meta.errors?.join(','),
                      isError: !!field.state.meta.isTouched && !!field.state.meta.errors.length,
                      isErrorAbsolute: true,
                    }}
                  />
                </Stack>
              )}
            </form.Field>
            <form.Field name='dateOfBirth'>
              {(field) => {
                const LastHundredYear18YearsAgoStartDate = moment.utc().subtract(118, 'years').valueOf();
                const LastHundredYear18YearsAgoEndDate = moment.utc().subtract(18, 'years').valueOf();
                return (
                  <Stack
                    sx={{
                      default: {
                        flexDirection: 'column',
                        gap: '6px',
                        position: 'relative',
                      },
                    }}
                  >
                    <DatePicker
                      locale={{
                        months: Object.values(tDate('months', { returnObjects: true })) as MonthItem[],
                        weeks: Object.values(tDate('weeks', { returnObjects: true })) as WeekItem[],
                        inputs: tDate('input', { returnObjects: true }),
                      }}
                      notValidDate={{
                        errorMessage: tDate('not-valid-date'),
                        isErrorAbsolute: true,
                      }}
                      labelPlaceholder={tForm('dateOfBirth.placeholder')}
                      id={field.name}
                      name={field.name}
                      isOnClickClose
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={field.handleChange}
                      genre='grayBorder'
                      dateMin={LastHundredYear18YearsAgoStartDate}
                      dateMax={LastHundredYear18YearsAgoEndDate}
                      dateDefault={LastHundredYear18YearsAgoEndDate}
                      size='medium'
                      error={{
                        errorMessage: field.state.meta.errors?.join(','),
                        isError: !!field.state.meta.isTouched && !!field.state.meta.errors.length,
                        isErrorAbsolute: true,
                      }}
                    />
                  </Stack>
                );
              }}
            </form.Field>
            <form.Field name='currentPassword'>
              {(field) => (
                <Stack
                  sx={{
                    default: {
                      flexDirection: 'column',
                      gap: '6px',
                      position: 'relative',
                    },
                  }}
                >
                  <Input
                    variety='standard'
                    autoComplete='current-password'
                    type='password'
                    placeholder={tForm('password.placeholder')}
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={field.handleChange}
                    genre='grayBorder'
                    size='medium'
                    isNoSpaces
                    error={{
                      errorMessage: field.state.meta.errors?.join(','),
                      isError: !!field.state.meta.isTouched && !!field.state.meta.errors.length,
                      isErrorAbsolute: true,
                    }}
                  />
                </Stack>
              )}
            </form.Field>
            <form.Field name='confirmPassword'>
              {(field) => (
                <Stack
                  sx={{
                    default: {
                      flexDirection: 'column',
                      gap: '6px',
                      position: 'relative',
                    },
                  }}
                >
                  <Input
                    variety='standard'
                    autoComplete='current-password'
                    type='password'
                    placeholder={tForm('password.placeholder-confirm')}
                    id={field.name}
                    name={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={field.handleChange}
                    genre='grayBorder'
                    size='medium'
                    isNoSpaces
                    error={{
                      errorMessage: field.state.meta.errors?.join(','),
                      isError: !!field.state.meta.isTouched && !!field.state.meta.errors.length,
                      isErrorAbsolute: true,
                    }}
                  />
                </Stack>
              )}
            </form.Field>
          </>
        )}

        <form.Field name='email'>
          {(field) =>
            attempts !== 0 &&
            attempts < 3 &&
            !field.state.meta.errors.length && (
              <Stack
                sx={{
                  default: {
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexDirection: 'row',
                  },
                }}
              >
                {cooldownTime > 0 && (
                  <Typography
                    sx={{
                      default: {
                        variant: 'h7',
                        weight: 400,
                        color: 'black100',
                      },
                    }}
                  >
                    {tSignUp('title-repeat', { seconds: cooldownTime })}
                  </Typography>
                )}
                <Button
                  type='button'
                  genre='blackBorder'
                  isOnlyIcon={isPending}
                  icons={[
                    {
                      type: 'loading',
                      name: 'Line',
                      isHidden: !isPending,
                    },
                  ]}
                  sx={{
                    default: {
                      marginLeft: 'auto',
                    },
                  }}
                  isDisabled={isCooldown}
                  isHidden={isCooldown}
                  size='medium'
                  onClick={() => {
                    handleResendCode(field.state.value);
                  }}
                >
                  {tSignUp('title-button-repeat')}
                </Button>
              </Stack>
            )
          }
        </form.Field>
        <form.Subscribe>
          {(state) => (
            <Button
              type='submit'
              isHidden={!state.canSubmit}
              isDisabled={!state.canSubmit || state.isSubmitting}
              genre='product'
              size='medium'
              isOnlyIcon={state.isSubmitting}
              icons={[
                {
                  type: 'loading',
                  name: 'Line',
                  isHidden: !state.isSubmitting,
                },
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
                color: 'black100',
              },
            }}
          >
            {tSignUp('title-spam')}
          </Typography>
        )}
      </Form>
    </>
  );
}
