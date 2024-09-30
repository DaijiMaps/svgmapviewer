import { PropsWithChildren, useRef } from 'react'
import { Container } from './Container'
import { Debug } from './Debug'
import { Detail } from './Detail'
import { Footer, FooterStyle } from './Footer'
import { Guides } from './Guides'
import { Header, HeaderStyle } from './Header'
import { usePointer } from './lib/react-pointer'
import { useUi } from './lib/react-ui'
import { searchRef } from './lib/search'
import {
  dragStyle,
  modeStyle,
  moveStyle,
  scrollStyle,
  useZoomStyle,
} from './lib/style'
import { Shadow, ShadowStyle } from './Shadow'
import { Svg } from './Svg'

export const Viewer = (props: Readonly<PropsWithChildren>) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const { pointer, pointerRef } = usePointer(containerRef)

  const { uiRef } = useUi(pointerRef)

  const zoomStyle = useZoomStyle(pointerRef)

  return (
    <>
      <Container ref={containerRef}>
        <Svg _pointerRef={pointerRef}>{props.children}</Svg>
        <Shadow _uiRef={uiRef} />
        <ShadowStyle _uiRef={uiRef} />
        <Detail _pointerRef={pointerRef} _uiRef={uiRef} />
      </Container>
      <Guides _pointerRef={pointerRef} />
      <Header _uiRef={uiRef} _pointerRef={pointerRef} />
      <HeaderStyle _uiRef={uiRef} _pointerRef={pointerRef} />
      <Footer _uiRef={uiRef} _pointerRef={pointerRef} />
      <FooterStyle _uiRef={uiRef} _pointerRef={pointerRef} />
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
        {moveStyle(pointer)}
        {zoomStyle}
      </style>
    </>
  )
}
