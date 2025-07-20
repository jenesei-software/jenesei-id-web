import { Stack } from '@jenesei-software/jenesei-kit-react/component-stack'
import { Typography } from '@jenesei-software/jenesei-kit-react/component-typography'
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
                gap: '12px',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }
            }}
          >
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
              An unknown error occurred.
              <br />
              Please try again later.
            </Typography>
            {this?.state?.error?.message && (
              <Typography
                sx={{
                  default: {
                    variant: 'h8',
                    align: 'center',
                    weight: 700,
                    color: 'black100'
                  }
                }}
              >
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
