import { PropsWithChildren, useRef } from 'react'
import { Container } from './Container'
import { Debug } from './Debug'
import { Detail } from './Detail'
import { Footer, FooterStyle } from './Footer'
import { Guides } from './Guides'
import { Header, HeaderStyle } from './Header'
import { usePointer } from './lib/pointer-react'
import { searchRef } from './lib/search'
import {
  dragStyle,
  modeStyle,
  scrollStyle,
  useMoveStyle,
  useZoomStyle,
} from './lib/style'
import { useUi } from './lib/ui-react'
import { MapHtml } from './MapHtml'
import { MapSvg } from './MapSvg'
import { Right, RightStyle } from './Right'
import { Shadow, ShadowStyle } from './Shadow'

export const Viewer = (props: Readonly<PropsWithChildren>) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const { pointer, pointerRef } = usePointer(containerRef)

  const { uiRef } = useUi(pointerRef)

  const moveStyle = useMoveStyle(pointerRef)
  const zoomStyle = useZoomStyle(pointerRef)

  return (
    <>
      <Container ref={containerRef}>
        <MapSvg _pointerRef={pointerRef}>{props.children}</MapSvg>
        <MapHtml _pointerRef={pointerRef} />
        <Shadow _uiRef={uiRef} />
        <ShadowStyle _uiRef={uiRef} />
        <Detail _pointerRef={pointerRef} _uiRef={uiRef} />
      </Container>
      <Guides _pointerRef={pointerRef} />
      <Header _uiRef={uiRef} _pointerRef={pointerRef} />
      <HeaderStyle _uiRef={uiRef} _pointerRef={pointerRef} />
      <Footer _uiRef={uiRef} _pointerRef={pointerRef} />
      <FooterStyle _uiRef={uiRef} _pointerRef={pointerRef} />
      <Right _uiRef={uiRef} _pointerRef={pointerRef} />
      <RightStyle _uiRef={uiRef} _pointerRef={pointerRef} />
      <Debug
        _container={containerRef.current}
        _uiRef={uiRef}
        _pointerRef={pointerRef}
        _searchRef={searchRef}
      />
      <style>
        {scrollStyle(pointer)}
        {modeStyle(pointer)}
        {dragStyle(pointer)}
        {moveStyle}
        {zoomStyle}
      </style>
    </>
  )
}
