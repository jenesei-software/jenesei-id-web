import { AuthLayout } from '@jenesei-software/jenesei-ui-react/layout-auth'
import { Outlet } from '@tanstack/react-router'

export function LayoutPrivate() {
  return (
    <AuthLayout backUrl="/images/auth-back-mountain.png" backUrlWebp="/images/auth-back-mountain.webp">
      <Outlet />
    </AuthLayout>
  )
}
