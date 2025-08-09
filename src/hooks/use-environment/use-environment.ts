import { useMemo } from 'react'

const description = import.meta.env.VITE_DEFAULT_DESCRIPTION
const version = import.meta.env.VITE_APP_VERSION
const name = import.meta.env.VITE_DEFAULT_NAME
const shortName = import.meta.env.VITE_DEFAULT_SHORTNAME
const themeColor = import.meta.env.VITE_DEFAULT_THEME_COLOR
const mode = import.meta.env.VITE_NODE_ENV
const baseURL = import.meta.env.VITE_BASE_URL
const coreURL = import.meta.env.VITE_CORE_URL
const socketURL = import.meta.env.VITE_SOCKET_URL
const cookieNameAccessToken = import.meta.env.VITE_AVAILABILITY_COOKIE_NAME

export const useEnvironment = (): {
  description: string
  name: string
  shortName: string
  themeColor: string
  mode: 'dev' | 'prod' | 'test'
  version: string
  baseURL: string
  coreURL: string
  socketURL: string
  cookieNameAccessToken: string
} => {
  const data = useMemo(
    () => ({
      description: description,
      name: name,
      shortName: shortName,
      themeColor: themeColor,
      mode: mode,
      version: version,
      baseURL: baseURL,
      coreURL: coreURL,
      socketURL: socketURL,
      cookieNameAccessToken: cookieNameAccessToken
    }),
    []
  )
  return data
}
