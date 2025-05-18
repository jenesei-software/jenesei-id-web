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
      position={screenActual.value === 'mobile' ? 'bottom-center' : 'bottom-right'}
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
        defaultPreview={{ visible: visible }}
        defaultTitle={title}
        defaultDescription={t('meta.description')}
        isScrollOutlet={true}
        defaultBgColor="whiteStandard"
        defaultStatusBarColor="whiteStandard"
        leftAside={
          screenActual.value !== 'mobile' && isMatchPrivate
            ? {
                component: <LeftAside />,
                isTopFooter: true,
                width: '420px',
                widthTablet: '96px'
              }
            : undefined
        }
        header={
          isMatchPrivate
            ? {
                zIndex: 1,
                component: <Header />,
                height: '60px',
                heightMobile: '60px',
                heightTablet: '60px'
              }
            : undefined
        }
        main={{
          zIndex: 0
        }}
      >
        <Outlet />
      </ProviderApp>
    </ProviderSonner>
  )
}
