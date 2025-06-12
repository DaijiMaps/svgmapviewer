/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import { svgMapViewerConfig } from './lib'
import { uiSend, useOpenCloseFooter } from './lib/ui-xstate'

export function Footer(): ReactNode {
  const config = svgMapViewerConfig
  //const mode = useSelector(viewerActor, selectMode)

  //const vecs = useTouchesVecs()
  //const z = useTouchesZ()

  return (
    <div
      className="footer"
      // eslint-disable-next-line functional/no-return-void
      onAnimationEnd={() => uiSend({ type: 'FOOTER.ANIMATION.END' })}
    >
      {/*
      <p>{`v=${vecs.size};z=${z};touching=${touching}`}</p>
      <h2 className="subtitle">{config.subtitle}</h2>
      */}
      <p>{config.copyright}</p>
      <style>{`@scope {
${style}
}`}</style>
    </div>
  )
}

const style = `
:scope {
  padding: 0.4em;
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: xx-small;
  pointer-events: none;
}

.footer > p {
  margin: 0.25em;
}

.footer > * {
  pointer-events: initial;
}

.footer h2,
.footer p {
  user-select: none;
  -webkit-user-select: none;
}

.mode {
  font-size: large;
  margin: 0.4em;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
}

.mode-item {
  margin: 0 1.6px;
  padding: 0.4em;
  border: 1.6px black solid;
}
.mode-item.selected {
  pointer-events: none;
}
.mode-item:not(.selected) {
  opacity: 0.375;
}
.mode-item > svg {
  display: block;
  width: 1.6em;
  height: 1.6em;
  pointer-events: none;
}
.mode-item > svg > path {
  stroke: black;
  stroke-width: 0.4px;
  fill: none;
}

.footer > h2 {
  font-size: x-small;
  margin: 0;
}
`

export function FooterStyle(): ReactNode {
  const { open, animating } = useOpenCloseFooter()

  if (!animating) {
    const b = !open ? 0 : 1

    return (
      <>{`
.footer {
  transform-origin: 50% 100%;
  opacity: ${b};
  transform: translate(calc(50vw - 50%), 0%) scale(${b});
  will-change: opacity transform;
}
`}</>
    )
  } else {
    const [a, b] = !open ? [1, 0] : [0, 1]
    const t = !open
      ? 'cubic-bezier(0.25, 0.25, 0.25, 1)'
      : 'cubic-bezier(0.75, 0, 0.75, 0.75)'

    return (
      <>{`
.footer {
  transform-origin: 50% 100%;
  animation: xxx-footer 300ms ${t};
  will-change: opacity transform;
}

@keyframes xxx-footer {
  from {
    opacity: ${a};
    transform: translate(calc(50vw - 50%), 0%) scale(${a}) translate3d(0px, 0px, 0px);
  }
  to {
    opacity: ${b};
    transform: translate(calc(50vw - 50%), 0%) scale(${b}) translate3d(0px, 0px, 0px);
  }
}
`}</>
    )
  }
}
