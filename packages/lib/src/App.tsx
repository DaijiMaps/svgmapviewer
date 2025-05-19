import { useContext } from 'react'
import './App.css'
import { Container } from './Container'
import { SvgMapViewerConfigContext } from './Root'
import { Ui } from './Ui'

function App() {
  const config = useContext(SvgMapViewerConfigContext)

  return (
    <>
      <Container>
        <use href={`#${config.map}`} />
      </Container>
      <Ui />
    </>
  )
}

export default App
