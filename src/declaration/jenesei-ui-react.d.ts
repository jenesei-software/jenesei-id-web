import '@jenesei-software/jenesei-ui-react/context-cookie'
import '@jenesei-software/jenesei-ui-react/context-local-storage'

declare module '@jenesei-software/jenesei-ui-react/context-cookie' {
  export interface ValidCookieObject {
    auth_status: boolean
  }
}
declare module '@jenesei-software/jenesei-ui-react/context-local-storage' {}
