/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormApi } from '@tanstack/react-form'
import { PropsWithChildren } from 'react'
import * as yup from 'yup'

export type ProviderValidationProps = PropsWithChildren

export type ValidationContextProps = {
  validationFunctions: {
    touched: <TValues extends Record<string, any>>(
      validation: yup.ObjectSchema<any>
    ) => (
      {
        value,
        formApi
      }: {
        value: TValues
        formApi: FormApi<TValues, any, any, any, any, any, any, any, any, any>
        signal: AbortSignal
      },
      field?: string
    ) => Promise<null | {
      fields: Record<string, string>
    }>
  }
  validationSignUp: yup.ObjectSchema<any>
  validationSignIn: yup.ObjectSchema<any>
  validationPasswordUpdate: yup.ObjectSchema<any>
  validationLanguageAndCountryCode: yup.ObjectSchema<any>
  validationUser: yup.ObjectSchema<any>
}
