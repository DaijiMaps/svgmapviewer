import { useContext } from 'react'
import './Footer.css'
import { PointerSend } from './lib/xstate-pointer'
import { SvgMapViewerConfigContext } from './svgmapviewer'

interface FooterProps {
  _pointerSend: PointerSend
}

export const Footer = (props: Readonly<FooterProps>) => {
  const config = useContext(SvgMapViewerConfigContext)

  return (
    <div className="footer">
      <p
        // eslint-disable-next-line functional/no-return-void
        onClick={() => props._pointerSend({ type: 'DEBUG' })}
      >
        {config.copyright}
      </p>
    </div>
  )
}
