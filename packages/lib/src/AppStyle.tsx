/* eslint-disable functional/functional-parameters */
import type { ReactNode } from 'react'

// XXX
// XXX de-duplicate
// XXX

export function AppCss(): ReactNode {
  return (
    <style>
      {`
:root {
  margin: 0;
  padding: 0;
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
  width: 100vw;
  height: 100vh;
  height: 100svh;
  position: absolute;
  left: 0;
  top: 0;
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
#map-svg,
#map-html {
  contain: content;
}
.map,
.map > * {
  contain: content;
}
`}
    </style>
  )
}
