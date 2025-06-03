/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import './App.css'
import { Container } from './Container'
import { Ui } from './Ui'

function App(): ReactNode {
  return (
    <>
      <Container />
      {/* XXX Ui -> UiRoot */}
      <Ui />
    </>
  )
}

export default App
