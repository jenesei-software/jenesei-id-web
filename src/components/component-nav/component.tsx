import { Icon, TypographyLink, useScreenWidth } from '@jenesei-software/jenesei-kit-react'
import { Stack } from '@jenesei-software/jenesei-kit-react/component-stack'
import { useRouterState } from '@tanstack/react-router'
import { FC, Fragment, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

export const Nav: FC = () => {
  const { screenActual } = useScreenWidth()
  const { t: tURLNav } = useTranslation('translation', { keyPrefix: 'url.nav' })
  const fullPath = useRouterState({
    select: state => state.location.pathname.replace(/\/$/, '')
  })
  const [titles, setTitles] = useState<{
    titles: string[]
    urls: string[]
  }>({
    titles: [],
    urls: []
  })
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const titleTranslate = tURLNav(fullPath as any, { defaultValue: ['__MISSING__'], returnObjects: true })
    const exists = titleTranslate[0] !== '__MISSING__'
    if (exists) {
      setTitles({
        titles: titleTranslate as string[],
        urls: fullPath.split('/').filter(e => e !== '')
      })
    } else {
      setTitles({
        titles: [],
        urls: fullPath.split('/').filter(e => e !== '')
      })
    }
  }, [fullPath, tURLNav])
  return (
    <Stack
      sx={theme => ({
        default: {
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: '6px',
          overflow: 'hidden',
          position: 'relative',
          padding: '0px 20px',
          borderStyle: 'solid',
          borderColor: theme.palette.black05,
          borderWidth: screenActual !== 'mobile' ? '0px 0px 0px 2px' : '0px'
        }
      })}
    >
      {titles.titles.map((element, idx) => (
        <Fragment key={idx}>
          <TypographyLink
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            to={`/${titles.urls.slice(0, idx + 1).join('/')}` as any}
            style={{ textDecoration: 'none' }}
            sx={{
              default: {
                variant: 'h8',
                weight: 500,
                color: 'black60',
                line: 1
              }
            }}
          >
            {element}
          </TypographyLink>

          {idx < titles.titles.length - 1 && (
            <Icon type="id" name="ArrowMini1" turn={-90} size="large" primaryColor="black60" />
          )}
        </Fragment>
      ))}
    </Stack>
  )
}
