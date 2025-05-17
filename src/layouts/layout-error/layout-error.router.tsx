import { Button } from '@jenesei-software/jenesei-ui-react/component-button'
import { Typography } from '@jenesei-software/jenesei-ui-react/component-typography'
import { CatchBoundary, useRouter } from '@tanstack/react-router'
import { ReactElement } from 'react'

import { LayoutErrorRouterProps, LayoutErrorTitlesContainer, LayoutErrorWrapper } from '.'

export function LayoutErrorRouter(): ReactElement<LayoutErrorRouterProps> {
  const router = useRouter()

  return (
    <CatchBoundary getResetKey={() => 'reset'} onCatch={error => console.error(error)}>
      <LayoutErrorWrapper>
        <LayoutErrorTitlesContainer>
          <Typography align="center" size={16} weight={700} color="black80">
            Произошла неизвестная ошибка. Пожалуйста, попробуйте позже.
          </Typography>
          <Button genre={'gray'} size={'large'} width="max-content" onClick={() => router.invalidate()}>
            Перезагрузить страницу
          </Button>
        </LayoutErrorTitlesContainer>
      </LayoutErrorWrapper>
    </CatchBoundary>
  )
}
