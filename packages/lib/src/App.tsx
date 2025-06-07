/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'
import './App.css'
import { Container } from './Container'
import { UiRoot } from './UiRoot'

function App(): ReactNode {
  return (
    <>
      <Container />
      {/* XXX Ui -> UiRoot */}
      <UiRoot />
    </>
  )
}

export default App
