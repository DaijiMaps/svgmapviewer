import { useSelector } from '@xstate/react'
import { useMemo } from 'react'
import { svgMapViewerConfig as cfg } from './config'
import { Matrix } from './matrix'
import { matrixEmpty, matrixToString } from './matrix/prefixed'
import { pointerActor } from './pointer-react'
import { selectAnimating, selectAnimation } from './pointer-xstate'

export function useMoveStyle() {
  const animation = useSelector(pointerActor, selectAnimation)
  const animating = useSelector(pointerActor, selectAnimating)

  const style = useMemo(
    () =>
      animation === null || animation.move === null || !animating
        ? ''
        : css(animation.move.q as Matrix),
    [animation, animating]
  )
  return style
}

export function useZoomStyle() {
  const animation = useSelector(pointerActor, selectAnimation)
  const animating = useSelector(pointerActor, selectAnimating)

  const style = useMemo(
    () =>
      animation === null || animation.zoom === null || !animating
        ? ''
        : css(animation.zoom.q as Matrix),
    [animation, animating]
  )
  return style
}

export const css = (q: Matrix) => {
  const p = matrixEmpty

  return `
.container {
  will-change: transform;
  animation: xxx ${cfg.animationDuration}ms ease;
}
.content > .poi {
/*
  display: none;
*/
}
@keyframes xxx {
  from {
    transform-origin: left top;
    transform: ${matrixToString(p)};
  }
  to {
    transform-origin: left top;
    transform: ${matrixToString(q)};
  }
}
`
}
