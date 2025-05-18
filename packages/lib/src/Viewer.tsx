import { PropsWithChildren, useRef } from 'react'
import { Container, ContainerStyle } from './Container'
import { Debug } from './Debug'
import { Detail } from './Detail'
import { Footer, FooterStyle } from './Footer'
import { Header, HeaderStyle } from './Header'
import { usePointer } from './lib/pointer-react'
import { searchRef } from './lib/search'
import { useUi } from './lib/ui-react'
import { MapHtml, MapHtmlStyle } from './MapHtml'
import { MapSvg } from './MapSvg'
import { Right, RightStyle } from './Right'
import { Shadow, ShadowStyle } from './Shadow'

export const Viewer = (props: Readonly<PropsWithChildren>) => {
  const containerRef = useRef<HTMLDivElement>(null)

  //const { scrollRef } = useActorRef(scrollMachine, {
  //systemId: 'system-scroll1',
  //input: { ref: containerRef },
  //})

  // eslint-disable-next-line functional/no-expression-statements
  usePointer(containerRef)

  const { uiRef } = useUi()

  return (
    <>
      <Container ref={containerRef}>
        <MapSvg>{props.children}</MapSvg>
        <MapHtml />
        <MapHtmlStyle />
        <Shadow _uiRef={uiRef} />
      </Container>
      <ContainerStyle />

      <ShadowStyle _uiRef={uiRef} />
      <Detail _uiRef={uiRef} />

      <Header _uiRef={uiRef} />
      <HeaderStyle _uiRef={uiRef} />

      <Footer _uiRef={uiRef} />
      <FooterStyle _uiRef={uiRef} />

      <Right _uiRef={uiRef} />
      <RightStyle _uiRef={uiRef} />

      <Debug _uiRef={uiRef} _searchRef={searchRef} />
    </>
  )
}
