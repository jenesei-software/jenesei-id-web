import { Stack } from '@jenesei-software/jenesei-kit-react/component-stack';
import { Outlet } from '@tanstack/react-router';

export function LayoutPrivate() {
  return (
    <Stack
      sx={(theme) => ({
        default: {
          flexGrow: 1,
          padding: '26px',
          borderStyle: 'solid',
          borderColor: theme.palette.black05,
          overflowY: 'auto',
          overflowX: 'hidden',
          height: 'fit-content',
          minHeight: '-webkit-fill-available',
          borderWidth: '2px 0px 0px 2px',
        },
        mobile: {
          borderWidth: '2px 0px 0px 0px',
          padding: '14px',
        },
      })}
    >
      <Outlet />
    </Stack>
  );
}
