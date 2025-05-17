import { AddDollarSign } from '@jenesei-software/jenesei-ui-react/types'
import { CSSProperties, PropsWithChildren } from 'react'

export interface FormProps extends PropsWithChildren {
  width?: string
  handleSubmit?: () => void
  style?: CSSProperties
}

export type FormWrapperProps = AddDollarSign<Pick<FormProps, 'width'>>
