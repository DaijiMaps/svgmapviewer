import { PropsWithChildren } from 'react'
import { Container } from './Container'
import { Ui } from './Ui'

export function Viewer(props: Readonly<PropsWithChildren>) {
  return (
    <>
      <Container {...props} />
      <Ui />
    </>
  )
}
