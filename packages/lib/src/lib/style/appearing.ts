/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { type RefObject } from 'react'

import { timing_opening } from '../css'
import { useStyleRef } from './ref'
import { tag } from './tag'

const appearingStyleRefs: Map<string, HTMLDivElement> = new Map()

export function useAppearingStyleRef(
  ref: Readonly<RefObject<HTMLDivElement | null>>,
  name: string
): void {
  useStyleRef(appearingStyleRefs, ref, name)
}

export function updateAppearingStyleRefs(
  shown: boolean,
  appearing: boolean
): void {
  Array.from(appearingStyleRefs, ([, e]) => {
    tag(e, 'shown', shown)
    tag(e, 'appearing', appearing)
  })
}

export const appearing_style: string = `
.not-shown {
  opacity: 0;
}
.shown {
}
.not-appearing {
}
.appearing {
  will-change: opacity;
  animation: xxx-appearing 2s ${timing_opening};
}
@keyframes xxx-appearing {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
`
