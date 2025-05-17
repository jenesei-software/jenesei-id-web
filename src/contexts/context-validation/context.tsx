/* eslint-disable @typescript-eslint/no-explicit-any */
import { DeepKeys, FormApi } from '@tanstack/react-form'
import moment from 'moment'
import { FC, createContext, useContext, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import * as yup from 'yup'

import { ProviderValidationProps, ValidationContextProps } from '.'

const ValidationContext = createContext<ValidationContextProps | null>(null)

export const useValidation = () => {
  const context = useContext(ValidationContext)
  if (!context) {
    throw new Error('useValidation must be used within an ProviderValidation')
  }
  return context
}

export const ProviderValidation: FC<ProviderValidationProps> = props => {
  const { t } = useTranslation('translation')

  const validationFunctions = useMemo(
    () => ({
      touched:
        <TValues extends Record<string, any>>(validation: yup.ObjectSchema<any>) =>
        async ({
          value,
          formApi
        }: {
          value: TValues
          formApi: FormApi<TValues, any, any, any, any, any, any, any, any, any>
          signal: AbortSignal
        }): Promise<null | { fields: Record<string, string> }> => {
          const touchedFields = Object.keys(formApi.fieldInfo).reduce((acc, fieldName) => {
            const key = fieldName as DeepKeys<TValues>
            const fieldMeta = formApi.fieldInfo?.[key]?.instance?.getMeta() // Приведение типа

            if (fieldMeta?.isTouched) {
              acc[key] = value[key] // Здесь мы уверены, что key соответствует полям value
            }

            return acc
          }, {} as Partial<TValues>)

          try {
            await validation.validate(touchedFields, { abortEarly: false })
            return null
          } catch (validationErrors) {
            if (validationErrors instanceof yup.ValidationError) {
              const errors = validationErrors.inner.reduce(
                (acc, error) => {
                  if (
                    error.path &&
                    Object.prototype.hasOwnProperty.call(touchedFields, error.path) &&
                    !acc[error.path]
                  ) {
                    acc[error.path] = error.message
                  }
                  return acc
                },
                {} as Record<string, string>
              )
              return { fields: errors }
            }
            return null
          }
        }
    }),
    []
  )

  const validation = useMemo(
    () =>
      yup.object({
        dateOfBirth: yup
          .mixed()
          .test('is-required', t('form.dateOfBirth.errors.required'), value => {
            return value !== undefined && value !== null && value !== 0
          })
          .test('valid-date', t('form.dateOfBirth.errors.invalid'), value => {
            if (value === 0) {
              return false
            }
            return moment(value).isValid()
          })
          .test('min-age', t('form.dateOfBirth.errors.minAge', { minAge: 18 }), value => {
            if (value === undefined || value === null) return true
            return moment(value).valueOf() <= moment().subtract(18, 'years').valueOf()
          })
          .test('max-age', t('form.dateOfBirth.errors.maxAge', { maxAge: 118 }), value => {
            if (value === undefined || value === null) return true
            return moment(value).valueOf() >= moment().subtract(118, 'years').valueOf()
          })
          .test('is-not-future', t('form.dateOfBirth.errors.future'), value => {
            if (value === undefined || value === null) return true
            return moment(value).valueOf() <= moment().valueOf()
          }),
        username: yup
          .string()
          .trim()
          .required(t('form.username.errors.required'))
          .min(2, t('form.username.errors.minLength', { minLength: 2 }))
          .max(128, t('form.username.errors.maxLength', { maxLength: 128 }))
          .test('no-spaces', t('form.username.errors.no-spaces'), value => !value?.includes(' ')),
        code: yup.string().trim().required(t('form.code.errors.required')).length(5, t('form.code.errors.length')),
        email: yup
          .string()
          .trim()
          .required(t('form.email.errors.required'))
          .email(t('form.email.errors.invalid'))
          .test('no-spaces', t('form.email.errors.no-spaces'), value => !value?.includes(' ')),
        password: yup
          .string()
          .trim()
          .required(t('form.password.errors.required'))
          .min(8, t('form.password.errors.minLength', { minLength: 8 }))
          .max(128, t('form.password.errors.maxLength', { maxLength: 128 }))
          .test('no-spaces', t('form.password.errors.no-spaces'), value => !value?.includes(' '))
          // .test('has-uppercase', t('form.password.errors.uppercase'), password => /[A-Z]/.test(password || ''))
          // .test('has-lowercase', t('form.password.errors.lowercase'), password => /[a-z]/.test(password || ''))
          .test('has-number', t('form.password.errors.digit'), password => /[0-9]/.test(password || '')),
        // .test('has-special-char', t('form.password.errors.special'), password =>
        //   /[!()@#$%^&*_-]/.test(password || '')
        // ),
        currentPassword: yup
          .string()
          .trim()
          .required(t('form.password.errors.required'))
          .min(8, t('form.password.errors.minLength', { minLength: 8 }))
          .max(128, t('form.password.errors.maxLength', { maxLength: 128 }))
          .test('no-spaces', t('form.password.errors.no-spaces'), value => !value?.includes(' '))
          .test('has-uppercase', t('form.password.errors.uppercase'), password => /[A-Z]/.test(password || ''))
          .test('has-lowercase', t('form.password.errors.lowercase'), password => /[a-z]/.test(password || ''))
          .test('has-number', t('form.password.errors.digit'), password => /[0-9]/.test(password || ''))
          .test('has-special-char', t('form.password.errors.special'), password =>
            /[!()@#$%^&*_-]/.test(password || '')
          ),
        confirmPassword: yup
          .string()
          .trim()
          .required(t('form.password.errors.required'))
          .oneOf([yup.ref('currentPassword'), ''], t('form.password.errors.mismatch'))
      }),
    [t]
  )
  const validationUnitManagement = useMemo(
    () =>
      yup.object({
        description: yup
          .string()
          .trim()
          .required(t('form.unit-management.description.errors.required'))
          .min(2, t('form.unit-management.description.errors.minLength', { minLength: 2 }))
          .max(128, t('form.unit-management.description.errors.maxLength', { maxLength: 128 })),

        type: yup.string().trim().required(t('form.unit-management.type.errors.required')),

        stage: yup.string().trim().required(t('form.unit-management.stage.errors.required')),

        district: yup.string().trim().required(t('form.unit-management.district.errors.required')),

        developerId: yup
          .number()
          .required(t('form.unit-management.developerId.errors.required'))
          .test('not-zero', t('form.unit-management.developerId.errors.required'), value => value !== 0),

        coords: yup
          .object({
            latitude: yup
              .number()
              .required(t('form.unit-management.coords.errors.required'))
              .test('not-zero', t('form.unit-management.coords.errors.required'), value => value !== 0),
            longitude: yup
              .number()
              .required(t('form.unit-management.coords.errors.required'))
              .test('not-zero', t('form.unit-management.coords.errors.required'), value => value !== 0)
          })
          .test(
            'not-zero',
            t('form.unit-management.coords.errors.required'),
            value => value.latitude !== 0 && value.longitude !== 0
          ),

        pricePerSqm: yup
          .number()
          .required(t('form.unit-management.pricePerSqm.errors.required'))
          .test('not-zero', t('form.unit-management.pricePerSqm.errors.required'), value => value !== 0),

        totalPrice: yup
          .number()
          .required(t('form.unit-management.totalPrice.errors.required'))
          .test('not-zero', t('form.unit-management.totalPrice.errors.required'), value => value !== 0),
        images: yup
          .array()
          .required(t('form.unit-management.images.errors.required'))
          .min(1, t('form.unit-management.images.errors.minLength', { minLength: 1 }))
          .max(10, t('form.unit-management.images.errors.maxLength', { maxLength: 10 }))
      }),
    [t]
  )

  return (
    <ValidationContext.Provider value={{ validation, validationFunctions, validationUnitManagement }}>
      {props.children}
    </ValidationContext.Provider>
  )
}
