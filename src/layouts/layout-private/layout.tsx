import { Stack } from '@jenesei-software/jenesei-ui-react/component-stack'
import { Outlet } from '@tanstack/react-router'

export function LayoutPrivate() {
  return (
    <Stack
      sx={{
        default: {
          alignItems: 'center',
          justifyContent: 'center',
          flexGrow: 1,
          overflow: 'hidden',
          overflowY: 'auto'
        }
      }}
    >
      <Outlet />
    </Stack>
  )
}
