import { LayoutErrorRouter } from '@local/layouts/layout-error';
import { LayoutPrivate } from '@local/layouts/layout-private';
import { LayoutPublic } from '@local/layouts/layout-public';
import { LayoutRoot } from '@local/layouts/layout-root';
import { PagePrivateLanguageAndCountry } from '@local/pages/private/language-and-country';
import { PagePrivatePersonalInfo } from '@local/pages/private/personal-info';
import { PagePrivateResources } from '@local/pages/private/resources';
import { PagePrivateSessionsAndSecurity } from '@local/pages/private/sessions-and-security';
import { PagePublicForgotPassword } from '@local/pages/public/forgot-password';
import { PagePublicSignIn } from '@local/pages/public/sign-in';
import { PagePublicSignUp } from '@local/pages/public/sign-up';

import { QueryClient } from '@tanstack/react-query';
import { createRootRouteWithContext, createRoute, createRouter, Navigate, redirect } from '@tanstack/react-router';

import { validateLayoutRouteRootSearch } from '.';

export interface IContext {
  queryClient: QueryClient;
}

export const LayoutRouteRoot = createRootRouteWithContext<IContext>()({
  component: LayoutRoot,
  validateSearch: validateLayoutRouteRootSearch,
  errorComponent: LayoutErrorRouter,
  notFoundComponent: () => <Navigate to={LayoutRoutePublic.fullPath} />,
});

export const LayoutRoutePrivate = createRoute({
  getParentRoute: () => LayoutRouteRoot,
  component: LayoutPrivate,
  notFoundComponent: () => <Navigate to={PageRoutePrivatePersonalInfo.fullPath} />,
  path: '/pr',
  beforeLoad: (props) => {
    const isFirst = props.location.pathname.replace(/\/$/, '') === '/pr';
    if (isFirst)
      throw redirect({
        to: PageRoutePrivatePersonalInfo.fullPath,
      });
  },
});

export const LayoutRoutePublic = createRoute({
  getParentRoute: () => LayoutRouteRoot,
  component: LayoutPublic,
  notFoundComponent: () => <Navigate to={PageRoutePublicSignIn.fullPath} />,
  path: '/pu',
  beforeLoad: (props) => {
    const isFirst = props.location.pathname.replace(/\/$/, '') === '/pu';
    if (isFirst)
      throw redirect({
        to: PageRoutePublicSignIn.fullPath,
      });
  },
});

export const PageRoutePrivatePersonalInfo = createRoute({
  getParentRoute: () => LayoutRoutePrivate,
  component: PagePrivatePersonalInfo,
  path: '/personal-info',
});
export const PageRoutePrivateLanguageAndCountry = createRoute({
  getParentRoute: () => LayoutRoutePrivate,
  component: PagePrivateLanguageAndCountry,
  path: '/language-and-country',
});
export const PageRoutePrivateResources = createRoute({
  getParentRoute: () => LayoutRoutePrivate,
  component: PagePrivateResources,
  path: '/resources',
});
export const PageRoutePrivateSessionsAndSecurity = createRoute({
  getParentRoute: () => LayoutRoutePrivate,
  component: PagePrivateSessionsAndSecurity,
  path: '/sessions-and-security',
});
export const PageRoutePublicSignUp = createRoute({
  getParentRoute: () => LayoutRoutePublic,
  component: PagePublicSignUp,
  path: '/sign-up',
});

export const PageRoutePublicSignIn = createRoute({
  getParentRoute: () => LayoutRoutePublic,
  component: PagePublicSignIn,
  path: '/sign-in',
});

export const PageRoutePublicForgotPassword = createRoute({
  getParentRoute: () => LayoutRoutePublic,
  component: PagePublicForgotPassword,
  path: '/forgot-password',
});

const routeTree = LayoutRouteRoot.addChildren({
  LayoutRoutePublic: LayoutRoutePublic.addChildren({
    PageRoutePublicSignUp,
    PageRoutePublicSignIn,
    PageRoutePublicForgotPassword,
  }),
  LayoutRoutePrivate: LayoutRoutePrivate.addChildren({
    PageRoutePrivatePersonalInfo,
    PageRoutePrivateLanguageAndCountry,
    PageRoutePrivateResources,
    PageRoutePrivateSessionsAndSecurity,
  }),
});

export const router = createRouter({
  routeTree: routeTree,
  context: {
    queryClient: undefined!,
  },
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
});

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
