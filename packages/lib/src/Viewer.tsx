import { PropsWithChildren } from 'react'
import { Container } from './Container'
import { Debug } from './Debug'
import { Detail } from './Detail'
import { Footer } from './Footer'
import { Header } from './Header'
import { usePointer } from './lib/pointer-react'
import { searchRef } from './lib/search'
import { useUi } from './lib/ui-react'
import { MapHtml, MapHtmlStyle } from './MapHtml'
import { MapSvg } from './MapSvg'
import { Right } from './Right'
import { Shadow } from './Shadow'

export const Viewer = (props: Readonly<PropsWithChildren>) => {
  // eslint-disable-next-line functional/no-expression-statements
  usePointer()

  const { uiRef } = useUi()

  return (
    <>
      <Container>
        <MapSvg>{props.children}</MapSvg>
        <MapHtml />
        <MapHtmlStyle />
      </Container>
      <Shadow _uiRef={uiRef} />
      <Detail _uiRef={uiRef} />
      <Header _uiRef={uiRef} />
      <Footer _uiRef={uiRef} />
      <Right _uiRef={uiRef} />
      <Debug _uiRef={uiRef} _searchRef={searchRef} />
    </>
  )
}
