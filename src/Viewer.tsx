import { PropsWithChildren, useRef } from 'react'
import { Container } from './Container'
import { Debug } from './Debug'
import { Detail } from './Detail'
import { Footer } from './Footer'
import { Guides } from './Guides'
import { Header } from './Header'
import { usePointer } from './lib/react-pointer'
import { useUi } from './lib/react-ui'
import { search } from './lib/search'
import {
  dragStyle,
  modeStyle,
  moveStyle,
  scrollStyle,
  zoomStyle,
} from './lib/style'
import { Shadow, ShadowStyle } from './Shadow'
import { Svg } from './Svg'

export const Viewer = (props: Readonly<PropsWithChildren>) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const {
    pointer,
    pointerSend,
    pointerRef,
    layout,
    touches,
    sendAnimationEnd,
  } = usePointer(containerRef)

  const { ui, uiRef } = useUi(pointerRef)

  return (
    <>
      <Container ref={containerRef}>
        <Svg onAnimationEnd={sendAnimationEnd} _viewBox={layout.svg}>
          {props.children}
        </Svg>
        <Shadow _uiRef={uiRef} />
        <ShadowStyle _uiRef={uiRef} />
        <Detail _pointerRef={pointerRef} _uiRef={uiRef} />
      </Container>
      <Guides _pointerRef={pointerRef} />
      <Header _pointerSend={pointerSend} />
      <Footer _pointerSend={pointerSend} />
      {pointer.context.debug && (
        <Debug
          _container={containerRef.current}
          _ui={ui}
          _pointer={pointer}
          _touches={touches}
          _search={search.getSnapshot()}
        />
      )}
      <style>
        {scrollStyle(layout)}
        {modeStyle(pointer)}
        {dragStyle(pointer)}
        {moveStyle(pointer)}
        {zoomStyle(pointer)}
      </style>
    </>
  )
}
