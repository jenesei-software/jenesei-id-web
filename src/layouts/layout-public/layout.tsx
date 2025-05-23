import { SelectLanguage } from '@jenesei-software/jenesei-ui-react/component-select'
import { Stack } from '@jenesei-software/jenesei-ui-react/component-stack'
import { ILanguageKeys } from '@jenesei-software/jenesei-ui-react/types'
import { Outlet } from '@tanstack/react-router'
import { useTranslation } from 'react-i18next'

import { useLanguage } from '@local/contexts/context-language'

export function LayoutPublic() {
  const { t } = useTranslation('translation')

  const { changeLng, lng } = useLanguage()
  return (
    <Stack
      sx={{
        default: {
          flexGrow: 1,
          flexDirection: 'column',
          padding: '20px',
          overflow: 'auto'
        },
        tablet: {
          padding: '10px',
          alignItems: 'center'
        }
      }}
    >
      <>
        <Stack
          sx={{
            default: {
              justifyContent: 'flex-end',
              width: '100%'
            }
          }}
        >
          <SelectLanguage
            placeholder={t('form.language.placeholder')}
            isShowSelectInputIcon
            isShowDropdownOptionIcon
            genre="grayBorder"
            size={'medium'}
            width="120px"
            value={lng}
            inputProps={{ isReadOnly: true, variety: 'standard' }}
            onChange={lng => changeLng(lng as ILanguageKeys)}
          />
        </Stack>
        <Stack
          sx={{
            default: {
              width: '400px',
              flexDirection: 'column',
              gap: '45px',
              alignItems: 'stretch',
              justifyContent: 'center',
              flexGrow: 1,
              maxWidth: '-webkit-fill-available',
              paddingBottom: '38px'
            },
            tablet: {
              width: '560px',
              justifyContent: 'flex-start'
            },
            mobile: {
              width: '100%',
              paddingBottom: '0px'
            }
          }}
        >
          <Outlet />
        </Stack>
      </>
    </Stack>
  )
}
