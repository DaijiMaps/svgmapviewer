/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { useEffect, type ReactNode } from 'react'

import { useConfig } from './config'
import {
  box_sizing_border_box,
  margin_0_padding_0,
  position_absolute_left_0_top_0,
  touch_action_none,
  width_100vw_height_100svh,
} from './lib/css'
import { properties } from './lib/css/property'
import { notifyGlobal } from './lib/event-global'
import { likeStyle } from './lib/like/Like'
import { useRendered } from './lib/style/style-react'
import { Ui } from './lib/ui/Ui'
import { Container } from './lib/viewer/Container'
import { type OsmRenderMapProps } from './types'

function App(): ReactNode {
  const cfg = useConfig()
  const backgroundColor =
    cfg.cartoConfig?.backgroundColor ?? cfg.backgroundColor ?? 'darkgray'

  const props: Readonly<OsmRenderMapProps> = {
    data: cfg,
    render: cfg,
    carto: cfg.cartoConfig,
    floors: cfg.floorsConfig,
  }

  useInitialRendering()

  return (
    <>
      <Container {...props}>{cfg.renderMap(props)}</Container>
      <Ui />
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
html, body {
  overflow: hidden;
}
body {
  ${position_absolute_left_0_top_0}
  ${width_100vw_height_100svh}
  ${margin_0_padding_0}
  ${box_sizing_border_box}
  ${touch_action_none}
  background-color: darkgray;
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
${properties}
`

// XXX
// XXX
// XXX
// XXX
// XXX
function useInitialRendering() {
  const rendered = useRendered()

  useEffect(() => {
    requestAnimationFrame(() => notifyGlobal.rendered())
  }, [rendered])
}
// XXX
// XXX
// XXX
// XXX
// XXX

export default App
