import { forwardRef, PropsWithChildren } from 'react'
import './Container.css'
import {
  pointerActor,
  sendPointerDown,
  sendPointerMove,
  sendPointerUp,
  sendTouchEnd,
  sendTouchMove,
  sendTouchStart,
} from './lib/pointer-react'
import { useInitStyle, useMoveStyle, useZoomStyle } from './lib/style'

export const Container = forwardRef<HTMLDivElement, PropsWithChildren>(
  (props, ref) => {
    return (
      <div
        ref={ref}
        className="container"
        // eslint-disable-next-line functional/no-return-void
        onPointerDown={(ev) => sendPointerDown(ev)}
        // eslint-disable-next-line functional/no-return-void
        onPointerMove={(ev) => sendPointerMove(ev)}
        // eslint-disable-next-line functional/no-return-void
        onPointerUp={(ev) => sendPointerUp(ev)}
        // eslint-disable-next-line functional/no-return-void
        onTouchStart={(ev) => sendTouchStart(ev)}
        // eslint-disable-next-line functional/no-return-void
        onTouchMove={(ev) => sendTouchMove(ev)}
        // eslint-disable-next-line functional/no-return-void
        onTouchEnd={(ev) => sendTouchEnd(ev)}
        // eslint-disable-next-line functional/no-return-void
        onAnimationEnd={() => pointerActor.send({ type: 'ANIMATION.END' })}
      >
        {props.children}
      </div>
    )
  }
)

export function ContainerStyle() {
  return (
    <>
      <InitStyle />
      <MoveStyle />
      <ZoomStyle />
    </>
  )
}

function InitStyle() {
  const style = useInitStyle()
  return <style id="init-style">{style}</style>
}

function MoveStyle() {
  const style = useMoveStyle()
  return <style id="move-style">{style}</style>
}

function ZoomStyle() {
  const style = useZoomStyle()
  return <style id="zoom-style">{style}</style>
}

/*
function MapHtmlStyle(props: Readonly<{ _pointerRef: PointerRef }>) {
  const { _pointerRef: pointerRef } = props
  const style = useMapHtmlStyle(pointerRef)
  return <style id="map-html-style">{style}</style>
}
*/
