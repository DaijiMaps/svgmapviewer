import { useContext } from 'react'
import './App.css'
import { SvgMapViewerConfigContext } from './svgmapviewer'
import { Viewer } from './Viewer'

function App() {
  const config = useContext(SvgMapViewerConfigContext)

  return (
    <Viewer>
      <use href={`#${config.map}`} />
    </Viewer>
  )
}

export default App
