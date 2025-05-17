import { ProviderAxiosWebId } from '@jenesei-software/jenesei-id-web-api'
import { ProviderCookie } from '@jenesei-software/jenesei-ui-react/context-cookie'
import { ProviderDialog } from '@jenesei-software/jenesei-ui-react/context-dialog'
import { ProviderGeolocation } from '@jenesei-software/jenesei-ui-react/context-geolocation'
import { ProviderPermission } from '@jenesei-software/jenesei-ui-react/context-permission'
import { ProviderScreenWidth } from '@jenesei-software/jenesei-ui-react/context-screen-width'
import { JeneseiGlobalStyles, JeneseiTheme } from '@jenesei-software/jenesei-ui-react/style-theme'
import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'styled-components'

import { queryClient } from '@local/core/query'
import { getValidateCookieValue, validateCookieKeys } from '@local/functions/validate-cookie-value'
import { LayoutErrorBoundary } from '@local/layouts/layout-error'
import { LayoutRouter } from '@local/layouts/layout-router'

const baseURL = import.meta.env.VITE_BASE_URL || ''
const coreURL = import.meta.env.VITE_CORE_URL || ''
const cookieNameAccessToken = import.meta.env.VITE_COOKIE_NAME_ACCESS_TOKEN || ''

function App() {
  return (
    <ThemeProvider theme={JeneseiTheme}>
      <JeneseiGlobalStyles />
      <LayoutErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <ProviderScreenWidth>
            <ProviderAxiosWebId
              queryClient={queryClient}
              coreURL={coreURL}
              baseURL={baseURL}
              availabilityCookieName={cookieNameAccessToken}
            >
              <ProviderCookie
                validate={{
                  validateKeys: validateCookieKeys,
                  getValidateCookieValue
                }}
              >
                <ProviderPermission>
                  <ProviderGeolocation>
                    <ProviderDialog zIndex={1000}>
                      <LayoutRouter />
                    </ProviderDialog>
                  </ProviderGeolocation>
                </ProviderPermission>
              </ProviderCookie>
            </ProviderAxiosWebId>
          </ProviderScreenWidth>
        </QueryClientProvider>
      </LayoutErrorBoundary>
    </ThemeProvider>
  )
}

export default App
