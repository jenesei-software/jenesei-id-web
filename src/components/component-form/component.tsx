import { FC } from 'react'

import { FormProps, FormWrapper } from '.'

export const Form: FC<FormProps> = props => {
  return (
    <FormWrapper
      $width={props.width}
      onSubmit={e => {
        e.preventDefault()
        e.stopPropagation()
        if (props.handleSubmit) props.handleSubmit()
      }}
      style={props.style}
    >
      {props.children}
    </FormWrapper>
  )
}
