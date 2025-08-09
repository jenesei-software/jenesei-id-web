/* eslint-disable @typescript-eslint/no-explicit-any */
import { useUserCheckEmail, useUserCheckNickname } from '@jenesei-software/jenesei-id-web-api';
import { FormAsyncValidateOrFn } from '@tanstack/react-form';
import moment from 'moment';
import { createContext, FC, useCallback, useContext, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';

import { ProviderValidationProps, ValidationContextProps } from '.';

const ValidationContext = createContext<ValidationContextProps | null>(null);

export const useValidation = () => {
  const context = useContext(ValidationContext);
  if (!context) {
    throw new Error('useValidation must be used within an ProviderValidation');
  }
  return context;
};

export const ProviderValidation: FC<ProviderValidationProps> = (props) => {
  const { t: tForm } = useTranslation('translation', { keyPrefix: 'form' });
  const getUserCheckNickname = useUserCheckNickname();
  const getUserCheckEmail = useUserCheckEmail();

  const validationFunctions: {
    blur: (validation: yup.ObjectSchema<any>) => FormAsyncValidateOrFn<any>;
    change: (validation: yup.ObjectSchema<any>) => FormAsyncValidateOrFn<any>;
  } = useMemo(
    () => ({
      blur: (validation) => async (props) => {
        const changeFields = Object.keys(props.formApi.fieldInfo).reduce(
          (acc, fieldName) => {
            const key = fieldName;
            const fieldMeta = props.formApi.fieldInfo?.[key]?.instance?.getMeta();
            if (fieldMeta?.isTouched) {
              acc[key] = props.value[key];
            }

            return acc;
          },
          {} as Record<string, string>,
        );

        try {
          await validation.validate(changeFields, { abortEarly: false });
          return null;
        } catch (validationErrors) {
          if (validationErrors instanceof yup.ValidationError) {
            const errors = validationErrors.inner.reduce(
              (acc, error) => {
                if (error.path && Object.prototype.hasOwnProperty.call(changeFields, error.path) && !acc[error.path]) {
                  acc[error.path] = error.message;
                }
                return acc;
              },
              {} as Record<string, string>,
            );
            return { fields: errors };
          }
          return null;
        }
      },
      change: (validation) => async (props) => {
        const changeFields = Object.keys(props.formApi.fieldInfo).reduce(
          (acc, fieldName) => {
            const key = fieldName;
            const fieldMeta = props.formApi.fieldInfo?.[key]?.instance?.getMeta();
            if (fieldMeta?.isTouched && fieldMeta?.isDirty) {
              acc[key] = props.value[key];
            }

            return acc;
          },
          {} as Record<string, string>,
        );

        try {
          await validation.validate(changeFields, { abortEarly: false });
          return null;
        } catch (validationErrors) {
          if (validationErrors instanceof yup.ValidationError) {
            const errors = validationErrors.inner.reduce(
              (acc, error) => {
                if (error.path && Object.prototype.hasOwnProperty.call(changeFields, error.path) && !acc[error.path]) {
                  acc[error.path] = error.message;
                }
                return acc;
              },
              {} as Record<string, string>,
            );
            return { fields: errors };
          }
          return null;
        }
      },
    }),
    [],
  );
  const getError: ValidationContextProps['getError'] = useCallback((props) => {
    const errorMessage = props.isBlurred && props.isDirty ? props.errorMap.onChange : props.errorMap.onBlur || '';
    return {
      errorMessage: errorMessage,
      isError: !!errorMessage,
      isErrorAbsolute: true,
    };
  }, []);
  const validationSignIn = useMemo(
    () =>
      yup.object({
        username: yup
          .string()
          .trim()
          .required(tForm('username.errors.required'))
          .min(2, tForm('username.errors.minLength', { minLength: 2 }))
          .max(12, tForm('username.errors.maxLength', { maxLength: 12 }))
          .test('no-spaces', tForm('username.errors.no-spaces'), (value) => !value?.includes(' ')),
        password: yup
          .string()
          .trim()
          .required(tForm('password.errors.required'))
          .min(8, tForm('password.errors.minLength', { minLength: 8 }))
          .max(128, tForm('password.errors.maxLength', { maxLength: 128 }))
          .test('no-spaces', tForm('password.errors.no-spaces'), (value) => !value?.includes(' '))
          .test('has-uppercase', tForm('password.errors.uppercase'), (password) => /[A-Z]/.test(password || ''))
          .test('has-lowercase', tForm('password.errors.lowercase'), (password) => /[a-z]/.test(password || ''))
          .test('has-number', tForm('password.errors.digit'), (password) => /[0-9]/.test(password || ''))
          .test('has-special-char', tForm('password.errors.special'), (password) =>
            /[!()@#$%^&*_.-]/.test(password || ''),
          ),
      }),
    [tForm],
  );
  const validationLanguageAndCountryCode = useMemo(
    () =>
      yup.object({
        language: yup.string().trim(),
        password: yup.string().trim(),
      }),
    [],
  );
  const validationPasswordUpdate = useMemo(
    () =>
      yup.object({
        oldPassword: yup
          .string()
          .trim()
          .required(tForm('password.errors.required'))
          .min(8, tForm('password.errors.minLength', { minLength: 8 }))
          .max(128, tForm('password.errors.maxLength', { maxLength: 128 }))
          .test('no-spaces', tForm('password.errors.no-spaces'), (value) => !value?.includes(' ')),
        newPassword: yup
          .string()
          .trim()
          .required(tForm('password.errors.required'))
          .min(8, tForm('password.errors.minLength', { minLength: 8 }))
          .max(128, tForm('password.errors.maxLength', { maxLength: 128 }))
          .test('no-spaces', tForm('password.errors.no-spaces'), (value) => !value?.includes(' '))
          .test('has-uppercase', tForm('password.errors.uppercase'), (password) => /[A-Z]/.test(password || ''))
          .test('has-lowercase', tForm('password.errors.lowercase'), (password) => /[a-z]/.test(password || ''))
          .test('has-number', tForm('password.errors.digit'), (password) => /[0-9]/.test(password || ''))
          .test('has-special-char', tForm('password.errors.special'), (password) =>
            /[!()@#$%^&*_.-]/.test(password || ''),
          )
          .test('not-same-as-old', tForm('password.errors.sameAsOld'), function (value) {
            return value !== this.parent.oldPassword;
          }),
        confirmNewPassword: yup
          .string()
          .trim()
          .required(tForm('password.errors.required'))
          .oneOf([yup.ref('currentPassword'), ''], tForm('password.errors.mismatch')),
      }),
    [tForm],
  );
  const validationSignUp = useMemo(
    () =>
      yup.object({
        dateOfBirth: yup
          .mixed()
          .required(tForm('dateOfBirth.errors.required'))
          .test('is-required', tForm('dateOfBirth.errors.required'), (value) => {
            return value !== undefined && value !== null && value !== 0;
          })
          .test('valid-date', tForm('dateOfBirth.errors.invalid'), (value) => {
            if (value === 0) {
              return false;
            }
            return moment.utc(value).isValid();
          })
          .test('min-age', tForm('dateOfBirth.errors.minAge', { minAge: 18 }), (value) => {
            if (value === undefined || value === null) return true;
            return moment.utc(value).valueOf() <= moment.utc().subtract(18, 'years').valueOf();
          })
          .test('max-age', tForm('dateOfBirth.errors.maxAge', { maxAge: 118 }), (value) => {
            if (value === undefined || value === null) return true;
            return moment.utc(value).valueOf() >= moment.utc().subtract(118, 'years').valueOf();
          })
          .test('is-not-future', tForm('dateOfBirth.errors.future'), (value) => {
            if (value === undefined || value === null) return true;
            return moment.utc(value).valueOf() <= moment.utc().valueOf();
          }),
        code: yup.string().trim().required(tForm('code.errors.required')).length(5, tForm('code.errors.length')),
        email: yup
          .string()
          .trim()
          .required(tForm('email.errors.required'))
          .email(tForm('email.errors.invalid'))
          .test('no-spaces', tForm('email.errors.no-spaces'), (value) => !value?.includes(' '))
          .test('email-check', tForm('email.errors.alreadyExists'), async function (v) {
            const { createError } = this;

            if (!v || !v.includes('@') || v.includes(' ')) {
              return true;
            }

            try {
              const response = await getUserCheckEmail({ path: { email: v } });
              return !response.value;
            } catch {
              return createError({ message: tForm('email.errors.no-check') });
            }
          }),
        username: yup
          .string()
          .trim()
          .required(tForm('username.errors.required'))
          .min(2, tForm('username.errors.minLength', { minLength: 2 }))
          .max(12, tForm('username.errors.maxLength', { maxLength: 12 }))
          .test('no-spaces', tForm('username.errors.no-spaces'), (value) => !value?.includes(' '))
          .test('login-check', tForm('username.errors.alreadyExists'), async function (v) {
            const { createError } = this;

            if (!v || v.length < 2 || v.length > 12 || v.includes(' ')) {
              return true;
            }

            try {
              const response = await getUserCheckNickname({ path: { nickname: v } });
              return !response.value;
            } catch {
              return createError({ message: tForm('username.errors.no-check') });
            }
          }),
        currentPassword: yup
          .string()
          .trim()
          .required(tForm('password.errors.required'))
          .min(8, tForm('password.errors.minLength', { minLength: 8 }))
          .max(128, tForm('password.errors.maxLength', { maxLength: 128 }))
          .test('no-spaces', tForm('password.errors.no-spaces'), (value) => !value?.includes(' '))
          .test('has-uppercase', tForm('password.errors.uppercase'), (password) => /[A-Z]/.test(password || ''))
          .test('has-lowercase', tForm('password.errors.lowercase'), (password) => /[a-z]/.test(password || ''))
          .test('has-number', tForm('password.errors.digit'), (password) => /[0-9]/.test(password || ''))
          .test('has-special-char', tForm('password.errors.special'), (password) =>
            /[!()@#$%^&*_.-]/.test(password || ''),
          ),
        confirmPassword: yup
          .string()
          .trim()
          .required(tForm('password.errors.required'))
          .oneOf([yup.ref('currentPassword'), ''], tForm('password.errors.mismatch')),
      }),
    [getUserCheckEmail, getUserCheckNickname, tForm],
  );
  const validationUser = useMemo(
    () =>
      yup.object({
        dateOfBirth: yup
          .mixed()
          .required(tForm('dateOfBirth.errors.required'))
          .test('is-required', tForm('dateOfBirth.errors.required'), (value) => {
            return value !== null && value !== undefined && value !== 0 && value !== '';
          })
          .test('valid-date', tForm('dateOfBirth.errors.invalid'), (value) => {
            if (value === 0) {
              return false;
            }
            return moment.utc(value).isValid();
          })
          .test('min-age', tForm('dateOfBirth.errors.minAge', { minAge: 18 }), (value) => {
            if (value === undefined || value === null) return true;
            return moment.utc(value).valueOf() <= moment.utc().subtract(18, 'years').valueOf();
          })
          .test('max-age', tForm('dateOfBirth.errors.maxAge', { maxAge: 118 }), (value) => {
            if (value === undefined || value === null) return true;
            return moment.utc(value).valueOf() >= moment.utc().subtract(118, 'years').valueOf();
          })
          .test('is-not-future', tForm('dateOfBirth.errors.future'), (value) => {
            if (value === undefined || value === null) return true;
            return moment.utc(value).valueOf() <= moment.utc().valueOf();
          }),
        firstName: yup
          .string()
          .trim()
          .required(tForm('firstName.errors.required'))
          .min(2, tForm('firstName.errors.minLength', { minLength: 2 }))
          .max(12, tForm('firstName.errors.maxLength', { maxLength: 12 }))
          .test('no-spaces', tForm('firstName.errors.no-spaces'), (value) => !value?.includes(' ')),
        lastName: yup
          .string()
          .trim()
          .required(tForm('lastName.errors.required'))
          .min(2, tForm('lastName.errors.minLength', { minLength: 2 }))
          .max(12, tForm('lastName.errors.maxLength', { maxLength: 12 }))
          .test('no-spaces', tForm('lastName.errors.no-spaces'), (value) => !value?.includes(' ')),
      }),
    [tForm],
  );
  return (
    <ValidationContext.Provider
      value={{
        validationUser,
        validationFunctions,
        validationSignIn,
        validationSignUp,
        validationPasswordUpdate,
        validationLanguageAndCountryCode,
        getError,
      }}
    >
      {props.children}
    </ValidationContext.Provider>
  );
};
