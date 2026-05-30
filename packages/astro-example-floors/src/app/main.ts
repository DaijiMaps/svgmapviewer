/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
import { createAtom } from '@xstate/store'
import type { SvgMapViewerConfigUser, Info } from 'svgmapviewer'
import { svgmapviewer } from 'svgmapviewer-app-floors'
import type { SearchInfo } from 'svgmapviewer/address'

import { RenderInfo as renderInfo } from './render'

const infoMapAtom = createAtom<null | Map<string, Info>>(null)

const getInfoMap = (infos: readonly SearchInfo[]) => {
  const tmp = infoMapAtom.get()
  if (tmp !== null) return tmp
  const m = new Map(infos.map((si) => [si.name, si.info] as const))
  infoMapAtom.set(m)
  return m
}

export function main(props: Readonly<SvgMapViewerConfigUser>) {
  const getInfoByName = (name: string) => {
    const m = getInfoMap(props.searchInfos ?? [])
    const info = m.get(name)
    return info || null
  }
  svgmapviewer({
    ...props,

    getInfoByName,
    renderInfo,
  })
}

//main()
