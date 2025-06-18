import { shadowRootMap } from './dom'

export const UI_ROOT_ID = 'ui'

// XXX
export function resetDetailScroll(): void {
  const root = shadowRootMap.get('detail')
  if (root === undefined) {
    return
  }
  const e = root.querySelector('.detail')
  if (e === null) {
    return
  }
  e.scroll(0, 0)
}
