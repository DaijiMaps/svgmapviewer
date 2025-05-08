import { forwardRef, PropsWithChildren } from 'react'
import './Container.css'
import { PointerRef } from './lib/pointer-xstate'
import {
  useDragStyle,
  useModeStyle,
  useMoveStyle,
  useScrollStyle,
  useZoomStyle,
} from './lib/style'

export const Container = forwardRef<HTMLDivElement, PropsWithChildren>(
  (props, ref) => {
    return (
      <div ref={ref} className="container">
        {props.children}
      </div>
    )
  }
)

export function ContainerStyle(props: Readonly<{ _pointerRef: PointerRef }>) {
  const { _pointerRef: pointerRef } = props

  const moveStyle = useMoveStyle(pointerRef)
  const zoomStyle = useZoomStyle(pointerRef)
  const scrollStyle = useScrollStyle(pointerRef)
  const modeStyle = useModeStyle(pointerRef)
  const dragStyle = useDragStyle(pointerRef)

  return (
    <style>
      {scrollStyle}
      {modeStyle}
      {dragStyle}
      {moveStyle}
      {zoomStyle}
    </style>
  )
}
