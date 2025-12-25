import { Doc } from '@effect/printer'
import type {
  _Crs,
  _Feature,
  _FeatureCollection,
  _Features,
  _GeoJSON,
  _Properties,
} from './geojson-types'

export function printProperties(obj: Readonly<_Properties>): Doc.Doc<never> {
  const doc = Doc.vsep([
    Doc.text(`{`),
    Doc.indent(
      Doc.vsep(Object.entries(obj).map(([k, v]) => Doc.text(`${k}: ${v}`))),
      2
    ),
    Doc.text(`}`),
  ])
  return doc
}

export function printCrs(obj: Readonly<_Crs>): Doc.Doc<never> {
  const doc = Doc.vsep([
    Doc.text(`{`),
    Doc.indent(
      Doc.vsep([
        Doc.text(`type: '${obj.type}',`),
        printProperties(obj.properties),
      ]),
      2
    ),
    Doc.text(`}`),
  ])
  return doc
}

export function printFeature(obj: Readonly<_Feature>): Doc.Doc<never> {
  const doc = Doc.vsep([
    Doc.text(`{`),
    Doc.indent(
      Doc.vsep([
        Doc.text(`type: xxx,`),
        Doc.text(`properties: `),
        printProperties(obj.properties),
        Doc.text(`,`),
        Doc.text(`geometry: {},`),
      ]),
      2
    ),
    Doc.text(`  // Feature`),
    Doc.text(`}`),
  ])
  return doc
}

export function printFeatureCollection(
  obj: Readonly<_FeatureCollection>
): Doc.Doc<never> {
  const doc = Doc.vsep([
    Doc.text(`{`),
    Doc.indent(
      Doc.vsep([
        Doc.text(`type: ${obj.type}`),
        Doc.text(`features: [`),
        Doc.indent(Doc.vsep(obj.features.map((o) => printFeature(o))), 2),
        Doc.text(`],`),
      ]),
      2
    ),
    Doc.text(`}`),
  ])
  return doc
}

export function printFeatures(objs: Readonly<_Features>): Doc.Doc<never> {
  const doc = Doc.vsep([
    Doc.text(`{`),
    Doc.indent(
      Doc.vcat(
        objs.map((obj) =>
          obj.type === 'Feature'
            ? printFeature(obj)
            : printFeatureCollection(obj)
        )
      ),
      2
    ),
    Doc.text(`}`),
  ])
  return doc
}

export function printGeoJSON(obj: Readonly<_GeoJSON>): Doc.Doc<never> {
  const doc = Doc.vsep([
    Doc.text(`{`),
    Doc.indent(
      Doc.vsep([
        Doc.text(`type: '${obj.type}',`),
        Doc.text(`name: '${obj.name}',`),
        obj.crs === undefined ? Doc.empty : printCrs(obj.crs),
        printFeatures(obj.features),
      ]),
      2
    ),
    Doc.text(`}`),
  ])
  return doc
}
