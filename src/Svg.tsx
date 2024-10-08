import { useSelector } from '@xstate/react'
import { PropsWithChildren } from 'react'
import { boxToViewBox } from './lib/box/prefixed'
import { PointerRef, selectLayout } from './lib/pointer-xstate'
import './Svg.css'

interface SvgProps {
  _pointerRef: PointerRef
}

export const Svg = (props: Readonly<PropsWithChildren<SvgProps>>) => {
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
