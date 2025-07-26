/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import {
  flex_row_center_center,
  pointer_events_none,
  position_absolute_left_0_top_0,
} from '../css'
import { useShadowRoot } from '../dom'

export function Left(): ReactNode {
  useShadowRoot('left', <LeftContent />, 'ui')

  return <div id="left" />
}

function LeftContent(): ReactNode {
  return (
    <div className="ui-content left bottom">
      <style>{style}</style>
    </div>
  )
}

const style = `
.left {
  ${position_absolute_left_0_top_0}
  ${flex_row_center_center}
  padding: 0.4em;
  font-size: smaller;
  ${pointer_events_none}

  transform-origin: 100% 50%;
}

.left {
  top: initial;
  bottom: 0;
  align-items: end;

  transform-origin: 100% 100%;
}
`
