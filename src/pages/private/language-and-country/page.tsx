import { Form } from '@local/components/component-form';
import { useLanguage } from '@local/contexts/context-language';
import { useValidation } from '@local/contexts/context-validation';

import { useCountryList } from '@jenesei-software/jenesei-id-web-api';
import {
  Button,
  ILanguageKeys,
  ISelectItem,
  Select,
  SelectLanguage,
  SelectProps,
  Separator,
  Typography,
} from '@jenesei-software/jenesei-kit-react';
import { Stack } from '@jenesei-software/jenesei-kit-react/component-stack';
import { useForm } from '@tanstack/react-form';
import { FC, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function PagePrivateLanguageAndCountry() {
  const { t: tPage } = useTranslation('translation', { keyPrefix: 'private.language-and-country' });
  const { t: tForm } = useTranslation('translation', { keyPrefix: 'form' });

  const { changeLng, lng } = useLanguage();

  const { validationLanguageAndCountryCode, validationFunctions } = useValidation();

  const form = useForm({
    defaultValues: {
      language: lng,
      countryCode: '',
    },

    onSubmit: ({ value }) => {
      console.log(value);
      try {
        changeLng(value.language);
      } catch {
        // do nothing
      }
    },
    canSubmitWhenInvalid: false,
    validators: {
      onChangeAsync: validationFunctions.change(validationLanguageAndCountryCode),
      onBlurAsync: validationFunctions.blur(validationLanguageAndCountryCode),
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    form.validate('blur');
  }, [form, tForm]);

  useEffect(() => {
    form.reset({
      language: lng,
      countryCode: '',
    });
  }, [lng, form]);

  return (
    <Stack
      sx={{
        default: {
          width: '100%',
          height: '100%',
          alignItems: 'stretch',
          flexDirection: 'column',
          flexGrow: 1,
          gap: '20px',
        },
      }}
    >
      <Stack
        sx={{
          default: {
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '6px',
          },
        }}
      >
        <Typography
          sx={{
            default: {
              variant: 'h6',
              weight: 700,
              color: 'black80',
              line: 1,
            },
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
              line: 2,
            },
          }}
        >
          {tPage('menu.description')}
        </Typography>
      </Stack>
      <Separator color='black05' thickness='2px' type='horizontal' radius='4px' />
      <Form
        sx={{
          default: {
            width: '100%',
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            gap: '12px',
          },
        }}
        handleSubmit={form.handleSubmit}
      >
        <form.Field name='language'>
          {(field) => (
            <Stack
              sx={{
                default: {
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '8px',
                  width: '100%',
                },
              }}
            >
              <Typography
                sx={{
                  default: {
                    variant: 'h7',
                    weight: 700,
                    color: 'black80',
                    line: 1,
                  },
                }}
              >
                {tPage('form.language.title')}
              </Typography>
              <SelectLanguage
                id={field.name}
                labelPlaceholder={tForm('language.placeholder')}
                isShowDropdownOptionIcon
                isOnClickOptionClose
                isStayValueAfterSelect
                isOnlyColorInSelectListOption
                genre='blackBorder'
                size={'medium'}
                sx={{
                  default: {
                    width: '300px',
                  },
                  mobile: {
                    width: '100%',
                  },
                }}
                value={field.state.value}
                onChange={(lng) => field.handleChange(lng as ILanguageKeys)}
                onBlur={field.handleBlur}
              />
            </Stack>
          )}
        </form.Field>
        <form.Field name='countryCode'>
          {(field) => (
            <Stack
              sx={{
                default: {
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  gap: '8px',
                  width: '100%',
                },
              }}
            >
              <Typography
                sx={{
                  default: {
                    variant: 'h7',
                    weight: 700,
                    color: 'black80',
                    line: 1,
                  },
                }}
              >
                {tPage('form.country.title')}
              </Typography>
              <SelectCountry
                onChange={(code) => field.handleChange(code)}
                onBlur={field.handleBlur}
                code={field.state.value}
              />
            </Stack>
          )}
        </form.Field>

        <form.Subscribe>
          {(state) => (
            <Button
              type='submit'
              isHidden={!state.canSubmit || !state.isDirty}
              isDisabled={!state.canSubmit || state.isSubmitting || !state.isDirty}
              genre='black'
              size='mediumSmall'
              isOnlyIcon={state.isSubmitting}
              sx={{
                default: {
                  width: 'fit-content',
                  minWidth: '160px',
                },
                mobile: {
                  width: '100%',
                },
              }}
              icons={[
                {
                  type: 'loading',
                  name: 'Line',
                  isHidden: !state.isSubmitting,
                },
              ]}
            >
              {tPage('form.title-button')}
            </Button>
          )}
        </form.Subscribe>
      </Form>
    </Stack>
  );
}

type IOptionCountry = ISelectItem;
interface SelectCountryProps {
  code?: string;
  onChange: (code: string) => void;
  onBlur?: SelectProps<IOptionCountry>['onBlur'];
}
export const SelectCountry: FC<SelectCountryProps> = (props) => {
  const { t: tForm } = useTranslation('translation', { keyPrefix: 'form' });
  const { lng } = useLanguage();

  const { data } = useCountryList();
  const option: IOptionCountry[] = useMemo(() => {
    const result =
      (data ?? []).map((country) => ({
        label: country.translations?.[lng]?.official ?? country.name.official,
        value: country.cca3,
        placeholder: country.name.official,
      })) || [];
    return result;
  }, [data, lng]);
  const [viewOption, setViewOption] = useState<IOptionCountry[]>(option);
  const [, setQuery] = useState<string>('');

  useEffect(() => {
    setViewOption(option);
  }, [option]);
  const handleSelectChange = (option: IOptionCountry[]) => {
    props.onChange(option[0]?.value.toString());
    setQuery('');
  };
  // const handleQueryChange = useCallback(
  //   (value: string) => {
  //     setQuery(value);
  //     props.onChange('');
  //     if (value === '') {
  //       setViewOption(option);
  //     } else {
  //       const filteredOptions = option.filter((option) =>
  //         Object.values(option).some((field) => field?.toString().toLowerCase().includes(value.toLowerCase())),
  //       );
  //       setViewOption(filteredOptions);
  //     }
  //   },
  //   [option, props],
  // );

  const [value, setValue] = useState<IOptionCountry | undefined>(option.find((e) => e.value === props.code));

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (value?.value !== props.code) setValue(option.find((e) => e.value === props.code));
  }, [option, props.code]);

  return (
    <Select<IOptionCountry>
      labelPlaceholder={tForm('country.placeholder')}
      labelEmptyOption={tForm('country.empty-options')}
      genre='blackBorder'
      isShowDropdownOptionIcon
      size='medium'
      option={viewOption}
      sx={{
        default: {
          width: '300px',
        },
        mobile: {
          width: '100%',
        },
      }}
      minViewDropdown={1}
      maxViewDropdown={8}
      isOnClickOptionClose
      value={value ? [value] : []}
      onChange={handleSelectChange}
      onBlur={props.onBlur}
    />
  );
};
