import { PointerRef } from './lib/pointer-xstate'
import {
  useDragStyle,
  useModeStyle,
  useMoveStyle,
  useScrollStyle,
  useZoomStyle,
} from './lib/style'

export function Style(props: Readonly<{ _pointerRef: PointerRef }>) {
  const { _pointerRef: pointerRef } = props

  const scrollStyle = useScrollStyle(pointerRef)
  const modeStyle = useModeStyle(pointerRef)
  const dragStyle = useDragStyle(pointerRef)
  const moveStyle = useMoveStyle(pointerRef)
  const zoomStyle = useZoomStyle(pointerRef)

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
