import { Button } from '@jenesei-software/jenesei-kit-react/component-button'
import { Typography } from '@jenesei-software/jenesei-kit-react/component-typography'
import { CatchBoundary, useRouter } from '@tanstack/react-router'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'

import { LayoutErrorRouterProps, LayoutErrorTitlesContainer, LayoutErrorWrapper } from '.'

export function LayoutErrorRouter(): ReactElement<LayoutErrorRouterProps> {
  const router = useRouter()
  const { t: tBoundary } = useTranslation('translation', { keyPrefix: 'boundary' })

  return (
    <CatchBoundary getResetKey={() => 'reset'} onCatch={error => console.error(error)}>
      <LayoutErrorWrapper>
        <LayoutErrorTitlesContainer>
          <Typography
            sx={{
              default: {
                variant: 'h6',
                align: 'center',
                weight: 700,
                color: 'black60'
              }
            }}
          >
            {tBoundary('title-1')}
            <br />
            {tBoundary('title-2')}
          </Typography>
          <Button genre={'gray'} size={'small'} onClick={() => router.invalidate()}>
            {tBoundary('title-button')}
          </Button>
        </LayoutErrorTitlesContainer>
      </LayoutErrorWrapper>
    </CatchBoundary>
  )
}
