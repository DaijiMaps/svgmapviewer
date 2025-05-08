import { PropsWithChildren, useRef } from 'react'
import { Container, ContainerStyle } from './Container'
import { Debug } from './Debug'
import { Detail } from './Detail'
import { Footer, FooterStyle } from './Footer'
import { Header, HeaderStyle } from './Header'
import { usePointer } from './lib/pointer-react'
import { searchRef } from './lib/search'
import { useUi } from './lib/ui-react'
import { MapHtml } from './MapHtml'
import { MapSvg } from './MapSvg'
import { Right, RightStyle } from './Right'
import { Shadow, ShadowStyle } from './Shadow'

export const Viewer = (props: Readonly<PropsWithChildren>) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const { pointerRef } = usePointer(containerRef)

  const { uiRef } = useUi(pointerRef)

  return (
    <>
      <Container ref={containerRef} _pointerRef={pointerRef}>
        <MapSvg _pointerRef={pointerRef}>{props.children}</MapSvg>
        <MapHtml _pointerRef={pointerRef} />
        <Shadow _uiRef={uiRef} />
        <ShadowStyle _uiRef={uiRef} />
        <Detail _pointerRef={pointerRef} _uiRef={uiRef} />
      </Container>
      <ContainerStyle _pointerRef={pointerRef} />

      <Header _uiRef={uiRef} _pointerRef={pointerRef} />
      <HeaderStyle _uiRef={uiRef} _pointerRef={pointerRef} />

      <Footer _uiRef={uiRef} _pointerRef={pointerRef} />
      <FooterStyle _uiRef={uiRef} _pointerRef={pointerRef} />

      <Right _uiRef={uiRef} _pointerRef={pointerRef} />
      <RightStyle _uiRef={uiRef} _pointerRef={pointerRef} />

      <Debug
        _containerRef={containerRef}
        _uiRef={uiRef}
        _pointerRef={pointerRef}
        _searchRef={searchRef}
      />
    </>
  )
}
