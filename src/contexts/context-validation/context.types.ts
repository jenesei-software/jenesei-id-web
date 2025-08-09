import { ErrorMessageProps } from '@jenesei-software/jenesei-kit-react';
import { FieldMeta, FormAsyncValidateOrFn } from '@tanstack/react-form';
import { PropsWithChildren } from 'react';
import * as yup from 'yup';

export type ProviderValidationProps = PropsWithChildren;

export type ValidationFunctions = {
  change: (validation: yup.ObjectSchema<any>) => FormAsyncValidateOrFn<any>;
};

export type ValidationContextProps = {
  validationFunctions: ValidationFunctions;
  validationSignUp: yup.ObjectSchema<any>;
  validationSignIn: yup.ObjectSchema<any>;
  validationPasswordUpdate: yup.ObjectSchema<any>;
  validationLanguageAndCountryCode: yup.ObjectSchema<any>;
  validationUser: yup.ObjectSchema<any>;
  getError: (
    props: FieldMeta<
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any,
      any
    >,
  ) => ErrorMessageProps;
};
