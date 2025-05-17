import { Stack } from '@jenesei-software/jenesei-ui-react/component-stack'
import { Typography } from '@jenesei-software/jenesei-ui-react/component-typography'
import React, { Component } from 'react'

import { LayoutErrorBoundaryProps, LayoutErrorBoundaryState, LayoutErrorWrapper } from '.'

export class LayoutErrorBoundary extends Component<LayoutErrorBoundaryProps, LayoutErrorBoundaryState> {
  constructor(props: LayoutErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <LayoutErrorWrapper>
          <Stack
            sx={{
              default: {
                gap: '8px',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }
            }}
          >
            <Typography align="center" size={16} weight={700} color="black80">
              Произошла неизвестная ошибка.
              <br />
              Пожалуйста, попробуйте позже.
            </Typography>
            {this?.state?.error?.message && (
              <Typography align="center" size={16} weight={400} color="grayPatricia">
                {this?.state?.error?.message}
              </Typography>
            )}
          </Stack>
        </LayoutErrorWrapper>
      )
    }

    return this.props.children
  }
}
