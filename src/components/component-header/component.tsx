import { SelectLanguage } from '@jenesei-software/jenesei-ui-react/component-select'
import { Stack } from '@jenesei-software/jenesei-ui-react/component-stack'
import { ILanguageKeys } from '@jenesei-software/jenesei-ui-react/types'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { useLanguage } from '@local/contexts/context-language'

export const Header: FC = () => {
  const { t } = useTranslation('translation')

  const { changeLng, lng } = useLanguage()
  return (
    <Stack
      sx={theme => ({
        default: {
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '12px',
          padding: '10px 20px',
          backgroundColor: theme.palette.black05,
          boxShadow: `inset 0px 4px 4px 0px rgba(0, 0, 0, 0.25)`
        }
      })}
    >
      <SelectLanguage
        placeholder={t('form.language.placeholder')}
        isShowSelectInputIcon
        isShowDropdownOptionIcon
        genre={'realebail-white'}
        size={'medium'}
        width="120px"
        value={lng}
        inputProps={{ isReadOnly: true, variety: 'standard' }}
        onChange={lng => changeLng(lng as ILanguageKeys)}
      />
    </Stack>
  )
}
