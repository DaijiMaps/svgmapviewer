import { type ReactNode, useContext } from 'react'
import './Footer.css'
import { uiSend, useOpenCloseFooter } from './lib/ui-xstate'
import { SvgMapViewerConfigContext } from './Root'

export function Footer(): ReactNode {
  const config = useContext(SvgMapViewerConfigContext)
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
      */}
      <p>{config.copyright}</p>
    </div>
  )
}

export function FooterStyle(): ReactNode {
  const { open, animating } = useOpenCloseFooter()

  if (!animating) {
    const b = !open ? 0 : 1

    return (
      <>{`
.footer {
  transform-origin: 50% 100%;
  opacity: ${b};
  transform: scale(${b});
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
    transform: scale(${a}) translate3d(0px, 0px, 0px);
  }
  to {
    opacity: ${b};
    transform: scale(${b}) translate3d(0px, 0px, 0px);
  }
}
`}</>
    )
  }
}
