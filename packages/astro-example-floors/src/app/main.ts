import { createAtom } from '@xstate/store'
/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
import type { SvgMapViewerConfigUser } from 'svgmapviewer'
import { svgmapviewer } from 'svgmapviewer-app-floors'
import type { SearchInfo } from 'svgmapviewer/address'

import { RenderInfo as renderInfo } from './render'
import type { Info } from './types'

const infoMapAtom = createAtom<null | Map<string, Info>>(null)

const getInfoMap = (infos: readonly SearchInfo[]) => {
  const tmp = infoMapAtom.get()
  if (tmp !== null) return tmp
  const m = new Map((infos ?? []).map((si) => [si.name, si.info] as const))
  infoMapAtom.set(m)
  return m
}

export function main(props: Readonly<SvgMapViewerConfigUser>) {
  const infos = props.searchInfos
  const getInfoByName = (name: string) => {
    const m = getInfoMap(infos ?? [])
    const info = m.get(name)
    if (info) return info
    return {
      tag: '',
      title: '',
    } satisfies Info
  }
  svgmapviewer({
    ...props,

    getInfoByName,
    renderInfo,
  })
}

//main()
