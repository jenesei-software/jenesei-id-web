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
