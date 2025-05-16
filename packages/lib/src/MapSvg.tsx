import { useSelector } from '@xstate/react'
import { PropsWithChildren } from 'react'
import { boxToViewBox } from './lib/box/prefixed'
import { PointerRef, selectLayoutSvg } from './lib/pointer-xstate'
import './MapSvg.css'

interface MapSvgProps {
  _pointerRef: PointerRef
}

export const MapSvg = (props: Readonly<PropsWithChildren<MapSvgProps>>) => {
  const { _pointerRef: pointerRef } = props

  const layoutSvg = useSelector(pointerRef, selectLayoutSvg)

  // XXX truncate viewBox (1234.5678901234567890 to 1234.56)
  // XXX (too much precision degrades SVG rendering performance)
  return (
    <div className="content svg">
      <svg
        viewBox={boxToViewBox(layoutSvg).replaceAll(/([.]\d\d)\d*/g, '$1')}
        width="100%"
        height="100%"
      >
        {props.children}
      </svg>
    </div>
  )
}
