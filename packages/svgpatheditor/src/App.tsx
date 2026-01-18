/* eslint-disable @typescript-eslint/no-unused-vars */
import type { ReactNode } from 'react'

import { Canvas } from './lib/canvas/Root'

export interface AppProps {
  title: string
}

export function App(_props: Readonly<AppProps>): ReactNode {
  return (
    <div>
      <Canvas size={{ x: 140, y: 140 }} unit={10} />
    </div>
  )
}
