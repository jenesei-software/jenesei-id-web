import { FC } from 'react'

import { FormProps, FormWrapper } from '.'

export const Form: FC<FormProps> = props => {
  return (
    <FormWrapper
      $sx={props.sx}
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
