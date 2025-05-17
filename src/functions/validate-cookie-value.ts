import { ValidCookieObject } from '@jenesei-software/jenesei-ui-react/context-cookie'

export const validateCookieKeys: (keyof ValidCookieObject)[] = ['auth_status']
export function getValidateCookieValue<K extends keyof ValidCookieObject>(
  key: K,
  value: ValidCookieObject[K]
): value is ValidCookieObject[K] {
  switch (key) {
    case 'auth_status':
      return typeof value === 'boolean'
    default:
      return true
  }
}
