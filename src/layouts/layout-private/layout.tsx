import { Stack } from '@jenesei-software/jenesei-ui-react/component-stack'
import { useScreenWidth } from '@jenesei-software/jenesei-ui-react/context-screen-width'
import { Outlet } from '@tanstack/react-router'

export function LayoutPrivate() {
  const { screenActual } = useScreenWidth()

  return (
    <Stack
      sx={theme => ({
        default: {
          flexGrow: 1,
          padding: '26px',
          borderStyle: 'solid',
          borderColor: theme.palette.black05,
          overflowY: 'auto',
          overflowX: 'hidden',
          height: 'fit-content',
          minHeight: '-webkit-fill-available',
          borderWidth: screenActual !== 'mobile' ? '2px 0px 0px 2px' : '2px 0px 0px 0px'
        },
        mobile: {
          padding: '14px'
        }
      })}
    >
      <Outlet />
    </Stack>
  )
}
