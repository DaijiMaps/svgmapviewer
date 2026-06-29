import { Fragment, type CSSProperties, type ReactNode } from 'react'

import { type LabelText } from '../../../types'
import { useShadowRoot } from '../../dom'
import type { FloorLabelsProps } from './types'

export function RenderFloorLabels(props: FloorLabelsProps): ReactNode {
  // eslint-disable-next-line functional/no-expression-statements
  useShadowRoot(
    `map-floors-html-labels-${props.fidx}`,
    <RenderFloorLabelsRoot {...props} />,
    'map-floors-html'
  )
  return <div id={`map-floors-html-labels-${props.fidx}`} />
}

function RenderFloorLabelsRoot({ labels }: FloorLabelsProps): ReactNode {
  return (
    <div className="labels">
      {labels?.map((_text, idx) => (
        <Fragment key={idx}>
          <RenderFloorLabel _text={_text} />
        </Fragment>
      ))}
      <style>{labelsStyle}</style>
    </div>
  )
}

type LabelProps = Readonly<{
  _text: LabelText
}>

function RenderFloorLabel({ _text }: LabelProps): ReactNode {
  return (
    <div
      className="label"
      style={
        {
          '--x': (_text.attrs?.['x'] || 0) + 'px',
          '--y': (_text.attrs?.['y'] || 0) + 'px',
          '--rotate': (_text.attrs?.['rotate'] || 0) + 'deg',
          '--scale2': (_text.attrs?.['scale2'] || 1) + '',
          '--scale1': (_text.attrs?.['scale1'] || 1) + '',
        } as CSSProperties
      }
    >
      {_text.children?.map((_tspan, idx) => (
        <p key={idx}>{_tspan.text ?? ''}</p>
      ))}
    </div>
  )
}

const labelsStyle = `
@property --zoom {
  syntax: '<number>';
  inherits: false;
  initial-value: 1;
}
.labels {
  /* default */
  --zoom: 1;
  --zoom-zoom: 1;
}
.label {
  position: absolute;
  transform-origin: 0% 0%;
  /*
  transform: translate(var(--x), var(--y)) rotate(var(--rotate)) scale(var(--zoom-z-inv)) scale(var(--scale2)) scale(var(--scale1)) translate(-50%, -50%);
  */
  transform: translate(var(--x), var(--y)) rotate(var(--rotate)) scale(var(--scale2)) scale(var(--scale1)) translate(-50%, -50%);
  text-align: center;
  font-family: 'Noto Sans JP', 'Noto Sans', 'sans-serif' !important;
  font-weight: 200 !important;
}
.label > p {
  margin: 0;
}
/*
@keyframes xxx-label-scale {
  from {
    --zoom: 1;
  }
  to {
    --zoom: var(--zoom-z-inv-b);
  }
}
*/
`
