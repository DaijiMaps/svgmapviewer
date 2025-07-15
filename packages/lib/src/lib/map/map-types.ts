import { type Layout } from '../layout-types'

type RenderMapContext = {
  layout: Readonly<Layout>
  zoom: number
  z: null | number
}

type RenderMapEvent =
  | ({ type: 'ZOOM' } & RenderMapContext)
  | { type: 'LAYOUT'; layout: Layout }

export { type RenderMapContext, type RenderMapEvent }
