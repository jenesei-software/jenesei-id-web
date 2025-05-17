import { SelectLanguage } from '@jenesei-software/jenesei-ui-react/component-select'
import { Stack } from '@jenesei-software/jenesei-ui-react/component-stack'
import { ILanguageKeys } from '@jenesei-software/jenesei-ui-react/types'
import { useMatches } from '@tanstack/react-router'
import { FC } from 'react'
import { useTranslation } from 'react-i18next'

import { useLanguage } from '@local/contexts/context-language'
import { LayoutRoutePrivate } from '@local/core/router'

export const Header: FC = () => {
  const { t } = useTranslation('translation')

  const { changeLng, lng } = useLanguage()
  const isMatchPrivate = useMatches({
    select(matches) {
      return matches.some(match => match.fullPath === LayoutRoutePrivate.fullPath)
    }
  })
  return isMatchPrivate ? (
    <Stack
      sx={() => ({
        default: {
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
          padding: '0 24px'
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
  ) : null
}
