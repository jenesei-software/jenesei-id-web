import { queryClient } from '@local/core/query';
import { router } from '@local/core/router';

import { RouterProvider } from '@tanstack/react-router';

export function LayoutRouter() {
  return <RouterProvider router={router} context={{ queryClient }} />;
}
