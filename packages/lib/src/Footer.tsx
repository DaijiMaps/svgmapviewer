/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import { svgMapViewerConfig } from './lib'
import {
  flex_column_center_center,
  position_absolute_left_0_bottom_0,
  user_select_none,
} from './lib/css'
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
      <style>
        {style}
        <FooterStyle />
      </style>
    </div>
  )
}

const style = `
.footer {
  ${position_absolute_left_0_bottom_0}
  ${flex_column_center_center}
  padding: 0.4em;
  font-size: xx-small;
  pointer-events: none;
}

h2,
p {
  ${user_select_none}
  pointer-events: initial;
}

h2 {
  font-size: x-small;
  margin: 0;
}

p {
  margin: 0.25em;
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
  will-change: opacity, transform;
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
  will-change: opacity, transform;
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
