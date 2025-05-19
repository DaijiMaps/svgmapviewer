import { useSelector } from '@xstate/react'
import './Debug.css'
import { fromMatrixSvg, toMatrixSvg } from './lib/coord'
import { pointerActor } from './lib/pointer-react'
import { selectDebug } from './lib/pointer-xstate'
import { SearchRef } from './lib/search-xstate'
import { showBox, showNumber, showPoint } from './lib/show'
import { transformPoint } from './lib/transform'
import { uiActor } from './lib/ui-react'

interface DebugProps {
  _searchRef: SearchRef
}

export const Debug = (props: Readonly<DebugProps>) => {
  const { _searchRef: searchRef } = props
  const ui = uiActor.getSnapshot()
  const pointer = pointerActor.getSnapshot()
  const search = searchRef.getSnapshot()
  const {
    context: { layout },
  } = pointer
  const touches = pointer.context.touches

  const debug = useSelector(pointerActor, selectDebug)

  if (!debug) {
    return <></>
  }

  const m = toMatrixSvg(layout)
  const invm = fromMatrixSvg(layout)

  const cursorSvg = transformPoint(m, pointer.context.cursor)
  const cursor2 = transformPoint(invm, cursorSvg)

  return (
    <div className="debug">
      <p>Debug</p>
      <ul>
        {[
          ['Ui', ui.value.Ui],
          ['Search', search.value],
          ['Pointer', pointer.value.Pointer],
          ['Slider.PointerHandler', pointer.value.Slider.PointerHandler],
          ['Slider.ScrollHandler', pointer.value.Slider.ScrollHandler],
          ['Expander', pointer.value.Expander],
          ['Animator', pointer.value.Animator],
          ['PointerMonitor', pointer.value.PointerMonitor],
          ['TouchMonitor', pointer.value.TouchMonitor],
          ['Mover', pointer.value.Mover],
          ['Zoomer', pointer.value.Zoomer],
          ['Dragger', pointer.value.Dragger],
          ['Panner', pointer.value.Panner],
        ].map(([k, v], i) => (
          <li key={i}>
            {k as string}: {typeof v === 'string' ? v : JSON.stringify(v)}
          </li>
        ))}
        <li>cursor: {showPoint(pointer.context.cursor)}</li>
        <li>cursorSvg: {showPoint(cursorSvg)}</li>
        <li>cursor2: {showPoint(cursor2)}</li>
        <li>expand: {showNumber(pointer.context.expand)}</li>
        <li>layout.scroll: {showBox(layout.scroll)}</li>
        <li>layout.svgOffset: {showPoint(layout.svgOffset)}</li>
        <li>layout.svgScale: {showNumber(layout.svgScale.s)}</li>
        <li>layout.svg: {showBox(layout.svg)}</li>
        <li>touches.dists: {touches.dists.map(showNumber).join(' ')}</li>
        <li>touches.z: {touches.z === null ? '-' : showNumber(touches.z)}</li>
        {/*
        <li>layout.config.container: {showBox(layout.config.container)}</li>
        <li>layout.config.svg: {showBox(layout.config.svg)}</li>
        <li>layout.config.svgOffset: {showPoint(layout.config.svgOffset)}</li>
        <li>layout.config.svgScale: {showNumber(layout.config.svgScale.s)}</li>
        <li>layout.config.fontSize: {showNumber(layout.config.fontSize)}</li>
        */}
      </ul>
    </div>
  )
}
