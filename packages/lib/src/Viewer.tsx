import { PropsWithChildren } from 'react'
import { Container } from './Container'
import { usePointer } from './lib/pointer-react'
import { Ui } from './Ui'

export function Viewer(props: Readonly<PropsWithChildren>) {
  // eslint-disable-next-line functional/no-expression-statements
  usePointer()

  return (
    <>
      <Container {...props} />
      <Ui />
    </>
  )
}
