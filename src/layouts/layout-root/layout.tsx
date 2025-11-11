import { Footer } from '@local/components/component-footer';
import { Header } from '@local/components/component-header';
import { LeftAside } from '@local/components/component-left-aside';
import { Nav } from '@local/components/component-nav';
import { Notification } from '@local/components/component-notification';
import { usePWA } from '@local/contexts/context-pwa';
import { LayoutRoutePrivate, LayoutRoutePublic } from '@local/core/router';
import { useEnvironment } from '@local/hooks/use-environment';

import { useAuthProfile, useAxiosWebId } from '@jenesei-software/jenesei-id-web-api';
import { Button, Stack, Typography, useDialog, useDialogProps } from '@jenesei-software/jenesei-kit-react';
import { ProviderApp, useApp } from '@jenesei-software/jenesei-kit-react/context-app';
import { useScreenWidth } from '@jenesei-software/jenesei-kit-react/context-screen-width';
import { ProviderSonner } from '@jenesei-software/jenesei-kit-react/context-sonner';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Outlet, useMatches, useNavigate, useRouterState } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function LayoutRoot() {
  const env = useEnvironment();
  const pwa = usePWA();
  useEffect(() => {
    console.table(env);
  }, [env]);
  useEffect(() => {
    console.table(pwa);
  }, [pwa]);

  const { t } = useTranslation('translation');
  const authProfile = useAuthProfile();
  const isAuthenticated = useMemo(
    () => (authProfile.isFetched ? authProfile.isSuccess : undefined),
    [authProfile.isFetched, authProfile.isSuccess],
  );

  const visible = useMemo(() => !!authProfile.isLoading, [authProfile.isLoading]);
  const navigate = useNavigate();

  const isMatchPrivate = useMatches({
    select(matches) {
      return matches.some((match) => match.fullPath === LayoutRoutePrivate.fullPath);
    },
  });
  const isMatchPublic = useMatches({
    select(matches) {
      return matches.some((match) => match.fullPath === LayoutRoutePublic.fullPath);
    },
  });

  useEffect(() => {
    if (isAuthenticated !== undefined) {
      if (isMatchPrivate) {
        if (!isAuthenticated) navigate({ to: '/pu' });
      } else if (isMatchPublic) {
        if (isAuthenticated) navigate({ to: '/pr' });
      }
    }
  }, [isAuthenticated, isMatchPrivate, isMatchPublic, navigate]);

  const { screenActual } = useScreenWidth();

  const propsDialog: useDialogProps = useMemo(
    () => ({
      content() {
        return <DialogPWA />;
      },
      propsDialog: {
        padding: '0px',
        isRemoveOnOutsideClick: false,
      },
    }),
    [],
  );
  const { add } = useDialog(propsDialog);

  useEffect(() => {
    if (pwa.isUpdateAvailable) {
      add();
    }
  }, [pwa.isUpdateAvailable, add]);

  const { isErrorNetwork } = useAxiosWebId();

  return (
    <>
      <ProviderSonner
        gap={12}
        position={screenActual === 'mobile' ? 'bottom-center' : 'bottom-right'}
        visibleToasts={3}
        zIndex={100}
        default={{
          genre: 'black',
          button: {
            content: t('sonner.undo'),
          },
        }}
      >
        <ProviderApp
          defaultPreview={{ visible: !visible, defaultVisible: false }}
          defaultTitle={env.nameShort}
          defaultDescription={t('meta.description')}
          isScrollOutlet={true}
          defaultBgColor='whiteStandard'
          defaultStatusBarColor='whiteStandard'
          leftAside={{
            component: <LeftAside />,
            isTopFooter: true,
            isTopNav: true,
            length: {
              default: isMatchPrivate ? '420px' : '50dvw',
              tablet: isMatchPrivate ? '96px' : null,
              mobile: null,
            },
          }}
          footer={{
            component: <Footer />,
            length: {
              default: null,
              tablet: null,
              mobile: isMatchPrivate ? '95px' : null,
            },
          }}
          nav={{
            component: <Nav />,
            length: {
              default: isMatchPrivate ? '68px' : null,
              tablet: isMatchPrivate ? '68px' : null,
              mobile: isMatchPrivate ? '40px' : null,
            },
          }}
          notification={{
            component: <Notification />,
            length: {
              default: isErrorNetwork ? '28px' : null,
              tablet: isErrorNetwork ? '28px' : null,
              mobile: isErrorNetwork ? '28px' : null,
            },
          }}
          header={{
            zIndex: 1,
            component: <Header />,
            length: {
              default: isMatchPrivate ? null : null,
              tablet: isMatchPrivate ? null : '170px',
              mobile: isMatchPrivate ? null : '170px',
            },
          }}
          main={{
            zIndex: 0,
          }}
        >
          <LayoutURLComponent />
        </ProviderApp>
      </ProviderSonner>
      {env.mode === 'test' && (
        <>
          <ReactQueryDevtools buttonPosition='bottom-left' />
          <TanStackRouterDevtools position='bottom-right' />
        </>
      )}
    </>
  );
}
function LayoutURLComponent() {
  const { nameShort } = useEnvironment();
  const { t: tURLTitle } = useTranslation('translation', { keyPrefix: 'url.title' });
  const fullPath = useRouterState({
    select: (state) => state.location.pathname.replace(/\/$/, ''),
  });
  const { changeTitle } = useApp();

  useEffect(() => {
    const titleTranslate = tURLTitle(fullPath, { defaultValue: '__MISSING__' });
    const exists = titleTranslate !== '__MISSING__';
    if (exists) {
      changeTitle(titleTranslate);
    } else {
      changeTitle(nameShort);
    }
  }, [changeTitle, nameShort, fullPath, tURLTitle]);
  return <Outlet />;
}

function DialogPWA() {
  const { t } = useTranslation('translation');
  const env = useEnvironment();
  const pwa = usePWA();
  const [seconds, setSeconds] = useState(10);

  useEffect(() => {
    if (seconds <= 0) {
      pwa.updateApp();
      return;
    }
    const interval = setInterval(() => {
      setSeconds((s) => s - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds, pwa]);

  return (
    <Stack
      sx={{
        default: {
          padding: '20px',
          flexDirection: 'column',
          gap: '16px',
          justifyContent: 'center',
          width: '400px',
          alignItems: 'center',
          textAlign: 'center',
        },
        mobile: {
          width: '90dvw',
        },
      }}
    >
      <Typography sx={{ default: { variant: 'h7', color: 'black50' } }}>
        {t('layout.old-version', { version: env.version })}
      </Typography>
      <Typography sx={{ default: { variant: 'h7', color: 'black50' } }}>
        {t('layout.new-version', { version: pwa.newVersion })}
      </Typography>
      <Typography sx={{ default: { variant: 'h7', color: 'black50' } }}>
        {t('layout.reload-auto', { seconds: seconds })}
      </Typography>
      <Button isRadius genre='gray' size='mediumSmall' onClick={() => pwa.updateApp()}>
        {t('layout.reload-now')}
      </Button>
    </Stack>
  );
}
