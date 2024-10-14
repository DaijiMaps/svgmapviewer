import { useSelector } from '@xstate/react'
import { PropsWithChildren } from 'react'
import { boxToViewBox } from './lib/box/prefixed'
import { PointerRef, selectLayout } from './lib/pointer-xstate'
import './MapSvg.css'

interface MapSvgProps {
  _pointerRef: PointerRef
}

export const MapSvg = (props: Readonly<PropsWithChildren<MapSvgProps>>) => {
  const { _pointerRef: pointerRef } = props

  const layout = useSelector(pointerRef, selectLayout)

  return (
    <svg
      className="content svg"
      viewBox={boxToViewBox(layout.svg)}
      // eslint-disable-next-line functional/no-return-void
      onAnimationEnd={() => pointerRef.send({ type: 'ANIMATION.END' })}
    >
      {props.children}
    </svg>
  )
}
