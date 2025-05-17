import { forwardRef, PropsWithChildren } from 'react'
import './Container.css'
import { PointerRef } from './lib/pointer-xstate'
import {
  useDragStyle,
  useInitStyle,
  useMapHtmlStyle,
  useModeStyle,
  useMoveStyle,
  useScrollStyle,
  useZoomStyle,
} from './lib/style'
import { UiRef } from './lib/ui-xstate'

export const Container = forwardRef<
  HTMLDivElement,
  PropsWithChildren<{
    _pointerRef: PointerRef
  }>
>((props, ref) => {
  return (
    <div
      ref={ref}
      className="container"
      // eslint-disable-next-line functional/no-return-void
      onAnimationEnd={() => props._pointerRef.send({ type: 'ANIMATION.END' })}
    >
      {props.children}
    </div>
  )
})

export function ContainerStyle(
  props: Readonly<{ _pointerRef: PointerRef; _uiRef: UiRef }>
) {
  const { _pointerRef: pointerRef, _uiRef: uiRef } = props

  return (
    <>
      <InitStyle _pointerRef={pointerRef} />
      <ScrollStyle _pointerRef={pointerRef} />
      <ModeStyle _pointerRef={pointerRef} _uiRef={uiRef} />
      <DragStyle _pointerRef={pointerRef} />
      <MoveStyle _pointerRef={pointerRef} />
      <ZoomStyle _pointerRef={pointerRef} />
      <MapHtmlStyle _pointerRef={pointerRef} />
    </>
  )
}

function InitStyle(props: Readonly<{ _pointerRef: PointerRef }>) {
  const { _pointerRef: pointerRef } = props
  const style = useInitStyle(pointerRef)
  return <style id="init-style">{style}</style>
}

function ScrollStyle(props: Readonly<{ _pointerRef: PointerRef }>) {
  const { _pointerRef: pointerRef } = props
  const style = useScrollStyle(pointerRef)
  return <style id="scroll-style">{style}</style>
}

function ModeStyle(
  props: Readonly<{ _pointerRef: PointerRef; _uiRef: UiRef }>
) {
  const { _pointerRef: pointerRef, _uiRef: uiRef } = props
  const style = useModeStyle(pointerRef, uiRef)
  return <style id="mode-style">{style}</style>
}

function DragStyle(props: Readonly<{ _pointerRef: PointerRef }>) {
  const { _pointerRef: pointerRef } = props
  const style = useDragStyle(pointerRef)
  return <style id="drag-style">{style}</style>
}

function MoveStyle(props: Readonly<{ _pointerRef: PointerRef }>) {
  const { _pointerRef: pointerRef } = props
  const style = useMoveStyle(pointerRef)
  return <style id="move-style">{style}</style>
}

function ZoomStyle(props: Readonly<{ _pointerRef: PointerRef }>) {
  const { _pointerRef: pointerRef } = props
  const style = useZoomStyle(pointerRef)
  return <style id="zoom-style">{style}</style>
}

function MapHtmlStyle(props: Readonly<{ _pointerRef: PointerRef }>) {
  const { _pointerRef: pointerRef } = props
  const style = useMapHtmlStyle(pointerRef)
  return <style id="map-html-style">{style}</style>
}
