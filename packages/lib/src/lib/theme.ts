/* eslint-disable functional/immutable-data */
/* eslint-disable functional/no-conditional-statements */
/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/no-return-void */
import { animate } from 'animejs'

import { svgMapViewerConfig as config } from '../config'
import { ZOOM_DURATION_DETAIL } from './css'
import { uiCbs } from './event-ui'
import { parseRgbString, rgbShadow, rgbToString, toRgbString } from './rgb'

export const getBackgroundColor = (): string =>
  config.cartoConfig?.backgroundColor ?? config.backgroundColor ?? 'darkgray'

const metaTheme =
  document.querySelector('meta[name="theme-color"]') ||
  Object.assign(document.createElement('meta'), {
    name: 'theme-color',
    content: getBackgroundColor(),
  })
if (!metaTheme.parentNode) document.head.appendChild(metaTheme)

const colorCache = new Map<string, string>()
const getColor = () => {
  const p: string = toRgbString(getBackgroundColor())
  const q = colorCache.get(p)
  if (q) return { p, q }
  const q2 = rgbToString(rgbShadow(parseRgbString(p)))
  colorCache.set(p, q2)
  return { p, q: q2 }
}

function transitionTheme(open: boolean) {
  const themeProxy = {
    color:
      metaTheme.getAttribute('content') || toRgbString(getBackgroundColor()),
  }
  const { p, q } = getColor()
  const color = open ? q : p
  const opacity = open ? 0.5 : 1
  animate(themeProxy, {
    color,
    duration: ZOOM_DURATION_DETAIL,
    ease: 'outQuad',
    onRender: () => metaTheme.setAttribute('content', themeProxy.color),
  })
  animate(document.body, {
    backgroundColor: color,
    duration: ZOOM_DURATION_DETAIL,
    ease: 'outQuad',
  })
  animate('.container', {
    opacity,
    duration: ZOOM_DURATION_DETAIL,
    ease: 'outQuad',
  })
}

export function themeStart(): void {
  uiCbs.open.add(() => transitionTheme(true))
  uiCbs.close.add(() => transitionTheme(false))
}
