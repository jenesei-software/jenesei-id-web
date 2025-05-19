import { useSSOLogout } from '@jenesei-software/jenesei-id-web-api'
import { Button } from '@jenesei-software/jenesei-ui-react/component-button'
import { Stack } from '@jenesei-software/jenesei-ui-react/component-stack'

export function PagePrivateSessionsAndSecurity() {
  const { mutateAsync, isPending } = useSSOLogout()

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
    >
      <Button
        isHidden={isPending}
        isDisabled={isPending}
        genre="product"
        size="medium"
        isOnlyIcon={isPending}
        onClick={async () => {
          await mutateAsync()
        }}
        icons={[
          {
            type: 'loading',
            name: 'Balls',
            isHidden: !isPending
          }
        ]}
      >
        LogOut
      </Button>
    </Stack>
  )
}
