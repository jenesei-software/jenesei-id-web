import { Stack } from '@jenesei-software/jenesei-ui-react/component-stack'

export function PagePrivateHome() {
  return (
    <Stack
      sx={{
        default: {
          width: '100%',
          height: '100%',
          alignItems: 'center',
          flexDirection: 'column',
          flexGrow: 1,
          overflow: 'hidden'
        }
      }}
    ></Stack>
  )
}
