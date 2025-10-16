import { useLanguage } from '@local/contexts/context-language';
import { usePWA } from '@local/contexts/context-pwa';
import { useEnvironment } from '@local/hooks/use-environment';

import { Button, Typography, useDialog, useDialogProps } from '@jenesei-software/jenesei-kit-react';
import { SelectLanguage } from '@jenesei-software/jenesei-kit-react/component-select';
import { Stack } from '@jenesei-software/jenesei-kit-react/component-stack';
import { ILanguageKeys } from '@jenesei-software/jenesei-kit-react/types';
import { Outlet } from '@tanstack/react-router';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

export function LayoutPublic() {
  const { t } = useTranslation('translation');
  const env = useEnvironment();
  const pwa = usePWA();
  const propsDialog: useDialogProps = useMemo(
    () => ({
      content() {
        return <DialogPWA />;
      },
      propsDialog: {
        padding: '0px',
        isRemoveOnOutsideClick: false,
      },
    }),
    [],
  );
  const { add } = useDialog(propsDialog);
  const { changeLng, lng } = useLanguage();

  useEffect(() => {
    if (pwa.isUpdateAvailable) {
      add();
    }
  }, [pwa.isUpdateAvailable, add]);
  return (
    <Stack
      sx={{
        default: {
          flexGrow: 1,
          flexDirection: 'column',
          padding: '20px',
          overflow: 'auto',
          gap: '4px',
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
          isToggleWhenClickSelectListOption
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
      <Stack
        sx={{
          default: {
            justifyContent: 'center',
            width: '100%',
            alignItems: 'center',
          },
        }}
      >
        <Typography sx={{ default: { variant: 'h8', color: 'black50' } }}>{env.version}</Typography>
      </Stack>
    </Stack>
  );
}

function DialogPWA() {
  const { t } = useTranslation('translation');
  const env = useEnvironment();
  const pwa = usePWA();
  const [seconds, setSeconds] = useState(10);

  useEffect(() => {
    if (seconds <= 0) {
      pwa.updateApp();
      return;
    }
    const interval = setInterval(() => {
      setSeconds((s) => s - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [seconds, pwa]);

  return (
    <Stack
      sx={{
        default: {
          padding: '20px',
          flexDirection: 'column',
          gap: '16px',
          justifyContent: 'center',
          width: '400px',
          alignItems: 'center',
          textAlign: 'center',
        },
        mobile:{
          width: '90dvw',
        }
      }}
    >
      <Typography sx={{ default: { variant: 'h7', color: 'black50' } }}>{t('public.layout.old-version', { version: env.version })}</Typography>
      <Typography sx={{ default: { variant: 'h7', color: 'black50' } }}>{t('public.layout.new-version', { version: pwa.newVersion })}</Typography>
      <Typography sx={{ default: { variant: 'h7', color: 'black50' } }}>{t('public.layout.reload-auto', { seconds: seconds })}</Typography>
      <Button isRadius genre='gray' size='mediumSmall' onClick={() => pwa.updateApp()}>
        {t('public.layout.reload-now')}
      </Button>
    </Stack>
  );
}
