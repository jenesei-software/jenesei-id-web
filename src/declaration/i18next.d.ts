import { defaultNS, INameSpace, IResources } from '@local/core/i18n/index';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: defaultNS;
    resources: Record<INameSpace, IResources>;
  }
}
