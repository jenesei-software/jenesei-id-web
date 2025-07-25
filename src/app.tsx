import { ProviderLanguage } from '@local/contexts/context-language'
import { queryClient } from '@local/core/query'
import { useEnvironment } from '@local/hooks/use-environment'
import { LayoutErrorBoundary } from '@local/layouts/layout-error'
import { LayoutRouter } from '@local/layouts/layout-router'

import { ProviderAxiosWebId, ProviderWSWebId } from '@jenesei-software/jenesei-id-web-api'
import { ProviderDialog } from '@jenesei-software/jenesei-kit-react/context-dialog'
import { ProviderGeolocation } from '@jenesei-software/jenesei-kit-react/context-geolocation'
import { ProviderPermission } from '@jenesei-software/jenesei-kit-react/context-permission'
import { ProviderScreenWidth } from '@jenesei-software/jenesei-kit-react/context-screen-width'
import { JeneseiGlobalStyles, ThemeLight } from '@jenesei-software/jenesei-kit-react/style-theme'
import { QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'styled-components'

function App() {
  const env = useEnvironment()

  return (
    <ThemeProvider theme={ThemeLight}>
      <ProviderScreenWidth>
        <ProviderLanguage>
          <JeneseiGlobalStyles />
          <LayoutErrorBoundary>
            <QueryClientProvider client={queryClient}>
              <ProviderAxiosWebId queryClient={queryClient} baseURL={env.baseURL}>
                <ProviderWSWebId socketURL={env.socketURL}>
                  <ProviderPermission>
                    <ProviderGeolocation>
                      <ProviderDialog zIndex={1000}>
                        <LayoutRouter />
                      </ProviderDialog>
                    </ProviderGeolocation>
                  </ProviderPermission>
                </ProviderWSWebId>
              </ProviderAxiosWebId>
            </QueryClientProvider>
          </LayoutErrorBoundary>
        </ProviderLanguage>
      </ProviderScreenWidth>
    </ThemeProvider>
  )
}

export default App
