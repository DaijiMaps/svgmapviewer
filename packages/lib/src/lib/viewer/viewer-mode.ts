/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
import { createAtom, type Atom } from '@xstate/store'

import { notifyStyle } from '../event-style'
import type { ViewerMode } from './viewer-types'

export const viewerMode: Atom<ViewerMode> = createAtom<ViewerMode>('panning')

viewerMode.subscribe((mode: ViewerMode) => notifyStyle.mode(mode))

// quick zoom

export const quickZoomAtom: Atom<boolean> = createAtom(false)
