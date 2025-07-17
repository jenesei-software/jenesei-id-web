import { Form } from '@local/components/component-form'
import { useValidation } from '@local/contexts/context-validation'

import { UserDto, useAuthProfile } from '@jenesei-software/jenesei-id-web-api'
import {
  DatePicker,
  Icon,
  Image,
  ImageButton,
  ImageSelectItemProps,
  Input,
  MonthItem,
  Preview,
  Separator,
  Typography,
  WeekItem
} from '@jenesei-software/jenesei-kit-react'
import { Button } from '@jenesei-software/jenesei-kit-react/component-button'
import { Stack } from '@jenesei-software/jenesei-kit-react/component-stack'
import { useForm } from '@tanstack/react-form'
import moment from 'moment'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

export function PagePrivatePersonalInfo() {
  const { t: tPage } = useTranslation('translation', { keyPrefix: 'private.personal-info' })
  const { t: tForm } = useTranslation('translation', { keyPrefix: 'form' })
  const { t: tDate } = useTranslation('translation', { keyPrefix: 'date' })

  const { validationUser, validationFunctions } = useValidation()
  const { isLoading, data } = useAuthProfile()

  const defaultValues: Pick<UserDto, 'nickname' | 'firstName' | 'lastName'> & {
    dateOfBirth: number
    email: string
    image: ImageSelectItemProps | null
  } = useMemo(() => {
    return {
      email: '',
      nickname: data?.nickname || '',
      dateOfBirth: 0,
      firstName: data?.firstName || '',
      lastName: data?.lastName || '',
      image: null
    }
  }, [data?.firstName, data?.lastName, data?.nickname])
  const form = useForm({
    defaultValues: defaultValues,

    onSubmit: async ({ value }) => {
      console.log('Form submitted with values:', value)
    },
    validators: {
      onChangeAsyncDebounceMs: 500,
      onChangeAsync: validationFunctions.touched(validationUser)
    }
  })

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    form.validate('blur')
  }, [form, tPage])
  useEffect(() => {
    form.reset(defaultValues)
  }, [defaultValues, form])
  return (
    <Stack
      sx={{
        default: {
          width: '100%',
          height: '100%',
          alignItems: 'stretch',
          flexDirection: 'column',
          flexGrow: 1,
          position: 'relative',
          gap: '26px'
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
      <Separator color='black05' thickness='2px' type='horizontal' radius='4px' />

      <Form
        width="100%"
        handleSubmit={form.handleSubmit}
        style={{
          gap: '25px',
          position: 'relative'
        }}
      >
        <Preview visible={!isLoading}>
          <form.Field name="image">
            {field => (
              <Stack
                sx={{
                  default: {
                    flexDirection: 'column',
                    gap: '6px',
                    position: 'relative',
                    width: '100%'
                  }
                }}
              >
                <Image
                  sxStack={theme => ({
                    default: {
                      width: '140px',
                      height: '140px',
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: theme.palette.black05,
                      pointerEvents: 'none',
                      borderRadius: '140px'
                    }
                  })}
                  src={field.state.value?.url || 'fake'}
                  alt={tForm('image.alt')}
                  componentFallback={<Icon type="logo" name="Jenesei" size="100%" primaryColor="black10" />}
                />
                <Stack
                  sx={{
                    default: {
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      gap: '12px'
                    },
                    mobile: {
                      flexDirection: 'column'
                    }
                  }}
                >
                  <Stack
                    sx={{
                      default: {
                        flexDirection: 'column',
                        gap: '4px'
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
                      {tForm('image.placeholder')}
                    </Typography>
                    <Typography
                      sx={{
                        default: {
                          variant: 'h7',
                          weight: 500,
                          color: 'black50',
                          line: 1
                        }
                      }}
                    >
                      {tForm('image.description')}
                    </Typography>
                  </Stack>
                  <ImageButton
                    onSave={image => {
                      if (image && image[0]) field.handleChange(image[0])
                    }}
                    imageSettings={{
                      aspect: 2 / 2,
                      maxCount: 1,
                      maxSize: 5 * 1024 * 1024 // 5 MB
                    }}
                    locale={{
                      buttonAdd: tForm('image.dialog.buttonAdd'),
                      dialogSave: tForm('image.dialog.dialogSave'),
                      dialogCancel: tForm('image.dialog.dialogCancel'),
                      dialogAddImage: tForm('image.dialog.dialogAddImage'),
                      dialogDeleteImage: tForm('image.dialog.dialogDeleteImage')
                    }}
                    dialog={{
                      button: {
                        genre: 'blackBorder',
                        size: 'medium'
                      },
                      buttonDelete: {
                        genre: 'blackBorder',
                        size: 'medium'
                      }
                    }}
                    button={{
                      genre: 'black',
                      size: 'large',
                      isRadius: true,
                      isPlaystationEffect: true
                    }}
                  />
                </Stack>
              </Stack>
            )}
          </form.Field>
          <Separator color='black05' thickness='2px' type='horizontal' radius='4px' />
          <Stack
            sx={{
              default: {
                flexDirection: 'row',
                gap: '22px',
                position: 'relative'
              },
              mobile: {
                flexDirection: 'column'
              }
            }}
          >
            <form.Field name="firstName">
              {field => (
                <Stack
                  sx={{
                    default: {
                      flexDirection: 'column',
                      gap: '6px',
                      position: 'relative',
                      width: '300px'
                    },
                    mobile: {
                      width: '100%'
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
                    {tForm('firstName.placeholder')}
                  </Typography>
                  <Input
                    variety="standard"
                    autoComplete="firstName"
                    placeholder={tForm('firstName.placeholder-input')}
                    type="firstName"
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
            <form.Field name="lastName">
              {field => (
                <Stack
                  sx={{
                    default: {
                      flexDirection: 'column',
                      gap: '6px',
                      position: 'relative',
                      width: '300px'
                    },
                    mobile: {
                      width: '100%'
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
                    {tForm('lastName.placeholder')}
                  </Typography>
                  <Input
                    variety="standard"
                    autoComplete="lastName"
                    placeholder={tForm('lastName.placeholder-input')}
                    type="firstName"
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
          </Stack>
          <Separator color='black05' thickness='2px' type='horizontal' radius='4px' />
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
                      position: 'relative',
                      width: '300px'
                    },
                    mobile: {
                      width: '100%'
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
                    {tForm('dateOfBirth.placeholder')}
                  </Typography>
                  <DatePicker
                    locale={{
                      months: Object.values(tDate('months', { returnObjects: true })) as MonthItem[],
                      weeks: Object.values(tDate('weeks', { returnObjects: true })) as WeekItem[]
                    }}
                    placeholder={tForm('dateOfBirth.placeholder-input')}
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
          <Separator color='black05' thickness='2px' type='horizontal' radius='4px' />
          <form.Field name="nickname">
            {field => (
              <Stack
                sx={{
                  default: {
                    flexDirection: 'column',
                    gap: '6px',
                    position: 'relative',
                    width: '300px'
                  },
                  mobile: {
                    width: '100%'
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
                  {tForm('username.placeholder')}
                </Typography>
                <Input
                  variety="standard"
                  autoComplete="username"
                  placeholder={tForm('username.placeholder-input')}
                  type="username"
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  genre="grayBorder"
                  size="medium"
                  isDisabled
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
          <Separator color='black05' thickness='2px' type='horizontal' radius='4px' />
          <form.Field name="email">
            {field => (
              <Stack
                sx={{
                  default: {
                    flexDirection: 'column',
                    gap: '6px',
                    position: 'relative',
                    width: '300px'
                  },
                  mobile: {
                    width: '100%'
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
                  {tForm('email.placeholder')}
                </Typography>
                <Input
                  variety="standard"
                  autoComplete="email"
                  placeholder={tForm('email.placeholder-input')}
                  type="email"
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                  genre="grayBorder"
                  size="medium"
                  isNoSpaces
                  isDisabled
                  error={{
                    errorMessage: field.state.meta.errors?.join(','),
                    isError: !!field.state.meta.isTouched && !!field.state.meta.errors.length,
                    isErrorAbsolute: true
                  }}
                />
              </Stack>
            )}
          </form.Field>
          <Separator color='black05' thickness='2px' type='horizontal' radius='4px' />
          <form.Subscribe>
            {state => (
              <Stack
                sx={{
                  default: {
                    flexDirection: 'row',
                    gap: '20px'
                  },
                  mobile: {
                    flexDirection: 'column',
                    gap: '12px'
                  }
                }}
              >
                <Button
                  type="submit"
                  isHidden={!state.canSubmit}
                  isDisabled={!state.canSubmit || state.isSubmitting}
                  genre="gray"
                  size="large"
                  isOnlyIcon={state.isSubmitting}
                  icons={[
                    {
                      type: 'loading',
                      name: 'Line',
                      isHidden: !state.isSubmitting
                    }
                  ]}
                  sx={{
                    default: {
                      width: 'fit-content'
                    },
                    mobile: {
                      width: '100%'
                    }
                  }}
                >
                  {tPage('form.title-button-save')}
                </Button>
                <Button
                  type="reset"
                  isHidden={state.isSubmitting || !state.isDirty}
                  isDisabled={state.isSubmitting || !state.isDirty}
                  genre="black"
                  size="large"
                  onClick={() => form.reset(defaultValues)}
                  sx={{
                    default: {
                      width: 'fit-content'
                    },
                    mobile: {
                      width: '100%'
                    }
                  }}
                >
                  {tPage('form.title-button-cancel')}
                </Button>
              </Stack>
            )}
          </form.Subscribe>
        </Preview>
      </Form>
    </Stack>
  )
}
