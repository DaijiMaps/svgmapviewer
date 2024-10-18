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

  // XXX truncate viewBox (1234.5678 to 1234.56)
  return (
    <svg
      className="content svg"
      viewBox={boxToViewBox(layout.svg).replaceAll(/([.]\d\d)\d*/g, '$1')}
      // eslint-disable-next-line functional/no-return-void
      onAnimationEnd={() => pointerRef.send({ type: 'ANIMATION.END' })}
    >
      {props.children}
    </svg>
  )
}
