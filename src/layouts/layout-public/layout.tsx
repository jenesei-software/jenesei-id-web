import { useLanguage } from '@local/contexts/context-language';

import { SelectLanguage } from '@jenesei-software/jenesei-kit-react/component-select';
import { Stack } from '@jenesei-software/jenesei-kit-react/component-stack';
import { ILanguageKeys } from '@jenesei-software/jenesei-kit-react/types';
import { Outlet } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';

export function LayoutPublic() {
  const { t } = useTranslation('translation');

  const { changeLng, lng } = useLanguage();
  return (
    <Stack
      sx={{
        default: {
          flexGrow: 1,
          flexDirection: 'column',
          padding: '20px',
          overflow: 'auto',
        },
        tablet: {
          padding: '10px',
          alignItems: 'center',
        },
      }}
    >
      <Stack
        sx={{
          default: {
            justifyContent: 'flex-end',
            width: '100%',
          },
        }}
      >
        <SelectLanguage
          labelPlaceholder={t('form.language.placeholder')}
          isShowDropdownOptionIcon
          isOnClickOptionClose
          isStayValueAfterSelect
          isOnlyColorInSelectListOption
          genre='grayBorder'
          size={'medium'}
          sx={{
            default: {
              width: '120px',
            },
          }}
          value={lng}
          onChange={(lng) => changeLng(lng as ILanguageKeys)}
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
            paddingBottom: '38px',
          },
          tablet: {
            width: '560px',
            justifyContent: 'flex-start',
          },
          mobile: {
            width: '100%',
            paddingBottom: '0px',
          },
        }}
      >
        <Outlet />
      </Stack>
    </Stack>
  );
}
