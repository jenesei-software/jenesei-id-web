import { useMemo } from 'react'

const title = import.meta.env.VITE_DEFAULT_TITLE
const description = import.meta.env.VITE_DEFAULT_DESCRIPTION
const version = import.meta.env.VITE_APP_VERSION
const name = import.meta.env.VITE_DEFAULT_SHORTNAME
const shortName = import.meta.env.VITE_DEFAULT_NAME
const themeColor = import.meta.env.VITE_DEFAULT_THEME_COLOR
const mode = import.meta.env.VITE_NODE_ENV
export const useEnvironment = (): {
  title: string
  description: string
  name: string
  shortName: string
  themeColor: string
  mode: 'dev' | 'prod' | 'test'
  version: string
} => {
  const data = useMemo(
    () => ({
      title: title,
      description: description,
      name: name,
      shortName: shortName,
      themeColor: themeColor,
      mode: mode,
      version: version
    }),
    []
  )
  return data
}
