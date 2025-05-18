import { forwardRef, PropsWithChildren } from 'react'
import './Container.css'
import { pointerActor } from './lib/pointer-react'
import {
  useDragStyle,
  useInitStyle,
  useModeStyle,
  useMoveStyle,
  useScrollStyle,
  useZoomStyle,
} from './lib/style'

export const Container = forwardRef<HTMLDivElement, PropsWithChildren>(
  (props, ref) => {
    return (
      <div
        ref={ref}
        className="container"
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
      <ScrollStyle />
      <ModeStyle />
      <DragStyle />
      <MoveStyle />
      <ZoomStyle />
    </>
  )
}

function InitStyle() {
  const style = useInitStyle()
  return <style id="init-style">{style}</style>
}

function ScrollStyle() {
  const style = useScrollStyle()
  return <style id="scroll-style">{style}</style>
}

function ModeStyle() {
  const style = useModeStyle()
  return <style id="mode-style">{style}</style>
}

function DragStyle() {
  const style = useDragStyle()
  return <style id="drag-style">{style}</style>
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
