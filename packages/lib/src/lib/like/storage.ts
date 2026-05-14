import { decodeContext, encodeContext } from './schema'
import type { ID, LikesContext } from './types'

const emptyContext: LikesContext = {
  ids: new Set<ID>(),
}

export function loadContext(key: string): LikesContext {
  const jsonstr = localStorage.getItem(key)
  if (jsonstr === null) {
    return emptyContext
  }
  return decodeContext(jsonstr)
}

export function saveContext(
  key: string,
  context: Readonly<LikesContext>
  // eslint-disable-next-line functional/no-return-void
): void {
  const jsonstr = encodeContext(context)
  // eslint-disable-next-line functional/no-expression-statements
  localStorage.setItem(key, jsonstr)
}
