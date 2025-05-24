import { useCountryList } from '@jenesei-software/jenesei-id-web-api'
import {
  Button,
  ILanguageKeys,
  ISelectItem,
  Select,
  SelectLanguage,
  SelectProps,
  Separator,
  Typography,
  useScreenWidth
} from '@jenesei-software/jenesei-ui-react'
import { Stack } from '@jenesei-software/jenesei-ui-react/component-stack'
import { useForm } from '@tanstack/react-form'
import { FC, useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Form } from '@local/components/component-form'
import { useLanguage } from '@local/contexts/context-language'
import { useValidation } from '@local/contexts/context-validation'

export function PagePrivateLanguageAndCountry() {
  const { t: tPage } = useTranslation('translation', { keyPrefix: 'private.language-and-country' })
  const { t: tForm } = useTranslation('translation', { keyPrefix: 'form' })
  const { screenActual } = useScreenWidth()

  const { changeLng, lng } = useLanguage()

  const { validationLanguageAndCountryCode, validationFunctions } = useValidation()

  const form = useForm({
    defaultValues: {
      language: lng,
      countryCode: ''
    },

    onSubmit: ({ value }) => {
      console.log(value)
      try {
        changeLng(value.language)
      } catch {
        // do nothing
      }
    },
    canSubmitWhenInvalid: false,
    validators: {
      onBlurAsync: validationFunctions.touched(validationLanguageAndCountryCode)
    }
  })

  useEffect(() => {
    form.validate('blur')
  }, [form, tForm])

  useEffect(() => {
    form.reset({
      language: lng,
      countryCode: ''
    })
  }, [lng, form])

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
      <Separator color="black05" height="2px" width="100%" radius="4px" />
      <Form
        width="100%"
        handleSubmit={form.handleSubmit}
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
          gap: '12px'
        }}
      >
        <form.Field name="language">
          {field => (
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
                {tPage('form.language.title')}
              </Typography>
              <SelectLanguage
                id={field.name}
                name={field.name}
                placeholder={tForm('language.placeholder')}
                isShowSelectInputIcon
                isShowDropdownOptionIcon
                genre="blackBorder"
                size={'medium'}
                width={screenActual === 'mobile' ? '100%' : '300px'}
                value={field.state.value}
                inputProps={{ isReadOnly: true, variety: 'standard' }}
                onChange={lng => field.handleChange(lng as ILanguageKeys)}
                onBlur={field.handleBlur}
              />
            </Stack>
          )}
        </form.Field>
        <form.Field name="countryCode">
          {field => (
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
                {tPage('form.country.title')}
              </Typography>
              <SelectCountry
                onChange={code => field.handleChange(code)}
                onBlur={field.handleBlur}
                code={field.state.value}
              />
            </Stack>
          )}
        </form.Field>

        <form.Subscribe>
          {state => (
            <Button
              type="submit"
              isHidden={!state.canSubmit || !state.isDirty}
              isDisabled={!state.canSubmit || state.isSubmitting || !state.isDirty}
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
              {tPage('form.title-button')}
            </Button>
          )}
        </form.Subscribe>
      </Form>
    </Stack>
  )
}

type IOptionCountry = ISelectItem
interface SelectCountryProps {
  code?: string
  onChange: (code: string) => void
  onBlur?: SelectProps<IOptionCountry>['onBlur']
}
export const SelectCountry: FC<SelectCountryProps> = props => {
  const { t: tForm } = useTranslation('translation', { keyPrefix: 'form' })
  const { screenActual } = useScreenWidth()
  const { lng } = useLanguage()

  const { data } = useCountryList()
  const option: IOptionCountry[] = useMemo(() => {
    const result =
      (data ?? []).map(country => ({
        label: country.translations?.[lng]?.official ?? country.name.official,
        value: country.cca3,
        placeholder: country.name.official
      })) || []
    return result
  }, [data, lng])
  const [viewOption, setViewOption] = useState<IOptionCountry[]>(option)
  const [query, setQuery] = useState<string>('')
  const [isEmptyOption, setIsEmptyOption] = useState<boolean>(false)

  useEffect(() => {
    setViewOption(option)
  }, [option])
  const handleSelectChange = (option: IOptionCountry[]) => {
    props.onChange(option[0]?.value.toString())
    setQuery('')
  }
  const handleQueryChange = useCallback(
    (value: string) => {
      setQuery(value)
      props.onChange('')
      if (value === '') {
        setIsEmptyOption(option.length === 0)
        setViewOption(option)
      } else {
        const filteredOptions = option.filter(option =>
          Object.values(option).some(field => field?.toString().toLowerCase().includes(value.toLowerCase()))
        )
        setViewOption(filteredOptions)
        setIsEmptyOption(filteredOptions.length === 0)
      }
    },
    [option, props]
  )

  const [value, setValue] = useState<IOptionCountry | undefined>(option.find(e => e.value === props.code))
  useEffect(() => {
    if (value?.value !== props.code) setValue(option.find(e => e.value === props.code))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [option, props.code])

  return (
    <Select<IOptionCountry>
      placeholder={tForm('country.placeholder')}
      labelEmptyOption={tForm('country.empty-options')}
      genre="blackBorder"
      isShowSelectInputIcon
      isShowDropdownOptionIcon
      size="medium"
      option={viewOption}
      width={screenActual === 'mobile' ? '100%' : '300px'}
      isEmptyOption={isEmptyOption}
      minView={1}
      maxView={8}
      isOnClickOptionClose
      value={value ? [value] : []}
      onChange={handleSelectChange}
      onBlur={props.onBlur}
      inputProps={{
        variety: 'standard',
        value: (value?.placeholder as string) ?? query,
        onChange: handleQueryChange
      }}
    />
  )
}
