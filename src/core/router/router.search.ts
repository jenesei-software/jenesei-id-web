import { IServiceKeys } from '@jenesei-software/jenesei-kit-react/types'

export type LayoutRouteRootSearch = {
  pastResource?: IServiceKeys
  // redirect?: string
}
export const validateLayoutRouteRootSearch = (
  search: Record<keyof LayoutRouteRootSearch, unknown>
): LayoutRouteRootSearch => {
  const isPastResource = (value: unknown): value is LayoutRouteRootSearch['pastResource'] => value === 'jenesei_id'
  // const isRedirect = (value: unknown): value is LayoutRouteRootSearch['redirect'] => typeof value === 'string'

  const searchParams: LayoutRouteRootSearch = {
    pastResource: isPastResource(search?.pastResource) ? search.pastResource : undefined
    // redirect: isRedirect(search?.redirect) ? search.redirect : undefined
  }

  return searchParams
}
