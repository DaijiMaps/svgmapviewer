/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'

export function GuidePost(): ReactNode {
  return (
    <path
      id="Xguide-post"
      d={guidePostPath}
      fill="none"
      stroke="black"
      strokeWidth="0.05"
    />
  )
}

export const guidePostPath = 'm 0,0 v -1.4 h -0.7 m 0,0.6 h 0.7 m 0,-0.3 h 0.7'
