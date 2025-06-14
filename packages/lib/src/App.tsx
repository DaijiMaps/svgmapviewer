/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import { svgMapViewerConfig } from './lib'
import {
  box_sizing_border_box,
  margin_0_padding_0,
  position_absolute_left_0_top_0,
  touch_action_none,
  width_100vw_height_100svh,
} from './lib/css'
import { likeStyle } from './Like'
import { UiRoot } from './Ui'
import { Viewer } from './Viewer'

function App(): ReactNode {
  const backgroundColor =
    svgMapViewerConfig.cartoConfig?.backgroundColor ?? 'darkgray'

  return (
    <>
      <Viewer />
      <UiRoot />
      <style>
        {style}
        {`body { background-color: ${backgroundColor}; }`}
      </style>
    </>
  )
}

const style = `
:root {
  cursor: move;
  font-family: sans-serif;
  font-weight: lighter;
  user-select: none;
}

body {
  ${position_absolute_left_0_top_0}
  ${width_100vw_height_100svh}
  ${margin_0_padding_0}
  ${box_sizing_border_box}
  ${touch_action_none}
  background-color: darkgray;
  overflow: hidden;
}

svg {
  display: block;
}

ul {
  list-style: none;
}

a:link {
  text-decoration: none;
}

${likeStyle}
`

export default App
