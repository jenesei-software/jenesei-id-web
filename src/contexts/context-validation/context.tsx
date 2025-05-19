/* eslint-disable @typescript-eslint/no-explicit-any */
import { useUserCheckEmail, useUserCheckNickname } from '@jenesei-software/jenesei-id-web-api'
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
  const { t: tForm } = useTranslation('translation', { keyPrefix: 'form' })
  const getUserCheckNickname = useUserCheckNickname()
  const getUserCheckEmail = useUserCheckEmail()

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
            const fieldMeta = formApi.fieldInfo?.[key]?.instance?.getMeta()

            if (fieldMeta?.isTouched) {
              acc[key] = value[key]
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

  const validationSignIn = useMemo(
    () =>
      yup.object({
        username: yup
          .string()
          .trim()
          .required(tForm('username.errors.required'))
          .min(2, tForm('username.errors.minLength', { minLength: 2 }))
          .max(12, tForm('username.errors.maxLength', { maxLength: 12 }))
          .test('no-spaces', tForm('username.errors.no-spaces'), value => !value?.includes(' ')),
        password: yup
          .string()
          .trim()
          .required(tForm('password.errors.required'))
          .min(8, tForm('password.errors.minLength', { minLength: 8 }))
          .max(128, tForm('password.errors.maxLength', { maxLength: 128 }))
          .test('no-spaces', tForm('password.errors.no-spaces'), value => !value?.includes(' '))
          .test('has-uppercase', tForm('password.errors.uppercase'), password => /[A-Z]/.test(password || ''))
          .test('has-lowercase', tForm('password.errors.lowercase'), password => /[a-z]/.test(password || ''))
          .test('has-number', tForm('password.errors.digit'), password => /[0-9]/.test(password || ''))
          .test('has-special-char', tForm('password.errors.special'), password =>
            /[!()@#$%^&*_.-]/.test(password || '')
          )
      }),
    [tForm]
  )
  const validationSignUp = useMemo(
    () =>
      yup.object({
        dateOfBirth: yup
          .mixed()
          .test('is-required', tForm('dateOfBirth.errors.required'), value => {
            return value !== undefined && value !== null && value !== 0
          })
          .test('valid-date', tForm('dateOfBirth.errors.invalid'), value => {
            if (value === 0) {
              return false
            }
            return moment.utc(value).isValid()
          })
          .test('min-age', tForm('dateOfBirth.errors.minAge', { minAge: 18 }), value => {
            if (value === undefined || value === null) return true
            return moment.utc(value).valueOf() <= moment.utc().subtract(18, 'years').valueOf()
          })
          .test('max-age', tForm('dateOfBirth.errors.maxAge', { maxAge: 118 }), value => {
            if (value === undefined || value === null) return true
            return moment.utc(value).valueOf() >= moment.utc().subtract(118, 'years').valueOf()
          })
          .test('is-not-future', tForm('dateOfBirth.errors.future'), value => {
            if (value === undefined || value === null) return true
            return moment.utc(value).valueOf() <= moment.utc().valueOf()
          }),
        code: yup.string().trim().required(tForm('code.errors.required')).length(5, tForm('code.errors.length')),
        email: yup
          .string()
          .trim()
          .required(tForm('email.errors.required'))
          .email(tForm('email.errors.invalid'))
          .test('no-spaces', tForm('email.errors.no-spaces'), value => !value?.includes(' '))
          .test('email-check', tForm('email.errors.alreadyExists'), async function (v) {
            const { createError } = this

            if (!v || !v.includes('@') || v.includes(' ')) {
              return true
            }

            try {
              const response = await getUserCheckEmail({ path: { email: v } })
              return !response.value
            } catch {
              return createError({ message: tForm('email.errors.no-check') })
            }
          }),
        username: yup
          .string()
          .trim()
          .required(tForm('username.errors.required'))
          .min(2, tForm('username.errors.minLength', { minLength: 2 }))
          .max(12, tForm('username.errors.maxLength', { maxLength: 12 }))
          .test('no-spaces', tForm('username.errors.no-spaces'), value => !value?.includes(' '))
          .test('login-check', tForm('username.errors.alreadyExists'), async function (v) {
            const { createError } = this

            if (!v || v.length < 2 || v.length > 12 || v.includes(' ')) {
              return true
            }

            try {
              const response = await getUserCheckNickname({ path: { nickname: v } })
              return !response.value
            } catch {
              return createError({ message: tForm('username.errors.no-check') })
            }
          }),
        currentPassword: yup
          .string()
          .trim()
          .required(tForm('password.errors.required'))
          .min(8, tForm('password.errors.minLength', { minLength: 8 }))
          .max(128, tForm('password.errors.maxLength', { maxLength: 128 }))
          .test('no-spaces', tForm('password.errors.no-spaces'), value => !value?.includes(' '))
          .test('has-uppercase', tForm('password.errors.uppercase'), password => /[A-Z]/.test(password || ''))
          .test('has-lowercase', tForm('password.errors.lowercase'), password => /[a-z]/.test(password || ''))
          .test('has-number', tForm('password.errors.digit'), password => /[0-9]/.test(password || ''))
          .test('has-special-char', tForm('password.errors.special'), password =>
            /[!()@#$%^&*_.-]/.test(password || '')
          ),
        confirmPassword: yup
          .string()
          .trim()
          .required(tForm('password.errors.required'))
          .oneOf([yup.ref('currentPassword'), ''], tForm('password.errors.mismatch'))
      }),
    [getUserCheckEmail, getUserCheckNickname, tForm]
  )
  return (
    <ValidationContext.Provider value={{ validationFunctions, validationSignIn, validationSignUp }}>
      {props.children}
    </ValidationContext.Provider>
  )
}
