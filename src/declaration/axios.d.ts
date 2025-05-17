import { AxiosResponseDto } from '@jenesei-software/jenesei-id-web-api'
import 'axios'

declare module 'axios' {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export interface AxiosResponse<T = any> extends AxiosResponseDto {
    data: T
  }
}
