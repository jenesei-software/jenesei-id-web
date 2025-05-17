import { Stack } from '@jenesei-software/jenesei-ui-react/component-stack'
import { Outlet } from '@tanstack/react-router'

export function LayoutPublic() {
  return (
    <Stack
      sx={{
        default: {
          alignItems: 'center',
          justifyContent: 'center',
          flexGrow: 1,
          padding: '12px',
          overflow: 'hidden',
          overflowY: 'auto'
        }
      }}
    >
      <Outlet />
    </Stack>
  )
}
