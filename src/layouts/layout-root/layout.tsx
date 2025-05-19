import { useSSOProfile } from '@jenesei-software/jenesei-id-web-api'
import { useRemovePreviewLoader } from '@jenesei-software/jenesei-ui-react/area-preview'
import { ProviderApp } from '@jenesei-software/jenesei-ui-react/context-app'
import { useScreenWidth } from '@jenesei-software/jenesei-ui-react/context-screen-width'
import { ProviderSonner } from '@jenesei-software/jenesei-ui-react/context-sonner'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Outlet, useMatches, useNavigate } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'

// import { Footer } from '@local/components/component-footer'
import { Header } from '@local/components/component-header'
import { LeftAside } from '@local/components/component-left-aside'
import { ProviderValidation } from '@local/contexts/context-validation'
import { LayoutRoutePrivate, LayoutRoutePublic } from '@local/core/router'
import { useEnvironment } from '@local/hooks/use-environment'

export function LayoutRoot() {
  useRemovePreviewLoader()
  const env = useEnvironment()

  useEffect(() => {
    console.table(env)
  }, [env])

  return (
    <>
      <ProviderValidation>
        <LayoutRootComponent />
      </ProviderValidation>
      {env.mode === 'test' && (
        <>
          <ReactQueryDevtools buttonPosition="bottom-left" />
          <TanStackRouterDevtools position="bottom-right" />
        </>
      )}
    </>
  )
}

const LayoutRootComponent = () => {
  const { title } = useEnvironment()
  const { t } = useTranslation('translation')
  const { isLoading, isSuccess, isFetched } = useSSOProfile({ retry: false })
  const isAuthenticated = useMemo(() => (isFetched ? isSuccess : undefined), [isFetched, isSuccess])

  const visible = useMemo(() => !!isLoading, [isLoading])
  const navigate = useNavigate()

  const isMatchPrivate = useMatches({
    select(matches) {
      return matches.some(match => match.fullPath === LayoutRoutePrivate.fullPath)
    }
  })
  const isMatchPublic = useMatches({
    select(matches) {
      return matches.some(match => match.fullPath === LayoutRoutePublic.fullPath)
    }
  })

  useEffect(() => {
    if (isAuthenticated !== undefined) {
      if (isMatchPrivate) {
        if (!isAuthenticated) navigate({ to: '/pu' })
      } else if (isMatchPublic) {
        if (isAuthenticated) navigate({ to: '/pr' })
      }
    }
  }, [isAuthenticated, isMatchPrivate, isMatchPublic, navigate])

  const { screenActual } = useScreenWidth()
  return (
    <ProviderSonner
      gap={12}
      position={screenActual === 'mobile' ? 'bottom-center' : 'bottom-right'}
      visibleToasts={3}
      zIndex={100}
      default={{
        genre: 'black',
        button: {
          content: t('sonner.undo')
        }
      }}
    >
      <ProviderApp
        defaultPreview={{ visible: !visible, defaultVisible: false }}
        defaultTitle={title}
        defaultDescription={t('meta.description')}
        isScrollOutlet={true}
        defaultBgColor="whiteStandard"
        defaultStatusBarColor="whiteStandard"
        leftAside={{
          component: <LeftAside />,
          isTopFooter: true,
          length: {
            default: isMatchPrivate ? '420px' : '50dvw',
            tablet: isMatchPrivate ? '96px' : null,
            mobile: null
          }
        }}
        header={{
          zIndex: 1,
          component: <Header />,
          length: {
            default: isMatchPrivate ? '60px' : null,
            tablet: isMatchPrivate ? '60px' : '170px',
            mobile: isMatchPrivate ? '60px' : '170px'
          }
        }}
        main={{
          zIndex: 0
        }}
      >
        <Outlet />
      </ProviderApp>
    </ProviderSonner>
  )
}
