/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_DEFAULT_DESCRIPTION: string
  readonly VITE_DEFAULT_SHORTNAME: string
  readonly VITE_DEFAULT_THEME_COLOR: string
  readonly VITE_BASE_URL: string
  readonly VITE_SOCKET_URL: string
  readonly VITE_AVAILABILITY_COOKIE_NAME: string
  readonly VITE_CORE_URL: string
  readonly VITE_NODE_ENV: 'dev' | 'prod' | 'test'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare module 'virtual:pwa-register' {
  export type RegisterSWOptions = {
    immediate?: boolean
    onNeedRefresh?: () => void
    onOfflineReady?: () => void
    onRegistered?: (registration: ServiceWorkerRegistration | undefined) => void
    onRegisterError?: (error: any) => void
  }

  export function registerSW(options?: RegisterSWOptions): (reloadPage?: boolean) => Promise<void>
}