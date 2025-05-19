import { IJeneseiTheme } from '@jenesei-software/jenesei-ui-react/style-theme'
import 'styled-components'

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface DefaultTheme extends IJeneseiTheme {}
}
