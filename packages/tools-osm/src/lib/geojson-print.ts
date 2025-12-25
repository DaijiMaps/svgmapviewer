import { Doc } from '@effect/printer'
import type {
  _Coordinates,
  _Crs,
  _Feature,
  _FeatureCollection,
  _Features,
  _GeoJSON,
  _Geometry,
  _Properties,
} from './geojson-types'

export function printValue(v: null | number | string): Doc.Doc<never> {
  return v === null
    ? Doc.text('null')
    : typeof v === 'number'
      ? Doc.text(`${v}`)
      : Doc.text(`'${v}'`)
}

export function printType(type: string): Doc.Doc<never> {
  return Doc.text(`type: "${type}",`)
}

export function printProperties(obj: Readonly<_Properties>): Doc.Doc<never> {
  return Doc.vsep([
    Doc.text(`properties: {`),
    Doc.indent(
      Doc.vsep(
        Object.entries(obj).map(([k, v]) =>
          Doc.hcat([Doc.text(`${k}: `), printValue(v), Doc.text(`,`)])
        )
      ),
      2
    ),
    Doc.text(`},`),
  ])
}

export function printCrs(obj: Readonly<_Crs>): Doc.Doc<never> {
  return Doc.vsep([
    Doc.text(`crs: {`),
    Doc.indent(
      Doc.vsep([printType(obj.type), printProperties(obj.properties)]),
      2
    ),
    Doc.text(`}`),
  ])
}

export function printCoordinates(
  objs: Readonly<_Coordinates>,
  top: boolean
): Doc.Doc<never> {
  return Doc.vsep([
    Doc.text(top ? `coordinates: [` : `[`),
    Doc.indent(
      Doc.vsep(
        objs.map((obj) =>
          typeof obj === 'number'
            ? printValue(obj)
            : printCoordinates(obj, false)
        )
      ),
      2
    ),
    Doc.text(`],`),
  ])
}

export function printGeometry(obj: Readonly<_Geometry>): Doc.Doc<never> {
  return Doc.vsep([
    Doc.text(`geometry: {`),
    Doc.indent(
      Doc.vsep([printType(obj.type), printCoordinates(obj.coordinates, true)]),
      2
    ),
    Doc.text(`},`),
  ])
}

export function printFeature(obj: Readonly<_Feature>): Doc.Doc<never> {
  return Doc.vsep([
    Doc.text(`{`),
    Doc.indent(
      Doc.vsep([
        printType(obj.type),
        printProperties(obj.properties),
        printGeometry(obj.geometry),
      ]),
      2
    ),
    Doc.text(`},`),
  ])
}

export function printFeatureCollection(
  obj: Readonly<_FeatureCollection>
): Doc.Doc<never> {
  return Doc.vsep([
    Doc.text(`{`),
    Doc.indent(
      Doc.vsep([
        printType(obj.type),
        Doc.text(`features: [`),
        Doc.indent(Doc.vsep(obj.features.map((o) => printFeature(o))), 2),
        Doc.text(`],`),
      ]),
      2
    ),
    Doc.text(`},`),
  ])
}

export function printFeatures(objs: Readonly<_Features>): Doc.Doc<never> {
  return Doc.vsep([
    Doc.text(`features: [`),
    Doc.indent(
      Doc.vsep(
        objs.map((obj) =>
          obj.type === 'Feature'
            ? printFeature(obj)
            : printFeatureCollection(obj)
        )
      ),
      2
    ),
    Doc.text(`],`),
  ])
}

export function printGeoJSON(obj: Readonly<_GeoJSON>): Doc.Doc<never> {
  return Doc.vsep([
    Doc.text(`{`),
    Doc.indent(
      Doc.vsep([
        printType(obj.type),
        Doc.text(`name: '${obj.name}',`),
        obj.crs === undefined ? Doc.empty : printCrs(obj.crs),
        printFeatures(obj.features),
      ]),
      2
    ),
    Doc.text(`},`),
  ])
}
