import { useLanguage } from '@local/contexts/context-language';
import { LayoutRoutePrivate } from '@local/core/router';

import { Icon, Image, Typography } from '@jenesei-software/jenesei-kit-react';
import { SelectLanguage } from '@jenesei-software/jenesei-kit-react/component-select';
import { Stack } from '@jenesei-software/jenesei-kit-react/component-stack';
import { ILanguageKeys } from '@jenesei-software/jenesei-kit-react/types';
import { useMatches } from '@tanstack/react-router';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export const Header: FC = () => {
  const { t } = useTranslation('translation');

  const { changeLng, lng } = useLanguage();
  const isMatchPrivate = useMatches({
    select(matches) {
      return matches.some((match) => match.fullPath === LayoutRoutePrivate.fullPath);
    },
  });
  return (
    <Stack
      sx={(theme) => ({
        default: {
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: '12px',
          position: 'relative',
          padding: isMatchPrivate ? '10px 20px' : '0px',
          backgroundColor: theme.palette.black05,
          boxShadow: `inset 0px 4px 4px 0px rgba(0, 0, 0, 0.25)`,
        },
      })}
    >
      {isMatchPrivate ? (
        <SelectLanguage
          labelPlaceholder={t('form.language.placeholder')}
          isShowDropdownOptionIcon
          isOnClickOptionClose
          isOnlyColorInSelectListOption
          isStayValueAfterSelect
          genre={'realebail-white'}
          size={'medium'}
          sx={{
            default: {
              width: '120px',
            },
          }}
          value={lng}
          onChange={(lng) => changeLng(lng as ILanguageKeys)}
        />
      ) : (
        <>
          <Image
            src='https://id.jenesei.ru/images/auth-back-mountain.jpg'
            alt='Mountain'
            sxStack={(theme) => ({
              default: {
                width: '100%',
                height: '100%',
                position: 'absolute',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: theme.palette.black10,
                pointerEvents: 'none',
              },
            })}
          />
          <Stack
            sx={{
              default: {
                flexGrow: 1,
                alignItems: 'center',
                justifyContent: 'center',
              },
            }}
          >
            <Stack
              sx={{
                default: {
                  width: '82px',
                  height: '82px',
                },
              }}
            >
              <Icon type='logo' name='Jenesei' size='100%' primaryColor='whiteStandard' />
            </Stack>

            <Stack
              sx={() => ({
                default: {
                  alignItems: 'flex-start',
                  justifyContent: 'center',
                  position: 'relative',
                  flexDirection: 'column',
                },
              })}
            >
              <Typography
                sx={{
                  default: {
                    size: 42,
                    weight: 700,
                    color: 'whiteStandard',
                    shadow: 'shadowPulse',
                  },
                }}
              >
                {t('public.layout.title')}
              </Typography>
              <Typography
                sx={{
                  default: {
                    size: 12,
                    weight: 500,
                    color: 'whiteStandard',
                    shadow: 'shadowPulse',
                  },
                }}
              >
                {t('public.layout.description')}
              </Typography>
            </Stack>
          </Stack>
        </>
      )}
    </Stack>
  );
};
