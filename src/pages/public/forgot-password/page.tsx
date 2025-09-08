import { Form } from '@local/components/component-form';
import { useValidation } from '@local/contexts/context-validation';
import { PageRoutePublicSignIn } from '@local/core/router';

import { Button, Input, Typography, TypographyLink } from '@jenesei-software/jenesei-kit-react';
import { Stack } from '@jenesei-software/jenesei-kit-react/component-stack';
import { useForm } from '@tanstack/react-form';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export function PagePublicForgotPassword() {
  const { t: tForm } = useTranslation('translation', { keyPrefix: 'form' });
  const { t: tForgotPassword } = useTranslation('translation', { keyPrefix: 'public.forgot-password' });

  const { validationPasswordRecover, validationFunctions, getError } = useValidation();

  interface FormValues {
    email: string;
    currentPassword: string;
    confirmPassword: string;
  }
  const defaultValues: FormValues = {
    email: '',
    currentPassword: '',
    confirmPassword: '',
  };

  const form = useForm({
    defaultValues: defaultValues,

    onSubmit: async ({ value }) => {
      try {
        console.log(value);
      } catch {
        // do nothing
      }
    },
    canSubmitWhenInvalid: false,
    validators: {
      onChangeAsync: validationFunctions.change(validationPasswordRecover),
      onBlurAsync: validationFunctions.blur(validationPasswordRecover),
    },
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    form.validate('blur');
  }, [form, tForm]);

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
        <Typography
          sx={{
            default: {
              variant: 'h2',
              weight: 700,
              color: 'black100',
            },
          }}
        >
          {tForgotPassword('title')}
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
          {tForgotPassword('title-description')}
        </Typography>
      </Stack>

      <Form
        handleSubmit={form.handleSubmit}
        sx={{
          default: {
            width: '100%',
            gap: '25px',
          },
        }}
      >
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
                isOutlineBoxShadow
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
                error={getError(field.state.meta)}
              />
            </Stack>
          )}
        </form.Field>

        <Stack
          sx={{
            default: {
              flexDirection: 'row',
              justifyContent: 'flex-end',
              alignItems: 'center',
            },
          }}
        >
          <TypographyLink
            to={PageRoutePublicSignIn.fullPath}
            sx={{
              default: {
                variant: 'h6',
                weight: 400,
                color: 'blueRest',
                cursor: 'pointer',
              },
            }}
          >
            {tForgotPassword('title-back')}
          </TypographyLink>
        </Stack>
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
              {tForgotPassword('title-button')}
            </Button>
          )}
        </form.Subscribe>
      </Form>
    </>
  );
}
