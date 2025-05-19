import styled from 'styled-components'

import { FormWrapperProps } from '.'

export const FormWrapper = styled.form<FormWrapperProps>`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  transition: height ${props => props.theme.transition.default};
  height: auto;
  max-width: ${props => props.$width};
  width: 100%;
`
