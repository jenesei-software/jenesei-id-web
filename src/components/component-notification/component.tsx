import { Typography } from '@jenesei-software/jenesei-kit-react';
import { Stack } from '@jenesei-software/jenesei-kit-react/component-stack';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export const Notification: FC = () => {
  const { t: tLayout } = useTranslation('translation', { keyPrefix: 'layout' });

  return (
    <Stack
      sx={(theme) => ({
        default: {
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          overflow: 'hidden',
          position: 'relative',
          padding: '0px 2px',
          backgroundColor: theme.background.red100,
        },
      })}
    >
      <Typography
        sx={{ default: { variant: 'h7', color: 'whiteStandard', family: 'Roboto', line: 1 } }}
      >
        {tLayout('network-error')}
      </Typography>
    </Stack>
  );
};
