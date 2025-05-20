import {
  ILanguageKeys,
  SelectLanguage,
  Separator,
  Typography,
  useScreenWidth
} from '@jenesei-software/jenesei-ui-react'
import { Stack } from '@jenesei-software/jenesei-ui-react/component-stack'
import { useTranslation } from 'react-i18next'

import { useLanguage } from '@local/contexts/context-language'

export function PagePrivateLanguageAndCountry() {
  const { t } = useTranslation('translation')
  const { screenActual } = useScreenWidth()

  const { changeLng, lng } = useLanguage()
  return (
    <Stack
      sx={{
        default: {
          width: '100%',
          height: '100%',
          alignItems: 'stretch',
          flexDirection: 'column',
          flexGrow: 1,
          gap: '20px'
        }
      }}
    >
      <Stack
        sx={{
          default: {
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '6px'
          }
        }}
      >
        <Typography
          sx={{
            default: {
              variant: 'h6',
              weight: 700,
              color: 'black80',
              line: 1
            }
          }}
        >
          {t('private.language-and-country.menu.title')}
        </Typography>
        <Typography
          sx={{
            default: {
              variant: 'h8',
              weight: 500,
              color: 'black50',
              line: 2
            }
          }}
        >
          {t('private.language-and-country.menu.description')}
        </Typography>
      </Stack>
      <Separator color="black05" height="2px" width="100%" radius="50%" />
      <Stack
        sx={{
          default: {
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '8px'
          }
        }}
      >
        <Typography
          sx={{
            default: {
              variant: 'h7',
              weight: 700,
              color: 'black80',
              line: 1
            }
          }}
        >
          {t('private.language-and-country.form.language.title')}
        </Typography>
        <SelectLanguage
          placeholder={t('form.language.placeholder')}
          isShowSelectInputIcon
          isShowDropdownOptionIcon
          genre="blackBorder"
          size={'medium'}
          width={screenActual === 'mobile' ? '100%' : '300px'}
          value={lng}
          inputProps={{ isReadOnly: true, variety: 'standard' }}
          onChange={lng => changeLng(lng as ILanguageKeys)}
        />
      </Stack>
    </Stack>
  )
}
