import styled from 'styled-components'

export const LayoutErrorWrapper = styled.div`
  background-color: white;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  max-width: 100%;
  width: 100%;
  height: 100vh;
  overflow: hidden;
  gap: 16px;
`

export const LayoutErrorTitlesContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 8px;
`
