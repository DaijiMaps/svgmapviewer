/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import { Container } from './Container'
import { likeStyle } from './Like'
import { UiRoot } from './Ui'
import {
  margin_0_padding_0,
  position_absolute_left_0_top_0,
  width_100vw_height_100svh,
} from './lib/css'

function App(): ReactNode {
  return (
    <>
      <Container />
      <UiRoot />
      <style>{style}</style>
    </>
  )
}

const style = `
:root {
  ${margin_0_padding_0}
  font-family: sans-serif;
  font-weight: lighter;
  box-sizing: border-box;

  /* XXX */
  touch-action: none;
  /* XXX */
  user-select: none; /* Standard syntax */
}

html,
body {
  margin: 0;
  padding: 0;
  box-sizing: border-box;

  /* XXX */
  touch-action: none;
  /* XXX */
  user-select: none; /* Standard syntax */
}

html,
body,
:root {
  background-color: darkgray;
}

.detail,
.balloon,
.balloon-container,
.container {
  box-sizing: border-box;

  /* XXX */
  touch-action: none;
  /* XXX */
  user-select: none; /* Standard syntax */
}

.right,
.header,
.footer {
  box-sizing: border-box;
}

body {
  ${width_100vw_height_100svh}
  ${position_absolute_left_0_top_0}
  overflow: hidden;
  touch-action: none;
}

div {
  transform-origin: 50% 50%;
}

svg {
  display: block;
}

ul {
  list-style: none;
}

h1,
h2,
h3,
h4,
h5 {
  font-family: sans-serif;
  font-weight: lighter;
}

a:link {
  text-decoration: none;
}

#viewer,
.content.svg,
#ui {
  contain: strict;
}

.map,
.map > * {
  contain: content;
}

${likeStyle}
`

export default App
