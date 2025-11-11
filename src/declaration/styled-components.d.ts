import { ITheme } from '@jenesei-software/jenesei-kit-react/style-theme';
import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme extends ITheme {}
}
