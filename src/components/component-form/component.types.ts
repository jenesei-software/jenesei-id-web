import { addSXProps } from '@jenesei-software/jenesei-kit-react'
import { AddDollarSign } from '@jenesei-software/jenesei-kit-react/types'
import { CSSProperties, PropsWithChildren } from 'react'

export interface FormProps extends PropsWithChildren, addSXProps {
  handleSubmit?: () => void
  style?: CSSProperties
} 

export type FormWrapperProps = AddDollarSign<Pick<FormProps, 'sx'>>
