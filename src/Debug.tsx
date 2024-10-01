import './Debug.css'
import { fromMatrixSvg, toMatrixSvg } from './lib/coord'
import { PointerRef } from './lib/pointer-xstate'
import { SearchRef } from './lib/search-xstate'
import { showBox, showNumber, showPoint } from './lib/show'
import { transformPoint } from './lib/transform'
import { UiRef } from './lib/ui-xstate'

interface DebugProps {
  _container: null | HTMLDivElement
  _uiRef: UiRef
  _pointerRef: PointerRef
  _searchRef: SearchRef
}

export const Debug = (props: Readonly<DebugProps>) => {
  const {
    _container: container,
    _uiRef: uiRef,
    _pointerRef: pointerRef,
    _searchRef: searchRef,
  } = props
  const ui = uiRef.getSnapshot()
  const pointer = pointerRef.getSnapshot()
  const search = searchRef.getSnapshot()
  const {
    context: { layout },
  } = pointer
  const touches = pointer.context.touches

  if (!pointer.context.debug) {
    return <></>
  }

  const m = toMatrixSvg(layout)
  const invm = fromMatrixSvg(layout)

  const focusSvg = transformPoint(m, pointer.context.focus)
  const focus2 = transformPoint(invm, focusSvg)

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
        <li>focus: {showPoint(pointer.context.focus)}</li>
        <li>focusSvg: {showPoint(focusSvg)}</li>
        <li>focus2: {showPoint(focus2)}</li>
        <li>expand: {showNumber(pointer.context.expand)}</li>
        {container !== null && (
          <>
            <li>container.scrollLeft: {showNumber(container.scrollLeft)}</li>
            <li>container.scrollTop: {showNumber(container.scrollTop)}</li>
          </>
        )}
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
