import { RouterProvider } from '@tanstack/react-router'

import { queryClient } from '@local/core/query'
import { router } from '@local/core/router'

export function LayoutRouter() {
  return <RouterProvider router={router} context={{ queryClient }} />
}
